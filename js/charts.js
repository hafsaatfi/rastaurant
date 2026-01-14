const revenueCtx = document.getElementById('revenueChart').getContext('2d');
const revenueChart = new Chart(revenueCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Revenus',
            data: [40000, 45000, 52000, 55000, 60000, 72000],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: true,
            tension: 0.4
        }]
    }
});

const orderStatusCtx = document.getElementById('orderStatusChart').getContext('2d');
const orderStatusChart = new Chart(orderStatusCtx, {
    type: 'doughnut',
    data: {
        labels: ['Livrées', 'En attente', 'Annulées'],
        datasets: [{
            data: [78, 15, 7],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545']
        }]
    }
});
