// ===================== VARIABLES =====================
let reservations = [];

// ===================== SELECTEURS =====================
const tbody = document.querySelector('#reservations-table tbody');
const searchInput = document.getElementById('search-input');
const modal = new bootstrap.Modal(document.getElementById('reservationModal'));

const client = document.getElementById('client');
const table = document.getElementById('table');
const date = document.getElementById('date');
const heure = document.getElementById('heure');
const convives = document.getElementById('convives');
const statut = document.getElementById('statut');

let editId = null;

// ===================== MODAL VOIR DETAIL =====================
const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
const detailList = document.getElementById('detail-list');

// ===================== CHARGEMENT JSON =====================
fetch('data/reservations.json')
  .then(res => {
    if (!res.ok) throw new Error("JSON introuvable");
    return res.json();
  })
  .then(data => {
    reservations = data;
    render(reservations);
  })
  .catch(err => {
    console.error("Erreur JSON :", err);
    alert("⚠ Lance le projet avec Live Server");
  });

// ===================== AFFICHAGE =====================
function render(list) {
  tbody.innerHTML = '';

  list.forEach(r => {
    const badge =
      r.statut === "Confirmé" ? "success" :
      r.statut === "En attente" ? "warning" :
      "danger";

    tbody.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.client}</td>
        <td>${r.table}</td>
        <td>${r.date}</td>
        <td>${r.heure}</td>
        <td>${r.convives}</td>
        <td>
          <span class="badge bg-${badge}">
            ${r.statut}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-primary me-1"
                  onclick="viewDetails(${r.id})">
            voir
          </button>
          <button class="btn btn-sm btn-warning me-1"
                  onclick="editReservation(${r.id})">
            modifier
          </button>
          <button class="btn btn-sm btn-danger"
                  onclick="deleteReservation(${r.id})">
            supprimer
          </button>
        </td>
      </tr>
    `;
  });
}

// ===================== AJOUT =====================
document.getElementById('add-reservation-btn').onclick = () => {
  editId = null;
  document.getElementById('reservation-form').reset();
  modal.show();
};

function addReservation(e) {
  e.preventDefault();

  reservations.push({
    id: reservations.length ? reservations[reservations.length - 1].id + 1 : 1,
    client: client.value,
    table: table.value,
    date: date.value,
    heure: heure.value,
    convives: convives.value,
    statut: statut.value
  });

  modal.hide();
  render(reservations);

  // Remet le listener pour futur ajout
  document.getElementById('reservation-form').onsubmit = addReservation;
}

// Listener initial pour le formulaire
document.getElementById('reservation-form').onsubmit = addReservation;

// ===================== DELETE =====================
function deleteReservation(id) {
  if (confirm("Supprimer cette réservation ?")) {
    reservations = reservations.filter(r => r.id !== id);
    render(reservations);
  }
}

// ===================== MODIFIER =====================
function editReservation(id) {
  const r = reservations.find(res => res.id === id);
  editId = id;

  client.value = r.client;
  table.value = r.table;
  date.value = r.date;
  heure.value = r.heure;
  convives.value = r.convives;
  statut.value = r.statut;

  modal.show();

  document.getElementById('reservation-form').onsubmit = e => {
    e.preventDefault();

    r.client = client.value;
    r.table = table.value;
    r.date = date.value;
    r.heure = heure.value;
    r.convives = convives.value;
    r.statut = statut.value;

    modal.hide();
    render(reservations);

    // Remet le listener pour futur ajout
    document.getElementById('reservation-form').onsubmit = addReservation;
  };
}

// ===================== VOIR DETAIL =====================
function viewDetails(id) {
  const r = reservations.find(res => res.id === id);

  // Vider l'ancien contenu
  detailList.innerHTML = '';

  // Ajouter chaque champ dans la liste
  for (const key in r) {
    detailList.innerHTML += `
      <li class="list-group-item">
        <strong>${capitalize(key)}:</strong> ${r[key]}
      </li>
    `;
  }

  // Afficher le modal
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
    reservations.filter(r =>
      r.client.toLowerCase().includes(v) ||
      r.statut.toLowerCase().includes(v)
    )
  );
};
