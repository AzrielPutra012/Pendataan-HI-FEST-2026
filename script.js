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