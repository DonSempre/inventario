const data = [
  {
    date: "2026-01-21",
    recaudacion: [
      { cajero: "CA-1", banco: 127.35, monedas: 24.0, billetes: 90.0, cambio: -13.35 },
      { cajero: "CA-2", banco: 131.2, monedas: 58.2, billetes: 50.0, cambio: -23.0 },
      { cajero: "CA-M", banco: 56.0, monedas: 0.0, billetes: 0.0, cambio: 0.0 },
    ],
    cargas: [
      { cajero: "CA-1", c005: 500, c020: 200, c050: 200, c200: 175 },
      { cajero: "CA-2", c005: 500, c020: 200, c050: 200, c200: 175 },
      { cajero: "CA-M", c005: 0, c020: 0, c050: 0, c200: 0 },
    ],
    estado: [
      { cajero: "CA-1", estado: 515.0, cambio: -403.5 },
      { cajero: "CA-2", estado: 515.0, cambio: -403.5 },
      { cajero: "CA-M", estado: 0.0, cambio: 0.0 },
    ],
    incidencias: [
      "Revisión de cambio al cierre: CA-1 y CA-2 con diferencia por saldo negativo.",
      "Caja manual sin operaciones registradas en la jornada.",
    ],
  },
  {
    date: "2026-01-26",
    recaudacion: [
      { cajero: "CA-1", banco: 0.0, monedas: 0.0, billetes: 0.0, cambio: 0.0 },
      { cajero: "CA-2", banco: 0.0, monedas: 0.0, billetes: 0.0, cambio: 0.0 },
      { cajero: "CA-M", banco: 0.0, monedas: 0.0, billetes: 0.0, cambio: 0.0 },
    ],
    cargas: [
      { cajero: "CA-1", c005: 0, c020: 0, c050: 0, c200: 0 },
      { cajero: "CA-2", c005: 0, c020: 0, c050: 0, c200: 0 },
      { cajero: "CA-M", c005: 0, c020: 0, c050: 0, c200: 0 },
    ],
    estado: [
      { cajero: "CA-1", estado: 526.55, cambio: 99.95 },
      { cajero: "CA-2", estado: 538.0, cambio: 88.5 },
      { cajero: "CA-M", estado: 0.0, cambio: 0.0 },
    ],
    incidencias: ["Sin incidencias operativas reportadas."]
  }
];

const summaryEl = document.getElementById("summary");
const recaudacionBody = document.getElementById("recaudacionBody");
const cargasBody = document.getElementById("cargasBody");
const estadoBody = document.getElementById("estadoBody");
const incidenciasEl = document.getElementById("incidencias");

const filterDay = document.getElementById("filterDay");
const filterMonth = document.getElementById("filterMonth");
const filterYear = document.getElementById("filterYear");

const currency = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const formatNumber = (value) => currency.format(value);

const getTotals = (records) =>
  records.reduce(
    (acc, item) => {
      acc.banco += item.banco;
      acc.monedas += item.monedas;
      acc.billetes += item.billetes;
      acc.cambio += item.cambio;
      return acc;
    },
    { banco: 0, monedas: 0, billetes: 0, cambio: 0 }
  );

const getCargaTotal = (records) =>
  records.reduce(
    (acc, item) => acc + item.c005 + item.c020 + item.c050 + item.c200,
    0
  );

const getEstadoTotal = (records) =>
  records.reduce(
    (acc, item) => acc + item.estado,
    0
  );

const populateFilters = () => {
  const dates = data.map((entry) => new Date(entry.date));
  const years = [...new Set(dates.map((d) => d.getFullYear()))].sort();
  const months = [...new Set(dates.map((d) => d.getMonth()))].sort();

  filterMonth.innerHTML = `<option value="">Todos</option>`;
  months.forEach((month) => {
    const option = document.createElement("option");
    option.value = String(month + 1).padStart(2, "0");
    option.textContent = monthNames[month];
    filterMonth.appendChild(option);
  });

  filterYear.innerHTML = `<option value="">Todos</option>`;
  years.forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    filterYear.appendChild(option);
  });
};

