const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const fs = require("fs");

const fileName = "TimesJobDataUpdated.html";
const excelFileName = "TimesJobDataUpdated.xlsx";

const fetchTimesJobHTML = async () => {
  try {
    const { data: html } = await axios.get(
      "https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35"
    );

    fs.writeFileSync(fileName, html, "utf-8");
    console.log(`HTML saved to ${fileName}`);

    const savedHtml = fs.readFileSync(fileName, "utf-8");
    const $ = cheerio.load(savedHtml);

    const jobData = [];
    $("h2.heading-trun a").each((i, elem) => {
      jobData.push({ Title: $(elem).text() });
    });
    $("h3.joblist-comp-name").each((i, elem) => {
      jobData[i]["Company Name"] = $(elem).text();
    });
    $("li.srp-zindex.location-tru").each((i, elem) => {
      jobData[i]["Location"] = $(elem).attr("title");
    });
    $("li.job-description__").each((i, elem) => {
      jobData[i]["Job Description"] = $(elem).text();
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

fetchTimesJobHTML();
