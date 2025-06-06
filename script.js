document.addEventListener('DOMContentLoaded', function() {
   
    let nombreSecret = Math.floor(Math.random() * 100) + 1;
    let essais = 0;
    let fini = false;
    let record = localStorage.getItem('meilleurScore') || '-';
    let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

 
    const nb = document.getElementById('nb');
    const val = document.getElementById('val');
    const msg = document.getElementById('msg');
    const ind = document.getElementById('ind');
    const best = document.getElementById('best');
    const nouveau = document.getElementById('new');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    
    function effet(type) {
        const sons = {
            win: '🎉',
            err: '❌',
            tip: '💡'
        };
        console.log(sons[type]);
    }

 
    function anime(element, classe) {
        element.classList.add(classe);
        setTimeout(() => {
            element.classList.remove(classe);
        }, 500);
    }

    
    function indice() {
        const diff = Math.abs(nombreSecret - parseInt(nb.value));
        let txt = '';

        if (diff > 50) txt = "Tu es très très loin ! 🌋";
        else if (diff > 30) txt = "Tu es assez loin ! 🏃‍♂️";
        else if (diff > 15) txt = "Tu te rapproches ! 👣";
        else if (diff > 5) txt = "Tu es tout près ! 🔍";
        else txt = "Tu brûles ! 🔥";

        const bulle = document.createElement('div');
        bulle.textContent = txt;
        bulle.className = 'bulle';
        ind.appendChild(bulle);
        
        setTimeout(() => bulle.remove(), 2000);
    }

   
    function score(essais) {
        return Math.max(0, 1000 - (essais * 50));
    }

   
    function verif() {
        if (fini) return;

        const prop = parseInt(nb.value);

        if (isNaN(prop) || prop < 1 || prop > 100) {
            msg.textContent = 'Il faut entrer un nombre entre 1 et 100 !';
            msg.className = 'msg err';
            anime(msg, 'secoue');
            effet('err');
            return;
        }

        essais++;

        if (prop === nombreSecret) {
            const pts = score(essais);
            msg.textContent = `Bravo ! Tu as trouvé en ${essais} essais ! Score: ${pts} points ! 🎉`;
            msg.className = 'msg ok';
            fini = true;
            nb.disabled = true;
            val.disabled = true;
            effet('win');

            if (record === '-' || essais < record) {
                record = essais;
                localStorage.setItem('meilleurScore', essais);
                best.textContent = record;
            }
            
        
            celebrerVictoire();
        } else {
            msg.textContent = prop < nombreSecret ? 'Trop petit ! 🔼' : 'Trop grand ! 🔽';
            msg.className = 'msg err';
            anime(msg, 'secoue');
            effet('err');
            indice();
        }

        nb.value = '';
        nb.focus();
    }


    function reset() {
        nombreSecret = Math.floor(Math.random() * 100) + 1;
        essais = 0;
        fini = false;
        msg.textContent = '';
        msg.className = 'msg';
        ind.innerHTML = '';
        nb.disabled = false;
        val.disabled = false;
        nb.value = '';
        nb.focus();
    }

    // Fonction pour célébrer une victoire avec des confettis
    function celebrerVictoire() {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        // Lance les confettis des deux côtés de l'écran
        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0.05, y: 0.6 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
            });
            
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 0.95, y: 0.6 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
            });
        
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Fonction pour basculer le thème
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('darkTheme', isDarkTheme);
    }

    // Initialiser le thème au chargement
    function initTheme() {
        if (isDarkTheme) {
            document.body.classList.add('dark-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // Événements
    val.addEventListener('click', verif);
    nb.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') verif();
    });
    nouveau.addEventListener('click', reset);
    themeToggle.addEventListener('click', toggleTheme);

    // Initialisation
    best.textContent = record;
    initTheme();
    reset();
});