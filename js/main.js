// Sélection des éléments KPI
const chiffreAffairesElem = document.querySelector('.card:nth-child(1) h5');
const chiffreAffairesVarElem = document.querySelector('.card:nth-child(1) small');

const totalCommandesElem = document.querySelector('.card:nth-child(2) h5');
const totalCommandesVarElem = document.querySelector('.card:nth-child(2) small');

const reservationsActivesElem = document.querySelector('.card:nth-child(3) h5');
const totalEmployesElem = document.querySelector('.card:nth-child(4) h5');
const tablesDisponiblesElem = document.querySelector('.card:nth-child(5) h5');

// Charger les données JSON
fetch('data/dashboard.json')
    .then(response => response.json())
    .then(data => {
        const kpi = data.kpi;

        // Chiffre d'affaires
        chiffreAffairesElem.textContent = kpi.chiffreAffaires.value.toLocaleString() + ' ' + kpi.chiffreAffaires.currency;
        chiffreAffairesVarElem.textContent = `↑ ${kpi.chiffreAffaires.variation}% vs mois dernier`;

        // Total Commandes
        totalCommandesElem.textContent = kpi.totalCommandes.value;
        totalCommandesVarElem.textContent = `↑ ${kpi.totalCommandes.variation}% vs mois dernier`;

        // Réservations actives
        reservationsActivesElem.textContent = kpi.reservationsActives;

        // Total Employés
        totalEmployesElem.textContent = kpi.totalEmployes;

        // Tables disponibles
        tablesDisponiblesElem.textContent = `${kpi.tablesDisponibles.available}/${kpi.tablesDisponibles.total}`;

        // Charts
        const revenueData = data.charts.revenusParMois;
        revenueChart.data.labels = revenueData.labels;
        revenueChart.data.datasets[0].data = revenueData.data;
        revenueChart.update();

        const orderStatusData = data.charts.commandesParStatut;
        orderStatusChart.data.labels = orderStatusData.labels;
        orderStatusChart.data.datasets[0].data = orderStatusData.data;
        orderStatusChart.update();
    })
    .catch(err => console.error('Erreur chargement JSON:', err));
