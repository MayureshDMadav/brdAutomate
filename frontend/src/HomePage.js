import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [merchantList, setMerchantList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchListOfMerchant = async () => {
      try {
        let dataOfMerchant = await fetch("http://localhost:3000/merchantName");
        let response = await dataOfMerchant.json();
        setMerchantList(response);
      } catch (e) {
        console.log(e);
      }
    };

    fetchListOfMerchant();
  }, [merchantList]);

  const totalPages = Math.ceil(merchantList.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = merchantList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="App">
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
