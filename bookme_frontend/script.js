// ===== Modal Handling =====
const bookingModal = document.getElementById("bookingModal");
const openBooking = document.getElementById("openBooking");
const closeBooking = document.getElementById("closeBooking");

if (openBooking) {
  openBooking.onclick = () => {
    bookingModal.style.display = "flex";
  };
}

if (closeBooking) {
  closeBooking.onclick = () => {
    bookingModal.style.display = "none";
  };
}

// ====== LOGIN FORM ======
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    // SEND TO BACKEND
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert(data.error || "Login failed");
    }
  });
}

// ====== REGISTER FORM ======
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      name: regName.value,
      email: regEmail.value,
      password: regPassword.value,
    };

    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Account created!");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Registration failed");
    }
  });
}
