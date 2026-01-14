// ===================== VARIABLES =====================
let tables = [];

// ===================== SELECTEURS =====================
const tbody = document.querySelector("#tables-table tbody");
const searchInput = document.getElementById("search-input");
const addBtn = document.getElementById("add-table-btn");
const exportBtn = document.getElementById("export-pdf");

const tableModal = new bootstrap.Modal(document.getElementById("table-modal"));
const detailsModal = new bootstrap.Modal(document.getElementById("detailsModal"));

// Form
const form = document.getElementById("table-form");
const idInput = document.getElementById("table-id");
const numeroInput = document.getElementById("table-name");
const capaciteInput = document.getElementById("table-seats");
const statutInput = document.getElementById("table-status");

// ===================== CHARGEMENT JSON =====================
fetch("data/tables.json")
  .then(res => {
    if (!res.ok) throw new Error("Erreur chargement JSON");
    return res.json();
  })
  .then(data => {
    tables = data;
    renderTable(tables);
  })
  .catch(err => console.error("Erreur JSON :", err));

// ===================== AFFICHAGE =====================
function renderTable(list) {
  tbody.innerHTML = "";

  list.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.id}</td>
        <td>${t.numero}</td>
        <td>${t.capacite}</td>
        <td>${t.emplacement}</td>
        <td>
          <span class="badge ${
            t.statut === "Disponible" ? "bg-success" :
            t.statut === "Occupée" ? "bg-danger" :
            "bg-warning"
          }">
            ${t.statut}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-info" onclick="voirTable(${t.id})">voir</button>
          <button class="btn btn-sm btn-warning" onclick="editTable(${t.id})">modiffier</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTable(${t.id})">supprimer</button>
        </td>
      </tr>
    `;
  });
}

// ===================== AJOUT =====================
addBtn.onclick = () => {
  form.reset();
  idInput.value = "";
  tableModal.show();
};

// ===================== ENREGISTRER =====================
form.onsubmit = e => {
  e.preventDefault();

  const tableData = {
    id: idInput.value
      ? Number(idInput.value)
      : tables.length
        ? Math.max(...tables.map(t => t.id)) + 1
        : 1,
    numero: numeroInput.value,
    capacite: Number(capaciteInput.value),
    emplacement: document.getElementById("table-emplacement")?.value || "Intérieur",
    statut: statutInput.value
  };

  if (idInput.value) {
    tables = tables.map(t => t.id === tableData.id ? tableData : t);
  } else {
    tables.push(tableData);
  }

  tableModal.hide();
  renderTable(tables);
};

// ===================== DETAILS =====================
function voirTable(id) {
  const t = tables.find(x => x.id === id);
  document.getElementById("detailsBody").innerHTML = `
    <p><b>Numéro :</b> ${t.numero}</p>
    <p><b>Capacité :</b> ${t.capacite}</p>
    <p><b>Emplacement :</b> ${t.emplacement}</p>
    <p><b>Statut :</b> ${t.statut}</p>
  `;
  detailsModal.show();
}

// ===================== EDIT =====================
function editTable(id) {
  const t = tables.find(x => x.id === id);
  idInput.value = t.id;
  numeroInput.value = t.numero;
  capaciteInput.value = t.capacite;
  statutInput.value = t.statut;
  tableModal.show();
}

// ===================== DELETE =====================
function deleteTable(id) {
  if (confirm("Supprimer cette table ?")) {
    tables = tables.filter(t => t.id !== id);
    renderTable(tables);
  }
}

// ===================== RECHERCHE =====================
searchInput.oninput = () => {
  const v = searchInput.value.toLowerCase();
  renderTable(
    tables.filter(t =>
      t.numero.toLowerCase().includes(v) ||
      t.statut.toLowerCase().includes(v)
    )
  );
};

// ===================== EXPORT PDF =====================
exportBtn.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Liste des Tables", 14, 15);

  doc.autoTable({
    startY: 25,
    head: [["ID", "Numéro", "Capacité", "Emplacement", "Statut"]],
    body: tables.map(t => [
      t.id,
      t.numero,
      t.capacite,
      t.emplacement,
      t.statut
    ])
  });

  doc.save("tables.pdf");
};
