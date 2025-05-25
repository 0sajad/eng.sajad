const sheetURLs = {
  technical: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR39W1cXr92a99T_RDr5abulfG66yPTqXQ21703PuuArM8V83yzvu5i0DTRyMpfboDwFS-pJFh1275d/pub?output=csv',
  ont: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSLzwW5RjsdOqTKM8Iy28GT3xfrbFQyH_pHadurzijKyJD8LAN6OsFf7m_pi1gr_PCegcQTALsWw_rT/pub?output=csv',
  datacenter: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQPiO867GG99zr8U6dvZpNqy8kPJKvuLXY66EczQsFoWPNudIhVfNNLLKK5xXtZfD3UaW6MXnEBCsBR/pub?output=csv'
};

let currentData = [];

function loadSection() {
  const section = document.getElementById('sectionSelect').value;
  fetch(sheetURLs[section])
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.split('\n').slice(1);
      currentData = rows.map(row => row.split(',')).filter(row => row.length >= 4);
      updateTable();
      updateChart();
    });
}

function updateTable() {
  const tbody = document.querySelector('#faultTable tbody');
  tbody.innerHTML = '';
  currentData.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function filterTable() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#faultTable tbody tr');
  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(input) ? '' : 'none';
  });
}

function updateChart() {
  const faultCounts = {};
  currentData.forEach(row => {
    const type = row[0];
    faultCounts[type] = (faultCounts[type] || 0) + 1;
  });

  const ctx = document.getElementById('faultChart').getContext('2d');
  if (window.faultChartInstance) {
    window.faultChartInstance.destroy();
  }
  window.faultChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(faultCounts),
      datasets: [{
        label: 'عدد الأعطال حسب النوع',
        data: Object.values(faultCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'إحصائيات الأعطال' }
      }
    }
  });
}

function setLanguage(lang) {
  alert(`تم تغيير اللغة إلى: ${lang}`);
}

window.onload = loadSection;
