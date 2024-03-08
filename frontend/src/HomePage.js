import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [merchantList, setMerchantList] = useState([]);
  const [filteredMerchantList, setFilteredMerchantList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchListOfMerchant = async () => {
      try {
        let dataOfMerchant = await fetch(
          "https://brdautomate.onrender.com/merchantName"
        );
        let response = await dataOfMerchant.json();
        let lastMerchantList = await response.reverse();
        setMerchantList(lastMerchantList);
        setFilteredMerchantList(lastMerchantList);
      } catch (e) {
        console.log("Error while fetching Merchant Name from frontEND");
      }
    };

    fetchListOfMerchant();
  }, []);

  useEffect(() => {
    const filteredList = merchantList.filter((merchant) =>
      merchant[0].toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMerchantList(filteredList);
    setCurrentPage(1);
  }, [merchantList, searchQuery]);

  const totalPages = Math.ceil(filteredMerchantList.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredMerchantList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Merchant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Merchant Name</th>
            <th
              style={{
                display: "flex",
                justifyContent: "end",
                marginRight: "5px",
              }}
            >
              View Data
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((merchant, index) => (
            <tr key={index}>
              <td>{merchant[0]}</td>
              <td className="button_area">
                <Link to={`/pdfCreator?merchantName=${merchant[0]}`}>
                  <button className="action-button">View PDF</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        <tbody>
          {totalPages > 1 ? (
            <tr>
              <td colSpan="2">
                {totalPages > 1 && (
                  <div className="pagination_section">
                    <button
                      className="button-pagination"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="button-pagination"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ) : (
            ""
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
