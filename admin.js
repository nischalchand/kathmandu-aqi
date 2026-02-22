const BASE_URL = "https://kathmandu-aqi-production-ec2c.up.railway.app";
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "ADMIN") window.location.href = "access.html";

const usersList = document.getElementById("users");
const symptomsList = document.getElementById("symptoms");

async function loadUsers(){
  try {
    const res = await fetch(`${BASE_URL}/api/admin/users`);
    if (!res.ok) throw new Error("Failed to load users");
    const data = await res.json();
    usersList.innerHTML = data.map(u =>
      `<li>
        <span>${u.email}</span>
        <button class="btn-danger" onclick="del(${u.id})">Delete</button>
       </li>`
    ).join("");
  } catch (err) {
    usersList.innerHTML = "<li>Error loading users</li>";
  }
}

async function del(id){
  if(!confirm("Are you sure you want to delete this user?")) return;
  try {
    await fetch(`${BASE_URL}/api/admin/users/${id}`,{method:"DELETE"});
    loadUsers();
  } catch(err) {
    alert("Failed to delete user");
  }
}

async function loadSymptoms(){
  try {
    const res = await fetch(`${BASE_URL}/api/admin/symptoms`);
    if (!res.ok) throw new Error("Failed to load symptoms");
    const data = await res.json();
    symptomsList.innerHTML = data.map(s =>
      `<li>User ID: ${s.userId} – ${s.symptom} (Sev: ${s.severity})</li>`
    ).join("");
  } catch (err) {
    symptomsList.innerHTML = "<li>Error loading symptoms</li>";
  }
}

loadUsers();
loadSymptoms();