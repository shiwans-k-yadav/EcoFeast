// ==== Variables ====
const avatarImg = document.getElementById("avatar-img");
const avatarInput = document.getElementById("avatar-input");
const removeAvatar = document.getElementById("remove-avatar");
const streakDisplay = document.getElementById("streak-display");
const badgeDisplay = document.getElementById("badge-display");
const dateTime = document.getElementById("date-time");

const inventoryForm = document.getElementById("inventoryForm");
const inventoryTableBody = document.querySelector("#inventoryTable tbody");

const wasteForm = document.getElementById("wasteForm");
const wasteChart = document.getElementById("wasteChart");

const aiPrompt = document.getElementById("aiPrompt");
const askAI = document.getElementById("askAI");
const aiResponse = document.getElementById("aiResponse");

const currentUserId = 1; // replace with real logged-in user id

// ==== Date & Welcome ====
function updateDateTime() {
  const now = new Date();
  dateTime.textContent = now.toLocaleString();
}
updateDateTime();
setInterval(updateDateTime, 60000);

// ==== Avatar Upload ====
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => avatarImg.src = reader.result;
  reader.readAsDataURL(file);

  // TODO: send avatar to backend
});

removeAvatar.addEventListener("click", () => {
  avatarImg.src = "assets/default-avatar.png";
  // TODO: remove avatar in backend
});

// ==== Wastage Tracker Logic ====
const wasteData = [];
const wasteLabels = [];
const chart = new Chart(wasteChart, {
  type: 'line',
  data: {
    labels: wasteLabels,
    datasets: [{
      label: 'Wastage (kg)',
      data: wasteData,
      borderColor: 'red',
      fill: false
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

wasteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const qty = parseFloat(document.getElementById("wasteQty").value);
  const date = new Date().toLocaleDateString();
  wasteData.push(qty);
  wasteLabels.push(date);
  chart.update();

  // TODO: save wastage to backend

  wasteForm.reset();
});