const matchesFilters = (entry) => {
  const dayValue = filterDay.value;
  const monthValue = filterMonth.value;
  const yearValue = filterYear.value;

  if (dayValue && entry.date !== dayValue) {
    return false;
  }

  if (monthValue) {
    const month = entry.date.split("-")[1];
    if (month !== monthValue) {
      return false;
    }
  }

  if (yearValue) {
    const year = entry.date.split("-")[0];
    if (year !== yearValue) {
      return false;
    }
  }

  return true;
};

const renderSummary = (filteredData) => {
  const totals = filteredData.reduce(
    (acc, entry) => {
      const recTotals = getTotals(entry.recaudacion);
      acc.banco += recTotals.banco;
      acc.monedas += recTotals.monedas;
      acc.billetes += recTotals.billetes;
      acc.cambio += recTotals.cambio;
      acc.carga += getCargaTotal(entry.cargas);
      acc.estado += getEstadoTotal(entry.estado);
      return acc;
    },
    { banco: 0, monedas: 0, billetes: 0, cambio: 0, carga: 0, estado: 0 }
  );

  summaryEl.innerHTML = `
    <div class="summary-card">
      <h3>Total banco</h3>
      <p>${formatNumber(totals.banco)}</p>
    </div>
    <div class="summary-card">
      <h3>Total monedas</h3>
      <p>${formatNumber(totals.monedas)}</p>
    </div>
    <div class="summary-card">
      <h3>Total billetes</h3>
      <p>${formatNumber(totals.billetes)}</p>
    </div>
    <div class="summary-card">
      <h3>Carga de monedas</h3>
      <p>${formatNumber(totals.carga)}</p>
    </div>
    <div class="summary-card">
      <h3>Estado de caja</h3>
      <p>${formatNumber(totals.estado)}</p>
    </div>
  `;
};

const renderTables = (filteredData) => {
  recaudacionBody.innerHTML = "";
  cargasBody.innerHTML = "";
  estadoBody.innerHTML = "";
  incidenciasEl.innerHTML = "";

  filteredData.forEach((entry) => {
    entry.recaudacion.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.cajero}</td>
        <td>${formatNumber(item.banco)}</td>
        <td>${formatNumber(item.monedas)}</td>
        <td>${formatNumber(item.billetes)}</td>
        <td class="${item.cambio < 0 ? "negative" : "positive"}">${formatNumber(
          item.cambio
        )}</td>
      `;
      recaudacionBody.appendChild(row);
    });

    entry.cargas.forEach((item) => {
      const total = item.c005 + item.c020 + item.c050 + item.c200;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.cajero}</td>
        <td>${item.c005}</td>
        <td>${item.c020}</td>
        <td>${item.c050}</td>
        <td>${item.c200}</td>
        <td>${formatNumber(total)}</td>
      `;
      cargasBody.appendChild(row);
    });

    entry.estado.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.cajero}</td>
        <td>${formatNumber(item.estado)}</td>
        <td class="${item.cambio < 0 ? "negative" : "positive"}">${formatNumber(
          item.cambio
        )}</td>
      `;
      estadoBody.appendChild(row);
    });

    entry.incidencias.forEach((note) => {
      const div = document.createElement("div");
      div.className = "incidencia";
      div.textContent = note;
      incidenciasEl.appendChild(div);
    });
  });
};

const render = () => {
  const filtered = data.filter(matchesFilters);
  if (!filtered.length) {
    summaryEl.innerHTML = `
      <div class="summary-card">
        <h3>Sin resultados</h3>
        <p>0,00 €</p>
      </div>
    `;
    recaudacionBody.innerHTML = "";
    cargasBody.innerHTML = "";
    estadoBody.innerHTML = "";
    incidenciasEl.innerHTML = `<p class="incidencia">No hay incidencias para el filtro actual.</p>`;
    return;
  }

  renderSummary(filtered);
  renderTables(filtered);
};

populateFilters();
render();

[filterDay, filterMonth, filterYear].forEach((input) =>
  input.addEventListener("change", render)
);

document.getElementById("clearFilters").addEventListener("click", () => {
  filterDay.value = "";
  filterMonth.value = "";
  filterYear.value = "";
  render();
});

document.getElementById("exportExcel").addEventListener("click", () => {
  alert("Exportación a Excel en preparación. Solicita integración real si la necesitas.");
});

document.getElementById("exportPdf").addEventListener("click", () => {
  alert("Exportación a PDF en preparación. Solicita integración real si la necesitas.");
});
