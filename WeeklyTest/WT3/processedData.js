const fs = require("fs");

function getTop10(data, key) {
  return data.sort((a, b) => b[key] - a[key]).slice(0, 10);
}

function processSeasonData(seasonData) {
  if (!Array.isArray(seasonData)) {
    return {};
  }

  const topOrangeCap = getTop10([...seasonData], "runs");
  const topFours = getTop10([...seasonData], "fours");
  const topSixes = getTop10([...seasonData], "sixes");
  const topCenturies = getTop10([...seasonData], "centuries");
  const topFifties = getTop10([...seasonData], "fifties");

  return {
    orangeCap: topOrangeCap,
    mostFours: topFours,
    mostSixes: topSixes,
    mostCenturies: topCenturies,
    mostFifties: topFifties,
  };
}

function processAllSeasons(rawData) {
  const processed = {};

  for (const season in rawData) {
    if (rawData.hasOwnProperty(season)) {
      processed[season] = processSeasonData(rawData[season]);
    }
  }

  return processed;
}

(function main() {
  try {
    const rawData = JSON.parse(
      fs.readFileSync("last5seasonsData1.json", "utf-8")
    );
    const processedData = processAllSeasons(rawData);

    fs.writeFileSync(
      "processedData1.json",
      JSON.stringify(processedData, null, 2),
      "utf-8"
    );
    console.log("Processed data saved to processedData.json");
  } catch (error) {
    console.error("Error processing data:", error);
  }
})();
