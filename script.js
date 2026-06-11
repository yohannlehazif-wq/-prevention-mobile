// --- INITIALISATION DES VARIABLES ---
let activeCanvas = {};
let isStrictEmployeeMode = false;

// --- 1. NAVIGATION ---
function switchScreen(screenId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    window.scrollTo(0,0);
}

// --- 2. GESTION DES RÔLES ---
function setRole(role) {
    const managerPanel = document.getElementById('manager-only-panel');
    const qrShortcut = document.getElementById('manager-qr-shortcut');
    
    if (role === 'manager') {
        managerPanel.classList.remove('hidden');
        qrShortcut.classList.remove('hidden');
        document.getElementById('dash-title').innerText = "Tableau de Bord Manager";
    } else {
        managerPanel.classList.add('hidden');
        qrShortcut.classList.add('hidden');
        document.getElementById('dash-title').innerText = "Espace Prévention";
    }
    switchScreen('scr-dashboard');
}

// --- 3. GESTION DES SIGNATURES ---
function initCanvas(id) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    activeCanvas[id] = canvas;
    
    let drawing = false;
    canvas.addEventListener('mousedown', () => drawing = true);
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    });
}

function clearSign(id) {
    const canvas = document.getElementById(id);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

// --- 4. LOGIQUE D'APPLICATION ---
function validateFirstStep() {
    // Vérification simple du score QCM
    let score = 0;
    if(document.querySelector('input[name="q1"]:checked')?.value === 'B') score++;
    if(document.querySelector('input[name="q2"]:checked')?.value === 'A') score++;
    if(document.querySelector('input[name="q3"]:checked')?.value === 'B') score++;
    
    if(score < 3) {
        alert("Veuillez répondre correctement à toutes les questions pour continuer.");
        return;
    }
    
    switchScreen('scr-onboarding-2');
    initCanvas('canv-employee');
    initCanvas('canv-tutor');
}

window.onload = () => {
    // Initialisation forcée si nécessaire
    console.log("App prête.");
};
