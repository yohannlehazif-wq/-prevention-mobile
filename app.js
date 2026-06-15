// 1. CAPTURE GLOBALE DES ERREURS INVISIBLES
window.addEventListener('error', function(event) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    const indicator = document.getElementById('toast-indicator');
    if (toast && toastText) {
        toastText.innerText = "Erreur JS détectée : " + event.message;
        if (indicator) { indicator.classList.remove('bg-restev-gold'); indicator.classList.add('bg-red-500'); }
        toast.className = "fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold py-3.5 px-5 rounded-2xl shadow-premium z-50 transition-all transform translate-y-0 opacity-100 flex items-center space-x-2.5 border border-red-500 no-print";
    }
    console.error("Erreur critique :", event.error);
});

// 2. CONFIGURATION DE BASE SUPABASE
const SUPABASE_URL = "https://swgaezpjlaacqutogmvb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Z2FlenBqbGFhY3F1dG9nbXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODc2MjEsImV4cCI6MjA5NjY2MzYyMX0.Wf7gA8P9VnVCfqYGMxIE6Ovg4LjZf9qBL4gmdXHJ-DA";

let supabase = null;
try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (err) {
    console.error("Échec d'initialisation Supabase");
}

// 3. VARIABLES D'ÉTAT GLOBALES
let currentSelectedCompany = "Bati-Vendée Logistique 85";
let currentEmployeeProfile = { name: "Collaborateur Externe", status: "Parcours Standard" };
let base64UploadedPhoto = "";
let currentGPSCoords = "En attente...";
let datasetAdherents = new Set();
let totalPassportsCount = 0;
let risksDB = [];
let corporateZonesDB = {};

// 4. INSTANCES TIERCES
let myLeafletMap = null;
let myMapMarker = null;
let activeCanvas = {};
let ctxCanvas = {};
let chartInstance = null;

// 5. INITIALISATION AUTOMATIQUE AU CHARGEMENT DE LA PAGE
document.addEventListener('DOMContentLoaded', async () => {
    // Changement immédiat de l'état du badge indicateur
    const statusBadge = document.getElementById('js-status');
    if (statusBadge) {
        statusBadge.className = "bg-green-50 text-green-600 border border-green-200 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm";
        statusBadge.innerHTML = "Système Actif ⚡";
    }

    initRestevAnalyticsChart();
    updateDirectionDashboardCounters();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('emp')) {
        currentEmployeeProfile.name = decodeURIComponent(urlParams.get('emp'));
        currentEmployeeProfile.status = decodeURIComponent(urlParams.get('status') || 'Nouvel Arrivant');
        currentSelectedCompany = decodeURIComponent(urlParams.get('comp') || 'Bati-Vendée Logistique 85');
        datasetAdherents.add(currentSelectedCompany);
        updateDirectionDashboardCounters();
        await fetchCompanyZones();
        accessEmployeeViaQR();
        showToast(`Passeport activé pour ${currentEmployeeProfile.name}`);
    }
});

// ================= CODE FONCTIONNEL DE L'APPLICATION =================

function showToast(text) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;
    toastText.innerText = text;
    toast.className = "fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold py-3.5 px-5 rounded-2xl shadow-premium z-50 transition-all transform translate-y-0 opacity-100 flex items-center space-x-2.5 border border-slate-800 no-print";
    setTimeout(() => {
        toast.className = "fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold py-3.5 px-5 rounded-2xl shadow-premium z-50 transition-all transform translate-y-20 opacity-0 flex items-center space-x-2.5 border border-slate-800 no-print";
    }, 3500);
}

function updateDirectionDashboardCounters() {
    const lblAdherents = document.getElementById('lbl-dir-adherents');
    const lblPassports = document.getElementById('lbl-dir-passports');
    const lblCompliance = document.getElementById('lbl-dir-compliance');
    const lblAlerts = document.getElementById('lbl-dir-alert-count');
    
    if (lblAdherents) lblAdherents.innerText = datasetAdherents.size;
    if (lblPassports) lblPassports.innerText = totalPassportsCount;
    if (lblCompliance) lblCompliance.innerText = totalPassportsCount > 0 ? "100 %" : "0 %";
    if (lblAlerts) lblAlerts.innerText = risksDB.length;
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.add('active');

    if (screenId === 'scr-signature') {
        setTimeout(() => {
            initCanvas('canv-employee');
            initCanvas('canv-tutor');
        }, 150);
    }
    if (screenId === 'scr-report') {
        buildZoneDropdownOptions();
        acquireRealtimeGPSLocation();
    }
}

