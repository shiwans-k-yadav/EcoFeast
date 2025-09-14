// ===== Smooth Scroll for Navbar Links =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== Animated Counter Function =====
function animateCounter(id, target, duration = 5000) {
    const element = document.getElementById(id);
    let start = 0;
    element.textContent = "0"; // reset before each animation

    const increment = Math.ceil(target / (duration / 20)); // update every 20ms
    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(counter);
        } else {
            element.textContent = start.toLocaleString();
        }
    }, 20);
}

// ===== Start Counters Function =====
function startAllCounters() {
    animateCounter('daily-production', 27);
    animateCounter('daily-consumption', 23.6);
    animateCounter('daily-wastage', 3.5);


    animateCounter('china-wastage', 295890);
    animateCounter('usa-wastage', 164384);
    animateCounter('brazil-wastage', 72000);
    animateCounter('uk-wastage', 29300);
    animateCounter('india-wastage', 188400);
}

// ===== IntersectionObserver Setup =====
const statsSection = document.querySelector('#stats'); // Replace with your section ID

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startAllCounters(); // Run every time section is visible
        }
    });
}, { threshold: 0.4 });

observer.observe(statsSection);


// For the pop up
// Modal functionality
const loginModal = document.getElementById("loginModal");
const openModalBtn = document.getElementById("openLoginModal");
const closeModalBtn = document.querySelector(".close-modal");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const modalTitle = document.getElementById("modal-title");
const switchToSignup = document.getElementById("switchToSignup");
const switchToLogin = document.getElementById("switchToLogin");

// Open Modal
openModalBtn.addEventListener("click", () => {
  loginModal.style.display = "flex";
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  modalTitle.textContent = "Login";
});

// Close Modal
closeModalBtn.addEventListener("click", () => {
  loginModal.style.display = "none";
});

// Close modal on outside click
window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
});

// Switch to Signup
switchToSignup.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  modalTitle.textContent = "Sign Up";
});

// Switch to Login
switchToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  modalTitle.textContent = "Login";
});


// get started button pop up
// Also trigger modal from Get Started button
const getStartedBtn = document.getElementById("getStartedBtn");

if (getStartedBtn) {
  getStartedBtn.addEventListener("click", (e) => {
    e.preventDefault(); // prevent page jump
    loginModal.style.display = "flex";
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    modalTitle.textContent = "Login"; // or "Get Started" if you want custom text
  });
}




// localstorage
// Switch between login and signup forms
document.getElementById("switchToSignup").addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("modal-title").textContent = "Sign Up";
});

document.getElementById("switchToLogin").addEventListener("click", () => {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("modal-title").textContent = "Login";
});

// Signup Form Submit
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  // Save to localStorage
  localStorage.setItem(
    "user",
    JSON.stringify({ name: name, email: email, password: password })
  );

  alert("Account created successfully! You can now log in.");
  document.getElementById("signupForm").reset();

  // Switch to login form
  document.getElementById("switchToLogin").click();
});

// Login Form Submit
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser && storedUser.email === email && storedUser.password === password) {
    alert("Welcome back, " + storedUser.name + "!");
    // Redirect to profile page
    window.location.href = "profile.html";
  } else {
    alert("Invalid email or password!");
  }
});
