// ===================== DONNÉES =====================
let plats = JSON.parse(localStorage.getItem('plats')) || [
  {id:1, nom:"Pizza Margherita", categorie:"Pizza", prix:80, status:"Disponible"},
  {id:2, nom:"Salade César", categorie:"Salade", prix:50, status:"Disponible"},
  {id:3, nom:"Burger Classique", categorie:"Burger", prix:70, status:"Indisponible"}
];

// ===================== SELECTEURS =====================
const tbody = document.querySelector('#plats-table tbody');
const modal = document.getElementById('plat-modal');
const form = document.getElementById('plat-form');

const idInput = document.getElementById('plat-id');
const nomInput = document.getElementById('plat-nom');
const catInput = document.getElementById('plat-categorie');
const prixInput = document.getElementById('plat-prix');
const statusInput = document.getElementById('plat-status');

const searchInput = document.getElementById('search-input');

// Modal Bootstrap pour voir le plat
const viewModal = new bootstrap.Modal(document.getElementById('viewPlatModal'));
const viewContent = document.getElementById('viewPlatContent');

let editId = null;

// ===================== FONCTIONS =====================
function savePlats(){
  localStorage.setItem('plats', JSON.stringify(plats));
}

function renderTable(list){
  tbody.innerHTML = '';
  list.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.categorie}</td>
        <td>${p.prix}</td>
        <td>
          <span class="badge ${p.status === 'Disponible' ? 'bg-success' : 'bg-danger'}">
            ${p.status}
          </span>
        </td>
        <td>
          <button class="btn btn-primary btn-sm me-1" onclick="viewPlat(${p.id})">
            Voir
          </button>
          <button class="btn btn-warning btn-sm me-1" onclick="editPlat(${p.id})">Modifier</button>
          <button class="btn btn-danger btn-sm" onclick="deletePlat(${p.id})">Supprimer</button>
        </td>
      </tr>
    `;
  });
}

// ===================== VOIR DÉTAILS =====================
function viewPlat(id){
  const p = plats.find(x => x.id === id);
  
  viewContent.innerHTML = `
    <ul class="list-group">
      <li class="list-group-item"><strong>Nom:</strong> ${p.nom}</li>
      <li class="list-group-item"><strong>Catégorie:</strong> ${p.categorie}</li>
      <li class="list-group-item"><strong>Prix:</strong> ${p.prix} MAD</li>
      <li class="list-group-item">
        <strong>Disponibilité:</strong> 
        <span class="badge ${p.status === 'Disponible' ? 'bg-success' : 'bg-danger'}">
          ${p.status}
        </span>
      </li>
    </ul>
  `;
  
  viewModal.show();
}

// ===================== AJOUT / MODIFIER =====================
document.getElementById('add-plat-btn').onclick = () => {
  form.reset();
  idInput.value = '';
  editId = null;
  modal.style.display = 'block';
};

document.getElementById('close-modal').onclick = () => {
  modal.style.display = 'none';
};

form.onsubmit = e => {
  e.preventDefault();

  const plat = {
    id: idInput.value ? Number(idInput.value) : Date.now(),
    nom: nomInput.value,
    categorie: catInput.value,
    prix: Number(prixInput.value),
    status: statusInput.value
  };

  if(editId){
    plats = plats.map(p => p.id === editId ? plat : p);
  } else {
    plats.push(plat);
  }

  savePlats();
  modal.style.display = 'none';
  renderTable(plats);
};

function editPlat(id){
  const p = plats.find(x => x.id === id);
  idInput.value = p.id;
  nomInput.value = p.nom;
  catInput.value = p.categorie;
  prixInput.value = p.prix;
  statusInput.value = p.status;
  editId = id;
  modal.style.display = 'block';
}

// ===================== SUPPRIMER =====================
function deletePlat(id){
  if(confirm("Supprimer ce plat ?")){
    plats = plats.filter(p => p.id !== id);
    savePlats();
    renderTable(plats);
  }
}

// ===================== RECHERCHE =====================
searchInput.oninput = () => {
  const t = searchInput.value.toLowerCase();
  renderTable(plats.filter(p =>
    p.nom.toLowerCase().includes(t) ||
    p.categorie.toLowerCase().includes(t)
  ));
};

// ===================== EXPORT PDF =====================
document.getElementById('export-csv').onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Liste des Plats - MyManager", 14, 15);

  doc.autoTable({
    startY: 25,
    head: [["Nom", "Catégorie", "Prix (MAD)", "Disponibilité"]],
    body: plats.map(p => [p.nom, p.categorie, p.prix, p.status]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [33, 37, 41] }
  });

  const date = new Date().toLocaleDateString();
  doc.text(`Généré le : ${date}`, 14, doc.lastAutoTable.finalY + 10);
  doc.save("liste_plats.pdf");
};

// ===================== INIT =====================
renderTable(plats);
