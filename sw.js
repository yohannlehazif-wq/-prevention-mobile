// Variable pour gérer l'affichage des sections
function switchScreen(screenId) {
    // Masquer toutes les sections (en supposant qu'elles ont toutes la balise <section>)
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    
    // Afficher la section ciblée
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
    }
}

// Exemple pour setRole
function setRole(role) {
    console.log("Rôle sélectionné :", role);
    // Masquer le portail d'auth et afficher le tableau de bord
    switchScreen('scr-dashboard');
    
    // Logique pour afficher ou masquer des éléments selon le rôle
    if (role === 'manager') {
        document.getElementById('manager-only-panel').classList.remove('hidden');
        document.getElementById('manager-qr-shortcut').classList.remove('hidden');
    } else {
        document.getElementById('manager-only-panel').classList.add('hidden');
        document.getElementById('manager-qr-shortcut').classList.add('hidden');
    }
}

// Fonction placeholder pour le QR Code
function generateEmployeeQR() {
    alert("Génération du QR Code en cours...");
    switchScreen('scr-qr-display');
    // Ici, vous devrez utiliser une bibliothèque comme 'qrcode' pour générer l'image
}
