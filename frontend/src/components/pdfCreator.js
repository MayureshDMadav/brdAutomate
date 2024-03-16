import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import backgroundImage from "../imageHeader.png";

const PdfCreator = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const merchantName = searchParams.get("merchantName");
  const [merchantData, setMerchantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputValues, setInputValues] = useState({});
  const [changesMade, setChangesMade] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_GET_DATA_FROM_MERCHANT}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: merchantName }),
          }
        );
        const data = await response.json();
        setMerchantData(data);
        setInputValues(data);
      } catch (error) {
        console.error("Error fetching merchant data from FrontEnd");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [merchantName]);

  const handlePrintPDF = () => {
    if (validateInputs()) {
      window.print();
    }
  };

  const handleInputChange = (key, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setChangesMade(true);
  };

  const handleSaveOrPrint = () => {
    if (changesMade) {
      if (validateInputs()) {
        setMerchantData(inputValues);
        setSaved(true);
        setChangesMade(false);
      }
    } else {
      handlePrintPDF();
    }
  };

  const validateInputs = () => {
    const requiredInputs = Object.keys(inputValues).filter(
      (key) => merchantData[key] !== null
    );

    for (const key of requiredInputs) {
      if (!inputValues[key]) {
        alert(`Please fill in the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  return (
    <div className="pdf-creator-container">
      <Link to={`/`}>
        <button className="action-button">HomePage</button>
      </Link>
      {!merchantData ? (
        <div className="loader"></div>
      ) : (
        <>
          <div className="head-section">
            <img
              src={backgroundImage}
              alt="Background"
              className="background-image"
            />
            <div className="overlay"></div>
          </div>
          <h1 className="heading">
            {merchantName
              ? "BRD For Merchant : " + merchantName
              : "No Merchant Name Found"}{" "}
            <button className="action-button" onClick={handleSaveOrPrint}>
              {changesMade ? "Save" : "Print PDF"}
            </button>
          </h1>

          <div className="merchant-data-container">
            {Object.entries(merchantData).map(([key, value]) => (
              <div
                key={key}
                className={`merchant-data-item ${
                  !value && !inputValues[key] && "highlight-red"
                }`}
              >
                <span
                  className={`key ${
                    !value && !inputValues[key] ? "highlight-red" : ""
                  }`}
                >
                  {key}
                </span>
                <span>:</span>
                {saved ? (
                  <span className="value">{value}</span>
                ) : (
                  <input
                    type="text"
                    className="value"
                    value={inputValues[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PdfCreator;
