let appointments = [];
let editingIndex = -1;
let currentMonth = 3;
let currentYear = 2026;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Header
  days.forEach((day) => {
    const div = document.createElement("div");
    div.className = "day-header";
    div.textContent = day;
    grid.appendChild(div);
  });

  const startDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const today = new Date();

  // Empty cells
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    grid.appendChild(empty);
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";

    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    if (isToday) dayDiv.classList.add("today");

    dayDiv.innerHTML = `<div class="date">${day}</div>`;

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const dayAppointments = appointments.filter((app) => app.date === dateStr);

    dayAppointments.forEach((app) => {
      const appDiv = document.createElement("div");
      appDiv.className = "appointment";
      appDiv.innerHTML = `
        <div>${app.patient}</div>
        <small>${app.time}</small>
        <div class="appointment-actions">
          <span class="material-icons" onclick="editAppointmentFromCalendar(${appointments.indexOf(app)})">edit</span>
          <span class="material-icons" onclick="deleteAppointment(${appointments.indexOf(app)})">delete</span>
        </div>
      `;
      dayDiv.appendChild(appDiv);
    });

    grid.appendChild(dayDiv);
  }

  document.getElementById("month-year").textContent =
    `${monthNames[currentMonth]} ${currentYear}`;
}

function openModal() {
  editingIndex = -1;
  document.getElementById("modal-title").textContent = "Schedule Appointment";
  document.getElementById("save-btn").textContent = "Save";
  document.getElementById("modal-date").value =
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-02`;
  document.getElementById("appointment-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("appointment-modal").style.display = "none";
}

function saveAppointment() {
  const patient = document.getElementById("patient-name").value;
  const doctor = document.getElementById("doctor-name").value;
  const hospital = document.getElementById("hospital-name").value;
  const specialty = document.getElementById("specialty").value;
  const date = document.getElementById("modal-date").value;
  const time = document.getElementById("modal-time").value;

  const appointment = { patient, doctor, hospital, specialty, date, time };

  if (editingIndex >= 0) {
    appointments[editingIndex] = appointment;
  } else {
    appointments.push(appointment);
  }

  closeModal();
  generateCalendar();
  renderDashboardTable();
}

function editAppointmentFromCalendar(index) {
  editingIndex = index;
  const app = appointments[index];
  document.getElementById("modal-title").textContent = "Edit Appointment";
  document.getElementById("save-btn").textContent = "Update";

  document.getElementById("patient-name").value = app.patient;
  document.getElementById("doctor-name").value = app.doctor;
  document.getElementById("hospital-name").value = app.hospital;
  document.getElementById("specialty").value = app.specialty;
  document.getElementById("modal-date").value = app.date;
  document.getElementById("modal-time").value = app.time;

  document.getElementById("appointment-modal").style.display = "flex";
}

function deleteAppointment(index) {
  if (confirm("Delete this appointment?")) {
    appointments.splice(index, 1);
    generateCalendar();
    renderDashboardTable();
  }
}

function renderDashboardTable(filteredAppointments = appointments) {
  const tbody = document.getElementById("appointment-table");
  tbody.innerHTML = "";

  filteredAppointments.forEach((app, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td>${app.patient}</td>
          <td>${app.doctor}</td>
          <td>${app.hospital}</td>
          <td>${app.specialty}</td>
          <td>${app.date}</td>
          <td>${app.time}</td>
          <td class="action-btns">
            <button class="edit-btn" onclick="editAppointmentFromCalendar(${appointments.indexOf(app)})"><span class="material-icons">edit</span></button>
            <button class="delete-btn" onclick="deleteAppointment(${appointments.indexOf(app)})"><span class="material-icons">delete</span></button>
          </td>
        `;
    tbody.appendChild(tr);
  });
}

function filterTable() {
  const patientFilter = document
    .getElementById("patient-search")
    .value.toLowerCase();

  const doctorFilter = document
    .getElementById("doctor-search")
    .value.toLowerCase();

  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const filtered = appointments.filter((app) => {
    const matchesPatient = app.patient.toLowerCase().includes(patientFilter);

    const matchesDoctor = app.doctor.toLowerCase().includes(doctorFilter);

    const appDate = app.date;

    let matchesDate = true;

    if (startDate && appDate < startDate) {
      matchesDate = false;
    }

    if (endDate && appDate > endDate) {
      matchesDate = false;
    }

    return matchesPatient && matchesDoctor && matchesDate;
  });

  renderDashboardTable(filtered);
}

function showCalendar(e) {
  if (e) e.preventDefault();

  document.getElementById("calendar-view").style.display = "block";
  document.getElementById("dashboard-view").style.display = "none";

  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));
  e.target.closest(".nav-item").classList.add("active");
}

function showDashboard(e) {
  if (e) e.preventDefault();

  document.getElementById("calendar-view").style.display = "none";
  document.getElementById("dashboard-view").style.display = "block";

  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));
  e.target.closest(".nav-item").classList.add("active");

  renderDashboardTable(); // Render table when switching to dashboard
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar();
}

function goToToday() {
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  generateCalendar();
}

// Initialize
window.onload = () => {
  generateCalendar();
  renderDashboardTable();
};

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const icon = document.getElementById("toggleIcon");

  sidebar.classList.toggle("collapsed");

  icon.innerText = sidebar.classList.contains("collapsed")
    ? "chevron_right"
    : "chevron_left";
}
