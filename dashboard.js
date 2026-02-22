const BASE_URL = "https://kathmandu-aqi-production-ec2c.up.railway.app";
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "access.html";

const AQI_COLORS = [
  [50,"#00E400"], [100,"#FFFF00"], [150,"#FF7E00"],
  [200,"#FF0000"], [300,"#8F3F97"], [500,"#7E0023"]
];

function getColor(aqi){
  const match = AQI_COLORS.find(x => aqi <= x[0]);
  return match ? match[1] : "#7E0023";
}

const aqiContainer = document.getElementById("aqi");
const symptomList = document.getElementById("symptomList");
const exposureList = document.getElementById("exposureList");

async function loadAQI(){
  try {
    const res = await fetch(`${BASE_URL}/api/aqi/kathmandu`);
    const data = await res.json();
    aqiContainer.innerHTML = data.map(s => {
      const color = getColor(s.aqi);
      const textColor = s.aqi <= 100 ? "#000" : "#fff";
      return `<div class="aqi-item" style="background:${color}; color:${textColor};">
        <strong>${s.stationName}</strong> – AQI ${s.aqi}
       </div>`;
    }).join("");
  } catch (err) {
    aqiContainer.innerHTML = "<p>Failed to load live AQI.</p>";
  }
}

async function logSymptom(){
  const symptomInput = document.getElementById("symptom").value;
  const severityInput = document.getElementById("severity").value;
  const notesInput = document.getElementById("notes").value;

  if(!symptomInput || !severityInput) {
    alert("Please provide a symptom and severity level.");
    return;
  }

  try {
    await fetch(`${BASE_URL}/api/symptoms/log`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        userId: user.id,
        symptom: symptomInput,
        severity: severityInput,
        notes: notesInput
      })
    });
    
    alert("Symptom logged!");
    document.getElementById("symptom").value = "";
    document.getElementById("severity").value = "";
    document.getElementById("notes").value = "";
    loadSymptoms();
  } catch(err) {
    alert("Failed to log symptom.");
  }
}

async function loadSymptoms(){
  try {
    const res = await fetch(`${BASE_URL}/api/symptoms/user/${user.id}`);
    const data = await res.json();
    symptomList.innerHTML = data.map(s =>
      `<li>
        <div><strong>${s.symptom}</strong> (Severity: ${s.severity})<br>
        <small style="opacity:0.7">${s.notes || "No notes"}</small></div>
      </li>`
    ).join("");
    if (data.length === 0) symptomList.innerHTML = "<li>No symptoms logged yet.</li>";
  } catch(err) {
    symptomList.innerHTML = "<li>Failed to load symptoms.</li>";
  }
}

async function logExposure(){
  const locationInput = document.getElementById("exposureLocation").value;
  const aqiInput = document.getElementById("exposureAqi").value;
  const durationInput = document.getElementById("exposureDuration").value;

  if(!locationInput || !aqiInput || !durationInput) {
    alert("Please fill all exposure fields.");
    return;
  }

  try {
    await fetch(`${BASE_URL}/api/exposure/log`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        userId: user.id,
        location: locationInput,
        aqi: aqiInput,
        durationMinutes: durationInput
      })
    });
    
    alert("Exposure logged!");
    document.getElementById("exposureLocation").value = "";
    document.getElementById("exposureAqi").value = "";
    document.getElementById("exposureDuration").value = "";
    loadExposure();
  } catch(err) {
    alert("Failed to log exposure.");
  }
}

async function loadExposure(){
  try {
    const res = await fetch(`${BASE_URL}/api/exposure/user/${user.id}`);
    const data = await res.json();
    exposureList.innerHTML = data.map(e =>
      `<li>${e.location} – AQI ${e.aqi} (${e.durationMinutes} mins)</li>`
    ).join("");
    if (data.length === 0) exposureList.innerHTML = "<li>No exposures logged yet.</li>";
  } catch(err) {
    exposureList.innerHTML = "<li>Failed to load exposure history.</li>";
  }
}

loadAQI();
loadSymptoms();
loadExposure();