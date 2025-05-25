const translations = {
  en: ["Data Center", "Technical Support", "Optical Network Terminal"],
  ar: ["مركز البيانات", "الدعم الفني", "جهاز الـ ONT"],
  iq: ["سنتر البيانات", "الدعم الفـني", "جهاز الانترنت"]
};

const sheetUrls = {
  "Data Center": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQPiO867GG99zr8U6dvZpNqy8kPJKvuLXY66EczQsFoWPNudIhVfNNLLKK5xXtZfD3UaW6MXnEBCsBR/pub?output=csv",
  "Technical Support": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR39W1cXr92a99T_RDr5abulfG66yPTqXQ21703PuuArM8V83yzvu5i0DTRyMpfboDwFS-pJFh1275d/pub?output=csv",
  "Optical Network Terminal": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTmvmSvDpOKVK5Pn5k1RewM76GiKS8AqjueveFNDiSDrG1u1dtAylAbeJdEb_q2jaMGVNQp5j8C4ZdG/pub?output=csv"
};

function updateLanguage() {
  const lang = document.getElementById('languageSelect').value;
  const sectionSelect = document.getElementById('sectionSelect');
  const currentValue = sectionSelect.value;
  sectionSelect.innerHTML = "";

  translations[lang].forEach((label, index) => {
    const option = document.createElement("option");
    option.value = translations.en[index];
    option.textContent = label;
    if (option.value === currentValue) {
      option.selected = true;
    }
    sectionSelect.appendChild(option);
  });
  loadSheetData(sectionSelect.value);
}

function loadSheetData(section) {
  const url = sheetUrls[section];
  if (!url) return;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then(csvText => {
      parseAndDisplayCSV(csvText);
    })
    .catch(err => {
      alert("Error loading data: " + err.message);
    });
}

function parseAndDisplayCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const tbody = document.querySelector("#faultTable tbody");
  tbody.innerHTML = "";

  // Assuming first row is header, so skip it
  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");
    if (cols.length < 4) continue;

    const tr = document.createElement("tr");
    for (let j = 0; j < 4; j++) {
      const td = document.createElement("td");
      td.textContent = cols[j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const tbody = document.querySelector("#faultTable tbody");
  const rows = tbody.querySelectorAll("tr");

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

function setupEventListeners() {
  document.getElementById("languageSelect").addEventListener("change", () => {
    updateLanguage();
  });

  document.getElementById("sectionSelect").addEventListener("change", (e) => {
    loadSheetData(e.target.value);
  });

  document.getElementById("searchInput").addEventListener("input", filterTable);

  document.getElementById("reloadButton").addEventListener("click", () => {
    const sectionSelect = document.getElementById("sectionSelect");
    loadSheetData(sectionSelect.value);
  });
}

// Initial setup
updateLanguage();
setupEventListeners();


// Chart.js line graph setup

const ctx = document.getElementById('faultChart').getContext('2d');
const faultChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: 'Network Faults',
      data: [3, 6, 4, 8],
      borderColor: '#004aad',
      backgroundColor: 'rgba(0, 74, 173, 0.1)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