function clearUrlParamsAndHome() {
    if (window.location.search) {
        let cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
    switchScreen('scr-home');
}

function generateEmployeeAccess() {
    const nameInput = document.getElementById('reg-emp-name');
    const statusInput = document.getElementById('reg-emp-status');
    if (!nameInput || !statusInput) return;
    
    const name = nameInput.value.trim();
    const status = statusInput.value;
    if (!name) return alert("Veuillez renseigner le nom.");

    currentEmployeeProfile.name = name;
    currentEmployeeProfile.status = status;
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    const targetWebUrl = `${cleanUrl}?emp=${encodeURIComponent(name)}&comp=${encodeURIComponent(currentSelectedCompany)}&status=${encodeURIComponent(status)}`;

    const qrArea = document.getElementById('qr-area');
    const qrCanvas = document.getElementById('qr-canvas');
    if (qrArea) qrArea.classList.remove('hidden');
    
    if (qrCanvas && window.QRCode) {
        QRCode.toCanvas(qrCanvas, targetWebUrl, { width: 140, margin: 1, color: { dark: '#1e4575', light: '#ffffff' } });
        showToast("QR Code d'accès généré.");
    }
}

async function handleManagerLogin() {
    const managerCompInput = document.getElementById('manager-company-name');
    if (!managerCompInput) return;
    
    currentSelectedCompany = managerCompInput.value;
    const lblManagerComp = document.getElementById('lbl-manager-comp-name');
    if (lblManagerComp) lblManagerComp.innerText = currentSelectedCompany;

    datasetAdherents.add(currentSelectedCompany);
    updateDirectionDashboardCounters();
    await fetchCompanyZones();
    await refreshManagerRiskView();
    switchScreen('scr-manager');
}

async function fetchCompanyZones() {
    if (!supabase) {
        if (!corporateZonesDB[currentSelectedCompany]) {
            corporateZonesDB[currentSelectedCompany] = ["Zone Logistique Standard", "Atelier Général"];
        }
        renderManagerZonesList();
        return;
    }
    try {
        const { data, error } = await supabase.from('company_zones').select('zone_name').eq('company_name', currentSelectedCompany);
        if (error) throw error;
        corporateZonesDB[currentSelectedCompany] = data.map(item => item.zone_name);
        renderManagerZonesList();
    } catch (err) {
        console.error("Erreur de chargement des secteurs :", err.message);
    }
}

function renderManagerZonesList() {
    const container = document.getElementById('manager-zones-list');
    if (!container) return;
    const currentZones = corporateZonesDB[currentSelectedCompany] || [];
    if (currentZones.length === 0) {
        container.innerHTML = `<span class="text-[11px] text-amber-600 italic">Aucun secteur configuré.</span>`;
        return;
    }
    let htmlBuffer = "";
    currentZones.forEach((zone) => {
        htmlBuffer += `<span class="inline-flex items-center bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-sm"><i class="fa-solid fa-industry text-slate-400 mr-2 text-[9px]"></i> ${zone}</span>`;
    });
    container.innerHTML = htmlBuffer;
}

async function registerCustomZone() {
    const input = document.getElementById('txt-new-zone');
    if (!input) return;
    const zoneName = input.value.trim();
    if (!zoneName) return alert("Veuillez saisir un nom d'atelier ou de zone.");

    if (!corporateZonesDB[currentSelectedCompany]) corporateZonesDB[currentSelectedCompany] = [];
    if (corporateZonesDB[currentSelectedCompany].includes(zoneName)) return alert("Ce secteur existe déjà.");

    if (!supabase) {
        corporateZonesDB[currentSelectedCompany].push(zoneName);
        input.value = "";
        renderManagerZonesList();
        showToast("Zone ajoutée localement (Mode déconnecté).");
        return;
    }
    try {
        const { error } = await supabase.from('company_zones').insert([{ company_name: currentSelectedCompany, zone_name: zoneName }]);
        if (error) throw error;
        input.value = "";
        await fetchCompanyZones();
        showToast("Zone ajoutée au catalogue d'usine.");
    } catch (err) {
        alert("Impossible d'enregistrer la zone : " + err.message);
    }
}

function buildZoneDropdownOptions() {
    const dropdown = document.getElementById('risk-location');
    if (!dropdown) return;
    const currentZones = corporateZonesDB[currentSelectedCompany] || ["Zone Logistique Standard", "Atelier Général"];
    let htmlBuffer = "";
    currentZones.forEach(zone => { htmlBuffer += `<option value="${zone}">📍 ${zone}</option>`; });
    dropdown.innerHTML = htmlBuffer;
}

async function submitRealRiskReport() {
    const descInput = document.getElementById('risk-desc');
    const locInput = document.getElementById('risk-location');
    const sevInput = document.getElementById('risk-level');
    const catInput = document.getElementById('risk-category');
    
    if (!descInput || !locInput || !sevInput || !catInput) return;
    
    const desc = descInput.value.trim();
    const loc = locInput.value;
    const sev = sevInput.value;
    const cat = catInput.value;

    if (!loc) return alert("Aucun secteur sélectionné.");
    if (!desc) return alert("Veuillez rédiger une brève description.");
    
    const newReport = { company: currentSelectedCompany, employee: currentEmployeeProfile.name, category: cat, description: desc, location: loc, severity: sev, gps: currentGPSCoords, photo: base64UploadedPhoto };
    risksDB.push(newReport);
    updateDirectionDashboardCounters();

    const clearForm = () => {
        descInput.value = "";
        const preview = document.getElementById('photo-preview');
        const placeholder = document.getElementById('photo-placeholder');
        if (preview) preview.classList.add('hidden');
        if (placeholder) placeholder.classList.remove('hidden');
        base64UploadedPhoto = "";
    };

    if (!supabase) {
        clearForm();
        showToast("Signalement enregistré localement (Offline).");
        switchScreen('scr-employee');
        return;
    }
    try {
        const { error } = await supabase.from('risk_reports').insert([newReport]);
        if (error) throw error;
        clearForm();
        showToast("Signalement géolocalisé envoyé.");
        switchScreen('scr-employee');
    } catch (err) {
        alert("Erreur lors de l'envoi du signalement : " + err.message);
    }
}

async function refreshManagerRiskView() {
    const box = document.getElementById('manager-risk-box');
    if (!box) return;

    const generateCardsHtml = (reportsArray) => {
        let buffer = "";
        reportsArray.forEach(r => {
            let imgHtml = r.photo ? `<img src="${r.photo}" class="w-full h-32 object-cover rounded-xl border border-slate-100 mt-2">` : "";
            buffer += `<div class="bg-white p-4 rounded-xl border border-slate-100 text-[11px] space-y-1.5 shadow-sm"><div class="flex justify-between font-bold items-center"><span class="text-slate-900 font-extrabold">${r.employee}</span><span class="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[9px] font-black">${r.severity}</span></div><p class="text-slate-500"><i class="fa-solid fa-folder mr-1"></i> ${r.category}</p><p class="text-restev-blue font-bold"><i class="fa-solid fa-location-dot text-restev-magenta mr-1"></i> ${r.location}</p><p class="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">${r.description}</p>${imgHtml}</div>`;
        });
        return buffer;
    };

    if (!supabase) {
        box.innerHTML = risksDB.length === 0 ? `<p class="text-center py-8 text-slate-400 text-[11px] italic">Aucune anomalie signalée (Mode Local).</p>` : generateCardsHtml(risksDB);
        return;
    }
    try {
        const { data: filtered, error } = await supabase.from('risk_reports').select('*').eq('company', currentSelectedCompany).order('created_at', { ascending: false });
        if (error) throw error;
        box.innerHTML = (!filtered || filtered.length === 0) ? `<p class="text-center py-8 text-slate-400 text-[11px] italic">Aucune anomalie signalée.</p>` : generateCardsHtml(filtered);
    } catch (err) {
        console.error("Erreur alertes :", err.message);
    }
}

function acquireRealtimeGPSLocation() {
    const indicator = document.getElementById('geo-status');
    if (!indicator) return;
    if (!navigator.geolocation) {
        currentGPSCoords = "Non supporté";
        indicator.innerHTML = `<span class="text-red-500 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Capteur absent</span>`;
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            currentGPSCoords = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            indicator.innerHTML = `<span class="text-emerald-600 font-bold"><i class="fa-solid fa-crosshairs animate-pulse"></i> Marqueur aligné : ${currentGPSCoords}</span>`;
            setTimeout(() => {
                if (!window.L) return;
                if (!myLeafletMap) {
                    myLeafletMap = L.map('map', { zoomControl: false }).setView([lat, lon], 19);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(myLeafletMap);
                    myMapMarker = L.marker([lat, lon]).addTo(myLeafletMap);
                } else {
                    myLeafletMap.setView([lat, lon], 19);
                    myMapMarker.setLatLng([lat, lon]);
                }
                myLeafletMap.invalidateSize();
            }, 250);
        },
        () => {
            currentGPSCoords = "46.6705, -1.4265";
            indicator.innerHTML = `<span class="text-restev-gold font-semibold"><i class="fa-solid fa-triangle-exclamation"></i> Localisation Vendée activée</span>`;
        },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

function initRestevAnalyticsChart() {
    const canvas = document.getElementById('chart-restev-risks');
    if (!canvas || !window.Chart) return;
    const ctx = canvas.getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Risques de Chute', 'Engins / Véhicules', 'EPI manquants', 'Produits Chimiques'],
            datasets: [{ data: [12, 19, 3, 5], backgroundColor: ['#2b61a4', '#b72077', '#f1a115', '#6caea2'], borderWidth: 3, borderColor: '#ffffff' }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11, weight: '600' } } } } }
    });
}

