const {
  fetchHeaderFromSheet,
  fetchMerchantName,
  getMerchantDataFromInput,
} = require("./modules.js");
const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/merchantName", async (req, res) => {
  try {
    let merchantName = await fetchMerchantName();
    res.send(merchantName);
  } catch (e) {
    res.send(500, "Internal Server Error");
    console.log(e);
  }
});

app.post("/getDataForMerchant", async (req, res) => {
  try {
    let merchantName = req?.body.name.trim();
    let merchantData = await getMerchantDataFromInput(merchantName);
    let headerForData = await fetchHeaderFromSheet();

    const resultObject = {};

    for (let i = 0; i < headerForData.length; i++) {
      resultObject[headerForData[i]] = merchantData[0][i];
    }

    res.send(resultObject);
  } catch (e) {
    res.send(500, "Internal Server Error");
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
