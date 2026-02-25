const BASE_URL = "https://kathmandu-aqi-production-ec2c.up.railway.app";

/* ================= LOGIN ================= */
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) return alert("Enter email & password");

  try {
    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    if (!data) throw new Error();

    localStorage.setItem("user", JSON.stringify(data));

    const role = data.role || (data.user && data.user.role);
    window.location.href = role === "ADMIN" ? "admin.html" : "dashboard.html";
  } catch {
    alert("Login failed");
  }
}

/* ================= REGISTER ================= */
async function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!name || !email || !password) return alert("Fill all fields");

  try {
    const res = await fetch(`${BASE_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) throw new Error();

    alert("Registered — login now");

    regName.value = "";
    regEmail.value = "";
    regPassword.value = "";
  } catch {
    alert("Register failed");
  }
}
