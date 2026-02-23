const navLinks = document.getElementById("navLinks");
const user = JSON.parse(localStorage.getItem("user"));

function renderNav() {
  if (!user) {
    navLinks.innerHTML = `
      <a href="access.html" class="nav-link">Login</a>
    `;
  } else {
    const role = user.role || (user.user && user.user.role);

    if (role === "ADMIN") {
      navLinks.innerHTML = `
        <a href="dashboard.html" class="nav-link">Dashboard</a>
        <a href="admin.html" class="nav-link">Admin</a>
        <button onclick="logout()">Logout</button>
      `;
    } else {
      navLinks.innerHTML = `
        <a href="dashboard.html" class="nav-link">Dashboard</a>
        <button onclick="logout()">Logout</button>
      `;
    }
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "access.html";
}

renderNav();

const BASE = "https://corsproxy.io/?https://kathmandu-aqi-production-ec2c.up.railway.app/api/aqi";

const stationSelect = document.getElementById("stationSelect");
const card = document.getElementById("aqiCard");
const historySection = document.getElementById("history");

const stationNameEl = document.getElementById("stationName");
const aqiValueEl = document.getElementById("aqiValue");
const aqiCategoryEl = document.getElementById("aqiCategory");
const pm25El = document.getElementById("pm25");
const healthEnEl = document.getElementById("healthEn");
const healthNeEl = document.getElementById("healthNe");
const lastUpdatedEl = document.getElementById("lastUpdated");
const historyList = document.getElementById("historyList");

const AQI_COLORS = [
  { max: 50, color: "#00E400" },
  { max: 100, color: "#FFFF00" },
  { max: 150, color: "#FF7E00" },
  { max: 200, color: "#FF0000" },
  { max: 300, color: "#8F3F97" },
  { max: 500, color: "#7E0023" }
];

function getAqiColor(aqi) {
  return AQI_COLORS.find(r => aqi <= r.max)?.color || "#7E0023";
}

/* ---------------- GLOBAL STATION STORAGE ---------------- */
let stationsData = [];
let userLat = null;
let userLon = null;

/* ---------------- GEOLOCATION ---------------- */
function requestLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    pos => {
      userLat = pos.coords.latitude;
      userLon = pos.coords.longitude;
      autoSelectNearestStation();
    },
    () => {
      // fallback to first station
      if (stationsData.length > 0) showStation(stationsData[0]);
    }
  );
}

/* ---------------- HAVERSINE DISTANCE ---------------- */
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* ---------------- AUTO NEAREST STATION ---------------- */
function autoSelectNearestStation() {
  if (!userLat || !userLon || stationsData.length === 0) return;

  // IMPORTANT: API must send lat/lon for each station
  let nearestIndex = 0;
  let minDist = Infinity;

  stationsData.forEach((s, i) => {
    if (!s.lat || !s.lon) return;
    const d = distance(userLat, userLon, s.lat, s.lon);
    if (d < minDist) {
      minDist = d;
      nearestIndex = i;
    }
  });

  stationSelect.value = nearestIndex;
  showStation(stationsData[nearestIndex]);
}

/* ---------------- LOAD STATIONS ---------------- */
async function loadStations() {
  try {
    const res = await fetch(`${BASE}/kathmandu`);
    if (!res.ok) throw new Error("Network response failed");
    stationsData = await res.json();

    stationSelect.innerHTML = "";
    stationsData.forEach((s, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = s.stationName;
      stationSelect.appendChild(opt);
    });

    requestLocation(); // ask location AFTER stations load

  } catch (error) {
    stationSelect.innerHTML = "<option>Failed to load data</option>";
    console.error("Error loading stations:", error);
  }
}

/* ---------------- SHOW STATION ---------------- */
function showStation(station) {
  card.classList.remove("hidden");

  stationNameEl.textContent = station.stationName;
  aqiValueEl.textContent = station.aqi;
  aqiCategoryEl.textContent = station.category;

  pm25El.textContent = station.pm25 ? Number(station.pm25).toFixed(2) : "N/A";

  healthEnEl.textContent = station.healthAdviceEn;
  healthNeEl.textContent = station.healthAdviceNe;
  lastUpdatedEl.textContent = station.lastUpdated
    ? new Date(station.lastUpdated).toLocaleString()
    : "Unknown Date";

  const color = getAqiColor(station.aqi);
  card.style.background = color;
  card.style.color = station.aqi <= 100 ? "#000" : "#fff";

  loadHistory(station.stationName);
}

/* ---------------- HISTORY ---------------- */
async function loadHistory(stationName) {
  historySection.classList.remove("hidden");
  historyList.innerHTML = "<li>Loading…</li>";

  try {
    const targetUrl = encodeURIComponent(`https://kathmandu-aqi-production-ec2c.up.railway.app/api/aqi/kathmandu/history?station=${stationName}`);
    const proxyUrl = `https://corsproxy.io/?${targetUrl}`;

    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("Failed to load history");
    const data = await res.json();

    historyList.innerHTML = "";
    if (data.length === 0) {
      historyList.innerHTML = "<li>No history available</li>";
      return;
    }

    data.forEach(h => {
      const li = document.createElement("li");
      const dateValue = h.timestamp || h.lastUpdated || h.createdAt || h.date;
      const formattedDate = dateValue && !isNaN(new Date(dateValue))
        ? new Date(dateValue).toLocaleString()
        : "Unknown Date";

      li.textContent = `${formattedDate} → AQI ${h.aqi}`;
      historyList.appendChild(li);
    });

  } catch {
    historyList.innerHTML = "<li>Failed to load history</li>";
  }
}

/* ---------------- MANUAL SELECT ---------------- */
stationSelect.addEventListener("change", () => {
  showStation(stationsData[stationSelect.value]);
});

loadStations();
