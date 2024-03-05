const { google } = require("googleapis");

//Authentication
async function authenticateSheet(sheetRange) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
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
