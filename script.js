// Mengatur pergerakan geser halus ke samping saat menu navbar diklik
document.querySelectorAll('.navbar-custom nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const container = document.getElementById('mainContainer');
        const targetSection = document.querySelector(targetId);
        
        if (container && targetSection) {
            // Menggeser kontainer utama ke koordinat sumbu X milik section tujuan
            container.scrollTo({
                left: targetSection.offsetLeft,
                behavior: 'smooth'
            });
        }

        // Mengatur pergantian kelas "active" pada teks navbar agar menyala bergantian
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });
});
<script>
// Doughnut Chart - Home
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('homeDoughnutChart');
    
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Sudah Terdata', 'Sedang Proses', 'Belum Terdata'],
            datasets: [{
                data: [68, 22, 10],
                backgroundColor: [
                    '#7DA0CA',    // Biru terang
                    '#5483B3',    // Biru sedang
                    '#052659'     // Biru gelap
                ],
                borderColor: '#021024',
                borderWidth: 6,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#C1E8FF',
                        padding: 20,
                        font: { size: 14 },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(2, 16, 36, 0.95)',
                    titleColor: '#C1E8FF',
                    bodyColor: '#fff',
                    padding: 14,
                    cornerRadius: 8
                }
            },
            animation: {
                duration: 2200,
                easing: 'easeOutBounce'
            }
        }
    });
});
</script>