const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const fs = require("fs");

const fileName = "Products.html";
const excelFileName = "Products.xlsx";

const fetchWebsiteProducts = async () => {
  try {
    const { data: html } = await axios.get(
      "https://manmatters.com/all-products"
    );

    fs.writeFileSync(fileName, html, "utf-8");
    console.log(`HTML saved to ${fileName}`);

    const savedHtml = fs.readFileSync(fileName, "utf-8");
    const $ = cheerio.load(savedHtml);

    const jobData = [];
    $("div.product-name-container span").each((i, elem) => {
      jobData.push({ Title: $(elem).text() });
    });
    $("div.price-ctn span.price").each((i, elem) => {
      jobData[i]["Price"] = $(elem).text();
    });
    $("div.price-ctn span.discounted-price").each((i, elem) => {
      jobData[i]["Original Price"] = $(elem).text();
    });
    $("div.ratinginfo").each((i, elem) => {
      jobData[i]["Rating"] = $(elem).first().text();
    });

    const worksheet = xlsx.utils.json_to_sheet(jobData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "ScrapedData");
    xlsx.writeFile(workbook, excelFileName);
    console.log(`Data saved to ${excelFileName}`);
  } catch (err) {
    console.log("Error fetching HTML", err);
  }
};

fetchWebsiteProducts();
