const API_URL =
  "https://kathmandu-aqi-production.up.railway.app/api/aqi/kathmandu";

const cardsContainer = document.getElementById("aqi-cards");
const summaryText = document.getElementById("summary-text");

function getAQIClass(aqi) {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "unhealthy";
  return "very-unhealthy";
}

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    console.log("RAW API DATA:", data); // keep this

    cardsContainer.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      summaryText.textContent = "No AQI stations available.";
      return;
    }

    let unhealthyCount = 0;

    data.forEach(item => {
      // SAFE FIELD MAPPING
      const stationName =
        item.station ||
        item.station_name ||
        item.name ||
        "AQI Station";

      const pm25 =
        item.pm25 ??
        item.pm_2_5 ??
        item.pm25_value ??
        "N/A";

      const aqi =
        item.aqi ??
        item.aqi_index ??
        item.index ??
        "N/A";

      const category =
        item.category ||
        item.level ||
        "Unhealthy";

      const aqiClass =
        typeof aqi === "number" ? getAQIClass(aqi) : "unhealthy";

      if (aqiClass !== "good") unhealthyCount++;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${stationName}</h3>
        <p><strong>PM2.5:</strong> ${pm25}</p>
        <p><strong>AQI:</strong> ${aqi}</p>
        <span class="badge ${aqiClass}">
          ${category}
        </span>
      `;

      cardsContainer.appendChild(card);
    });

    summaryText.textContent =
      unhealthyCount > data.length / 2
        ? "Air quality is mostly unhealthy today. Limit outdoor exposure."
        : "Air quality is relatively stable today.";
  })
  .catch(err => {
    console.error("FETCH ERROR:", err);
    summaryText.textContent =
      "Failed to load AQI data. Please try again later.";
  });