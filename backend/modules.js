const { google } = require("googleapis");
require("dotenv").config();

//Authentication
async function authenticateSheet(sheetRange) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
      },
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1_qyLIQaN1Vfukx71LuiupaVk5Si8Ja5Jt-Oh3iPNwjI";

    const getRows = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange,
    });

    return getRows?.data?.values;
  } catch (e) {
    console.log("Problem while authentication");
  }
}

//Headers From Sheet
async function fetchHeaderFromSheet() {
  try {
    const dataFromSheet = await authenticateSheet("Form responses 1!A:AR");
    const headerRow = dataFromSheet[0];
    return headerRow;
  } catch (e) {
    console.error("Problem While Fetching Header");
  }
}

//MerchantName From Sheet
async function fetchMerchantName() {
  try {
    const merchantName = await authenticateSheet("Form responses 1!AK2:AK");
    return merchantName;
  } catch (e) {
    console.error("Problem While Fetching Merchant");
  }
}

//Data For Particular Merchant
async function getMerchantDataFromInput(merchantName) {
  try {
    const sanitizedMerchantName = merchantName
      .replace(/[.-]/g, "")
      .trim()
      .toLowerCase();

    const dataFromSheet = await authenticateSheet("Form responses 1!A:AR");
    const headerRow = dataFromSheet[0];
    const columnAKIndex = headerRow.findIndex(
      (header) => header === "Merchant Name"
    );
    if (columnAKIndex === -1) {
      throw new Error("Column AK not found in the header row.");
    }
    const matchingRows = dataFromSheet.filter(
      (row) =>
        row[columnAKIndex].replace(/[.-]/g, "").trim().toLowerCase() ===
        sanitizedMerchantName
    );

    return matchingRows;
  } catch (e) {
    console.log("Problem While Fetching Merchant Data");
  }
}

module.exports = {
  authenticateSheet,
  fetchHeaderFromSheet,
  fetchMerchantName,
  getMerchantDataFromInput,
};
