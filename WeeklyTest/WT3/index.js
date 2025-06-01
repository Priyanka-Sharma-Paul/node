const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeData(season) {
  const url = `https://www.iplt20.com/stats/${season}`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "networkidle2" });

  //for debugging
  const htmlContent = await page.content();
  console.log("Page content snippet:", htmlContent.substring(0, 1000));

  try {
    await page.waitForSelector("table.st-table", { timeout: 60000 });
  } catch (error) {
    console.error(
      'Selector "table.st-table" not found within timeout. Taking screenshot for debugging.'
    );
    await page.screenshot({ path: "debug.png", fullPage: true });
    throw error;
  }

  try {
    await page.waitForFunction(
      () => {
        const table = document.querySelector("table.st-table");
        return table && table.querySelectorAll("tbody tr").length > 0;
      },
      { timeout: 60000 }
    );
  } catch (error) {
    console.error(
      "Table rows not found within timeout. Taking screenshot for debugging."
    );
    await page.screenshot({ path: "debug-rows.png", fullPage: true });
    throw error;
  }

  const data = await page.evaluate(() => {
    const rows = Array.from(
      document.querySelectorAll("table.st-table tbody tr")
    );

    const extractedData = rows
      .map((row) => {
        const cols = row.querySelectorAll("td");
        if (!cols || cols.length < 7) return null;

        return {
          rank: cols[0].innerText.trim(),
          player: cols[1].innerText.trim(),
          runs: parseInt(cols[2].innerText.trim().replace(/,/g, "")) || 0,
          fours: parseInt(cols[3].innerText.trim()) || 0,
          sixes: parseInt(cols[4].innerText.trim()) || 0,
          centuries: parseInt(cols[5].innerText.trim()) || 0,
          fifties: parseInt(cols[6].innerText.trim()) || 0,
        };
      })
      .filter((item) => item !== null);
    return extractedData;
  });

  await browser.close();
  return data;
}

(async () => {
  const seasons = ["2024", "2023", "2022", "2021", "2020"];
  const allSeasonData = {};

  for (const season of seasons) {
    console.log(`Scraping data for season ${season}...`);
    try {
      const seasonData = await scrapeData(season);
      allSeasonData[season] = seasonData;
      console.log(`Season ${season} data scraped.`);
    } catch (error) {
      console.error(`Error scraping season ${season}:`, error);
    }
  }

  fs.writeFileSync(
    "last5seasonsData1.json",
    JSON.stringify(allSeasonData, null, 2),
    "utf-8"
  );
  console.log("Data for the last 5 seasons saved to last5seasonsData.json");
})();