function accessEmployeeViaQR() {
    const welcome = document.getElementById('lbl-emp-welcome');
    const comp = document.getElementById('lbl-emp-company');
    if (welcome) welcome.innerText = `Bonjour ${currentEmployeeProfile.name}`;
    if (comp) comp.innerText = `${currentSelectedCompany} • ${currentEmployeeProfile.status}`;
    switchScreen('scr-employee');
}

function accessEmployeeDirect() {
    currentEmployeeProfile.name = "Collaborateur Externe";
    currentEmployeeProfile.status = "Parcours Standard";
    const welcome = document.getElementById('lbl-emp-welcome');
    const comp = document.getElementById('lbl-emp-company');
    if (welcome) welcome.innerText = `Bonjour ${currentEmployeeProfile.name}`;
    if (comp) comp.innerText = `Établissement d'accueil : ${currentSelectedCompany}`;
    switchScreen('scr-employee');
}

function processRealPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            base64UploadedPhoto = e.target.result;
            const preview = document.getElementById('photo-preview');
            const placeholder = document.getElementById('photo-placeholder');
            if (preview) { preview.src = base64UploadedPhoto; preview.classList.remove('hidden'); }
            if (placeholder) placeholder.classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function initCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#0f172a';
    activeCanvas[id] = canvas; ctxCanvas[id] = ctx;
    let canvasIsDrawing = false;
    
    const getMousePos = (e) => {
        let r = canvas.getBoundingClientRect();
        return { x: (e.touches ? e.touches[0].clientX : e.clientX) - r.left, y: (e.touches ? e.touches[0].clientY : e.clientY) - r.top };
    };
    const start = (e) => { e.preventDefault(); canvasIsDrawing = true; let p = getMousePos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e) => { if (!canvasIsDrawing) return; e.preventDefault(); let p = getMousePos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    const stop = () => { canvasIsDrawing = false; };
    
    canvas.removeEventListener('mousedown', start); canvas.removeEventListener('mousemove', move);
    canvas.removeEventListener('touchstart', start); canvas.removeEventListener('touchmove', move);
    
    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move); window.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', start, { passive: false }); canvas.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', stop);
}

