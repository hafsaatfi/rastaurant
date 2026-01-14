let commandes = [];

const tbody = document.querySelector('#commandes-table tbody');
const searchInput = document.getElementById('search-input');

const addBtn = document.getElementById('add-commande-btn');
const formModal = new bootstrap.Modal(document.getElementById('commande-modal'));
const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));

const form = document.getElementById('commande-form');
const idInput = document.getElementById('commande-id');
const clientInput = document.getElementById('commande-client');
const tableInput = document.getElementById('commande-table');
const articlesInput = document.getElementById('commande-articles');
const totalInput = document.getElementById('commande-total');
const statusInput = document.getElementById('commande-status');
const dateInput = document.getElementById('commande-date');
const detailsBody = document.getElementById('detailsBody');

const exportBtn = document.getElementById('export-pdf');

function renderTable(list) {
  tbody.innerHTML = '';
  list.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.client}</td>
        <td>${c.table}</td>
        <td>${c.articles}</td>
        <td>${c.total.toFixed(2)} MAD</td>
        <td><span class="badge ${c.status === 'Livrée' ? 'bg-success' : c.status === 'En attente' ? 'bg-warning' : 'bg-danger'}">${c.status}</span></td>
        <td>${new Date(c.date).toLocaleString()}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="viewCommande(${c.id})">voir</button>
          <button class="btn btn-warning btn-sm" onclick="editCommande(${c.id})">modiffier</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCommande(${c.id})">supprimer</button>
        </td>
      </tr>
    `;
  });
}

function viewCommande(id) {
  const c = commandes.find(x => x.id === id);
  detailsBody.innerHTML = `
    <p><b>Client:</b> ${c.client}</p>
    <p><b>Table:</b> ${c.table}</p>
    <p><b>Articles:</b> ${c.articles}</p>
    <p><b>Total:</b> ${c.total.toFixed(2)} MAD</p>
    <p><b>Status:</b> ${c.status}</p>
    <p><b>Date:</b> ${new Date(c.date).toLocaleString()}</p>
  `;
  detailsModal.show();
}

function deleteCommande(id) {
  if (confirm("Supprimer cette commande ?")) {
    commandes = commandes.filter(c => c.id !== id);
    renderTable(commandes);
  }
}

function editCommande(id) {
  const c = commandes.find(x => x.id === id);
  idInput.value = c.id;
  clientInput.value = c.client;
  tableInput.value = c.table;
  articlesInput.value = c.articles;
  totalInput.value = c.total;
  statusInput.value = c.status;
  dateInput.value = c.date;
  formModal.show();
}

addBtn.onclick = () => {
  form.reset();
  idInput.value = '';
  formModal.show();
};

form.onsubmit = e => {
  e.preventDefault();
  const commande = {
    id: idInput.value ? Number(idInput.value) : Date.now(),
    client: clientInput.value,
    table: tableInput.value,
    articles: articlesInput.value,
    total: Number(totalInput.value),
    status: statusInput.value,
    date: dateInput.value
  };
  if (idInput.value) {
    commandes = commandes.map(c => c.id === commande.id ? commande : c);
  } else {
    commandes.push(commande);
  }
  formModal.hide();
  renderTable(commandes);
};

searchInput.oninput = () => {
  const v = searchInput.value.toLowerCase();
  renderTable(commandes.filter(c => c.client.toLowerCase().includes(v) || c.table.toLowerCase().includes(v)));
};

exportBtn.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Liste des Commandes - MyManager", 14, 15);
  doc.autoTable({
    startY: 25,
    head: [["ID","Client","Table","Articles","Total (MAD)","Status","Date"]],
    body: commandes.map(c => [c.id,c.client,c.table,c.articles,c.total.toFixed(2)+" MAD",c.status,new Date(c.date).toLocaleString()]),
    headStyles:{ fillColor:[33,37,41]}
  });
  doc.save("commandes.pdf");
};

// Charger JSON
fetch('data/commandes.json')
  .then(res => res.json())
  .then(data => {
    commandes = data;
    renderTable(commandes);
  })
  .catch(err => console.error("Erreur JSON:", err));
