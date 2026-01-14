// ===================== VARIABLES =====================
let employees = [];

// ===================== SELECTEURS =====================
const tbody = document.querySelector('#employees-table tbody');
const searchInput = document.getElementById('search-input');
const modal = new bootstrap.Modal(document.getElementById('employeeModal'));

const nom = document.getElementById('nom');
const email = document.getElementById('email');
const telephone = document.getElementById('telephone');
const role = document.getElementById('role');
const salaire = document.getElementById('salaire');
const statut = document.getElementById('statut');

let editId = null;

// ===================== MODAL VOIR DETAIL =====================
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const detailList = document.getElementById('detail-list');

// ===================== CHARGEMENT JSON =====================
fetch('data/employes.json')
  .then(res => {
    if (!res.ok) throw new Error("JSON introuvable");
    return res.json();
  })
  .then(data => {
    employees = data;
    render(employees);
  })
  .catch(err => {
    console.error("Erreur JSON :", err);
    alert("⚠ Lance le projet avec Live Server");
  });

// ===================== AFFICHAGE =====================
function render(list) {
  tbody.innerHTML = '';

  list.forEach(e => {
    const badge = e.statut === "Actif" ? "success" : "secondary";

    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.nom}</td>
        <td>${e.email}</td>
        <td>${e.telephone}</td>
        <td>${e.role}</td>
        <td>${e.salaire}</td>
        <td><span class="badge bg-${badge}">${e.statut}</span></td>
        <td>
          <button class="btn btn-sm btn-primary me-1"
                  onclick="viewDetails(${e.id})">voir</button>
          <button class="btn btn-sm btn-warning me-1"
                  onclick="editEmployee(${e.id})">modifier</button>
          <button class="btn btn-sm btn-danger"
                  onclick="deleteEmployee(${e.id})">supprimer</button>
        </td>
      </tr>
    `;
  });
}

// ===================== AJOUT =====================
document.getElementById('add-employee-btn').onclick = () => {
  editId = null;
  document.getElementById('employee-form').reset();
  modal.show();
};

function addEmployee(e) {
  e.preventDefault();

  employees.push({
    id: employees.length ? employees[employees.length - 1].id + 1 : 1,
    nom: nom.value,
    email: email.value,
    telephone: telephone.value,
    role: role.value,
    salaire: salaire.value,
    statut: statut.value
  });

  modal.hide();
  render(employees);

  document.getElementById('employee-form').onsubmit = addEmployee;
}

document.getElementById('employee-form').onsubmit = addEmployee;

// ===================== DELETE =====================
function deleteEmployee(id) {
  if (confirm("Supprimer cet employé ?")) {
    employees = employees.filter(e => e.id !== id);
    render(employees);
  }
}

// ===================== MODIFIER =====================
function editEmployee(id) {
  const e = employees.find(emp => emp.id === id);
  editId = id;

  nom.value = e.nom;
  email.value = e.email;
  telephone.value = e.telephone;
  role.value = e.role;
  salaire.value = e.salaire;
  statut.value = e.statut;

  modal.show();

  document.getElementById('employee-form').onsubmit = ev => {
    ev.preventDefault();

    e.nom = nom.value;
    e.email = email.value;
    e.telephone = telephone.value;
    e.role = role.value;
    e.salaire = salaire.value;
    e.statut = statut.value;

    modal.hide();
    render(employees);

    document.getElementById('employee-form').onsubmit = addEmployee;
  };
}

// ===================== VOIR DETAIL =====================
function viewDetails(id) {
  const e = employees.find(emp => emp.id === id);

  detailList.innerHTML = '';

  for (const key in e) {
    detailList.innerHTML += `
      <li class="list-group-item">
        <strong>${capitalize(key)}:</strong> ${e[key]}
      </li>
    `;
  }

  detailModal.show();
}

// ===================== UTILITAIRE =====================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===================== RECHERCHE =====================
searchInput.oninput = () => {
  const v = searchInput.value.toLowerCase();
  render(
    employees.filter(e =>
      e.nom.toLowerCase().includes(v) ||
      e.role.toLowerCase().includes(v) ||
      e.statut.toLowerCase().includes(v)
    )
  );
}
// ===================== EXPORTER PDF =====================
// ===================== EXPORTER PDF AVEC STYLE =====================
document.getElementById('export-btn').onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(18);
  doc.text("Liste des Employés", 14, 20);

  // Préparer les colonnes pour AutoTable
  const columns = [
    { header: "ID", dataKey: "id" },
    { header: "Nom", dataKey: "nom" },
    { header: "Email", dataKey: "email" },
    { header: "Téléphone", dataKey: "telephone" },
    { header: "Rôle", dataKey: "role" },
    { header: "Salaire", dataKey: "salaire" },
    { header: "Statut", dataKey: "statut" }
  ];

  // Générer les données
  const rows = employees.map(e => ({
    id: e.id,
    nom: e.nom,
    email: e.email,
    telephone: e.telephone,
    role: e.role,
    salaire: e.salaire,
    statut: e.statut
  }));

  // Générer le tableau avec style
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: rows.map(r => Object.values(r)),
    startY: 30,
    theme: 'grid', // options: 'striped', 'grid', 'plain'
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // bleu foncé
    bodyStyles: { fontSize: 11 },
    alternateRowStyles: { fillColor: [245, 245, 245] } // gris clair
  });

  doc.save("employes.pdf");
};