function clearCanvas(id) {
    if (ctxCanvas[id] && activeCanvas[id]) ctxCanvas[id].clearRect(0, 0, activeCanvas[id].width, activeCanvas[id].height);
}

function finalizeOfficialAttestation() {
    totalPassportsCount++;
    updateDirectionDashboardCounters();
    const tutorInput = document.getElementById('tutor-name');
    const tutorName = tutorInput ? tutorInput.value : "Non renseigné";
    
    const updates = { 'lbl-view-emp': currentEmployeeProfile.name, 'lbl-view-company': currentSelectedCompany, 'lbl-view-status': currentEmployeeProfile.status, 'lbl-view-tutor': tutorName };
    Object.entries(updates).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.innerText = val; });
    
    const lblDate = document.getElementById('lbl-view-date');
    if (lblDate) {
        const now = new Date();
        lblDate.innerText = `${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const imgEmp = document.getElementById('img-render-emp');
    const imgTutor = document.getElementById('img-render-tutor');
    if (imgEmp && activeCanvas['canv-employee']) imgEmp.src = activeCanvas['canv-employee'].toDataURL();
    if (imgTutor && activeCanvas['canv-tutor']) imgTutor.src = activeCanvas['canv-tutor'].toDataURL();
    switchScreen('scr-attestation');
}
