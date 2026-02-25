/* ================= SAFE USER ================= */
let user = null;
try {
  const stored = localStorage.getItem("user");
  user = stored ? JSON.parse(stored) : null;
} catch {
  localStorage.removeItem("user");
  user = null;
}

/* ================= NAV ================= */
const navLinks = document.getElementById("navLinks");

function renderNav() {
  if (!navLinks) return;

  if (!user) {
    navLinks.innerHTML = `<a href="access.html" class="nav-link">Login</a>`;
    return;
  }

  const role = user.role || (user.user && user.user.role);

  navLinks.innerHTML =
    role === "ADMIN"
      ? `
      <a href="dashboard.html" class="nav-link">Dashboard</a>
      <a href="admin.html" class="nav-link">Admin</a>
      <button onclick="logout()">Logout</button>
    `
      : `
      <a href="dashboard.html" class="nav-link">Dashboard</a>
      <button onclick="logout()">Logout</button>
    `;
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "access.html";
}

renderNav();

/* ================= AQI ================= */
const BASE = "https://kathmandu-aqi-production-ec2c.up.railway.app/api/aqi";

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

let stationsData = [];
let userLat = null;
let userLon = null;

/* ================= GEOLOCATION ================= */
function requestLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    pos => {
      userLat = pos.coords.latitude;
      userLon = pos.coords.longitude;
      autoSelectNearestStation();
    },
    () => stationsData.length && showStation(stationsData[0])
  );
}

/* ================= DISTANCE ================= */
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/* ================= AUTO NEAREST ================= */
function autoSelectNearestStation() {
  if (!userLat || !userLon || !stationsData.length) return;

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

/* ================= LOAD STATIONS ================= */
async function loadStations() {
  try {
    const res = await fetch(`${BASE}/kathmandu`);
    if (!res.ok) throw new Error();

    stationsData = await res.json();

    if (!stationSelect) return;

    stationSelect.innerHTML = "";
    stationsData.forEach((s, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = s.stationName;
      stationSelect.appendChild(opt);
    });

    requestLocation();
  } catch {
    stationSelect && (stationSelect.innerHTML = "<option>Failed to load data</option>");
  }
}

/* ================= SHOW STATION ================= */
function showStation(station) {
  if (!station || !card) return;

  card.classList.remove("hidden");

  stationNameEl.textContent = station.stationName;
  aqiValueEl.textContent = station.aqi;
  aqiCategoryEl.textContent = station.category;
  pm25El.textContent = station.pm25 ? Number(station.pm25).toFixed(2) : "N/A";

  healthEnEl.textContent = station.healthAdviceEn;
  healthNeEl.textContent = station.healthAdviceNe;

  lastUpdatedEl.textContent = station.lastUpdated
    ? new Date(station.lastUpdated).toLocaleString()
    : "Unknown";

  const color = getAqiColor(station.aqi);
  card.style.background = color;
  card.style.color = station.aqi <= 100 ? "#000" : "#fff";

  loadHistory(station.stationName);
}

/* ================= HISTORY ================= */
async function loadHistory(stationName) {
  if (!historyList) return;

  historySection.classList.remove("hidden");
  historyList.innerHTML = "<li>Loading…</li>";

  try {
    const res = await fetch(`${BASE}/kathmandu/history?station=${encodeURIComponent(stationName)}`);
    if (!res.ok) throw new Error();

    const data = await res.json();

    historyList.innerHTML = data.length
      ? ""
      : "<li>No history available</li>";

    data.forEach(h => {
      const li = document.createElement("li");
      const date = h.timestamp || h.lastUpdated || h.createdAt || h.date;
      li.textContent = `${new Date(date).toLocaleString()} → AQI ${h.aqi}`;
      historyList.appendChild(li);
    });
  } catch {
    historyList.innerHTML = "<li>Failed to load history</li>";
  }
}

stationSelect &&
stationSelect.addEventListener("change", () => {
  showStation(stationsData[stationSelect.value]);
});

loadStations();
