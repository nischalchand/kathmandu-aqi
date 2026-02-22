const navLinks = document.getElementById("navLinks");
const user = JSON.parse(localStorage.getItem("user"));

function renderNav() {
  if (!user) {
    navLinks.innerHTML = `
      <a href="access.html" class="nav-link">Login</a>
    `;
  } else {
    // FIX: Check for direct role OR nested role just in case backend wraps user data
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

async function loadStations() {
  try {
    const res = await fetch(`${BASE}/kathmandu`);
    if (!res.ok) throw new Error("Network response failed");
    const data = await res.json();

    stationSelect.innerHTML = "";
    data.forEach((s, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = s.stationName;
      stationSelect.appendChild(opt);
    });

    if(data.length > 0) {
      showStation(data[0], data);
    } else {
      stationSelect.innerHTML = "<option>No stations available</option>";
    }
  } catch (error) {
    stationSelect.innerHTML = "<option>Failed to load data</option>";
    console.error("Error loading stations:", error);
  }
}

function showStation(station, allStations) {
  card.classList.remove("hidden");
  
  stationNameEl.textContent = station.stationName;
  aqiValueEl.textContent = station.aqi;
  aqiCategoryEl.textContent = station.category;
  
  // FIX: Round PM2.5 to 2 decimal places to prevent long text overflow
  pm25El.textContent = station.pm25 ? Number(station.pm25).toFixed(2) : "N/A";
  
  healthEnEl.textContent = station.healthAdviceEn;
  healthNeEl.textContent = station.healthAdviceNe;
  lastUpdatedEl.textContent = station.lastUpdated ? new Date(station.lastUpdated).toLocaleString() : "Unknown Date";

  const color = getAqiColor(station.aqi);
  card.style.background = color;
  card.style.color = station.aqi <= 100 ? "#000" : "#fff";

  loadHistory(station.stationName);
}

async function loadHistory(stationName) {
  historySection.classList.remove("hidden");
  historyList.innerHTML = "<li>Loading…</li>";

  try {
    const res = await fetch(`${BASE}/kathmandu/history?station=${encodeURIComponent(stationName)}`);
    if (!res.ok) throw new Error("Failed to load history");
    const data = await res.json();

    historyList.innerHTML = "";
    if (data.length === 0) {
       historyList.innerHTML = "<li>No history available</li>";
       return;
    }

    data.forEach(h => {
      const li = document.createElement("li");
      
      // FIX: Check multiple possible names your backend might use for the date
      const dateValue = h.timestamp || h.lastUpdated || h.createdAt || h.date;
      
      // FIX: Verify it's a real date before turning it into a string, fallback to "Unknown Date"
      const isValidDate = dateValue && !isNaN(new Date(dateValue).getTime());
      const formattedDate = isValidDate ? new Date(dateValue).toLocaleString() : "Unknown Date";

      li.textContent = `${formattedDate} → AQI ${h.aqi}`;
      historyList.appendChild(li);
    });
  } catch (error) {
    historyList.innerHTML = "<li>Failed to load history</li>";
  }
}

stationSelect.addEventListener("change", async () => {
  try {
    const res = await fetch(`${BASE}/kathmandu`);
    const data = await res.json();
    showStation(data[stationSelect.value], data);
  } catch(err) {
    console.error("Error changing station:", err);
  }
});

loadStations();
