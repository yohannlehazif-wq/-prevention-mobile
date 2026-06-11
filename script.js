// 1. Gestion de la navigation entre les écrans
function switchScreen(screenId) {
    // Masquer toutes les sections (en supposant qu'elles ont toutes la classe 'section' ou sont dans <main>)
    document.querySelectorAll('main > section').forEach(s => {
        s.classList.add('hidden');
    });
    
    // Afficher l'écran demandé
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
    }
}

// 2. Gestion des rôles
function setRole(role) {
    console.log("Rôle sélectionné :", role);
    
    // Afficher le tableau de bord
    switchScreen('scr-dashboard');
    
    // Afficher les outils spécifiques selon le rôle
    const managerPanel = document.getElementById('manager-only-panel');
    const qrShortcut = document.getElementById('manager-qr-shortcut');
    
    if (role === 'manager') {
        managerPanel.classList.remove('hidden');
        qrShortcut.classList.remove('hidden');
    } else {
        managerPanel.classList.add('hidden');
        qrShortcut.classList.add('hidden');
    }
}

// 3. Fonction pour la génération de QR (Placeholder)
function generateEmployeeQR() {
    alert("Génération du QR Code en cours...");
    switchScreen('scr-qr-display');
    // Ici, vous devrez initialiser la librairie QR (QRCode.toCanvas)
}

// 4. Initialisation simple au chargement
window.onload = function() {
    switchScreen('scr-auth');
};
