import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PdfCreator = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const merchantName = searchParams.get("merchantName");
  const [merchantData, setMerchantData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/getDataForMerchant",
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
      } catch (error) {
        console.error("Error fetching merchant data:", error);
      }
    };

    fetchData();
  }, [merchantName]);

  const handlePrintPDF = () => {
    window.print();
  };

  const renderMerchantData = () => {
    if (!merchantData) return null;

    return Object.entries(merchantData).map(([key, value]) => (
      <div key={key} className="merchant-data-item">
        <span className="key">{key}</span>
        <span>:</span>
        <span className="value">{value}</span>
      </div>
    ));
  };

  return (
    <div className="pdf-creator-container">
      <h1 className="heading">
        {merchantName
          ? "BRD For Merchant : " + merchantName
          : "No Merchant Name Found"}{" "}
        <button className="action-button" onClick={handlePrintPDF}>
          Print PDF
        </button>
      </h1>

      <div className="merchant-data-container">{renderMerchantData()}</div>
    </div>
  );
};

export default PdfCreator;
