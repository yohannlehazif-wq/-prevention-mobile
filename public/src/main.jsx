import {{ useState } useState } from "react";

// ✅ Compatible GitHu// ✅ D

export default function App() {// ✅ Nouvelle version MODERNE, COLORÉE, avec HEADER + CARDS + BOUTONS STYLÉS
  const [selectedJob, setSelectedJob] = useState(null);
// ✅ Compatible GitHub / Vite / React (sans dépendances externes)
  const [selectedRisk, setSelectedRisk] = useState(null);
// ✅ Design beaucoup plus propre et agréable


  const jobs = [
export default function App() {
    "Technicien maintenance",
  const [selectedJob, setSelectedJob] = useState(null);
    "Commercial itinérant",
  const [selectedRisk, setSelectedRisk] = useState(null);
    "Boucher",

    "Coiffeur / Coiffeuse",
    "Production industrielle",
  const jobs = [
  ];
    "Technicien maintenance",

    "Commercial itinérant",
    "Boucher",
  const risks = {
    "Coiffeur / Coiffeuse",
    "Technicien maintenance": ["Chute de hauteur", "CMR", "Électrique", "TMS"],
    "Production industrielle",
    "Commercial itinérant": ["Risque routier", "Stress", "TMS volant"],
  ];
    "Boucher": ["Coupure", "Manutention", "Froid", "CMR nettoyants"],

    "Coiffeur / Coiffeuse": ["Allergènes", "Postures prolongées", "Produits chimiques"],
    "Production industrielle": ["Machines", "Bruit", "CMR", "Manutention"],
  const risks = {
  };
    "Technicien maintenance": ["Chute de hauteur", "CMR", "Électrique", "TMS"],

    "Commercial itinérant": ["Risque routier", "Stress", "TMS volant"],
    "Boucher": ["Coupure", "Manutention", "Froid", "CMR nettoyants"],
  const riskDetails = {
    "Coiffeur / Coiffeuse": ["Allergènes", "Postures prolongées", "Produits chimiques"],
    "CMR": "Substances Cancérogènes, Mutagènes et Reprotoxiques. Nécessite une évaluation stricte, substitution si possible, EPI adaptés et suivi renforcé.",
    "Production industrielle": ["Machines", "Bruit", "CMR", "Manutention"],
    "Chute de hauteur": "Risque majeur. Prévoir harnais, garde-corps, procédure de travail en hauteur.",
  };
    "Électrique": "Consignation, habilitation électrique, EPI spécifiques.",

    "TMS": "Troubles Musculo-Squelettiques : adapter postes, pauses, ergonomie.",
    "Risque routier": "Fatigue, distraction, vitesse. Plan de mobilité et bonnes pratiques de conduite.",
  const riskDetails = {
    "Stress": "Organisation, charge de travail, prévention RPS.",
    "CMR": "Substances Cancérogènes, Mutagènes et Reprotoxiques. Nécessite une évaluation stricte, substitution si possible, EPI adaptés et suivi renforcé.",
    "Coupure": "Couteaux affûtés, gants anti-coupure, formation gestes sûrs.",
    "Chute de hauteur": "Risque majeur. Prévoir harnais, garde-corps, procédure de travail en hauteur.",
    "Manutention": "Aides mécaniques, formation gestes et postures.",
    "Électrique": "Consignation, habilitation électrique, EPI spécifiques.",
    "Froid": "Vêtements isolants, rotation des tâches.",
    "TMS": "Troubles Musculo-Squelettiques : adapter postes, pauses, ergonomie.",
    "Allergènes": "Produits sensibilisants, gants, ventilation.",
    "Risque routier": "Fatigue, distraction, vitesse. Plan de mobilité et bonnes pratiques de conduite.",
    "Postures prolongées": "Réglage du poste, alternance des tâches.",
    "Stress": "Organisation, charge de travail, prévention RPS.",
    "Produits chimiques": "FDS, stockage sécurisé, EPI.",
    "Coupure": "Couteaux affûtés, gants anti-coupure, formation gestes sûrs.",
    "Machines": "Carters, consignation, interdiction de contournement.",
    "Manutention": "Aides mécaniques, formation gestes et postures.",
    "Bruit": "Casques anti-bruit, isolement.",
    "Froid": "Vêtements isolants, rotation des tâches.",
  };
    "Allergènes": "Produits sensibilisants, gants, ventilation.",

    "Postures prolongées": "Réglage du poste, alternance des tâches.",
    "Produits chimiques": "FDS, stockage sécurisé, EPI.",
  // ✅ Styles modernisés
    "Machines": "Carters, consignation, interdiction de contournement.",
  const headerStyle = {
    "Bruit": "Casques anti-bruit, isolement.",
    background: "#2563eb",
  };
    color: "white",

    padding: "20px 10px",
    borderRadius: "0 0 10px 10px",
  // ✅ Styles modernisés
    textAlign: "center",
  const headerStyle = {
    fontSize: "22px",
    background: "#2563eb",
    fontWeight: "bold",
    color: "white",
    marginBottom: "20px",
    padding: "20px 10px",
  };
    borderRadius: "0 0 10px 10px",

    textAlign: "center",
    fontSize: "22px",
  const cardStyle = {
    fontWeight: "bold",
    background: "white",
    marginBottom: "20px",
    padding: "20px",
  };
    borderRadius: "12px",

    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  const cardStyle = {
  };
    background: "white",

    padding: "20px",
    borderRadius: "12px",
  const buttonStyle = {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "14px",
    marginBottom: "20px",
    borderRadius: "10px",
  };
    width: "100%",

    border: "none",
    background: "#f3f4f6",
  const buttonStyle = {
    marginTop: "10px",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
    transition: "0.2s",
    border: "none",
  };
    background: "#f3f4f6",

    marginTop: "10px",
    fontSize: "16px",
  const buttonPrimary = {
    cursor: "pointer",
    ...buttonStyle,
    transition: "0.2s",
    background: "#2563eb",
  };
    color: "white",

    fontWeight: "bold",
  };
  const buttonPrimary = {

    ...buttonStyle,
    background: "#2563eb",
  const backButton = {
    color: "white",
    ...buttonStyle,
    fontWeight: "bold",
    background: "#e5e7eb",
  };
    fontWeight: "bold",

  };

  const backButton = {
    ...buttonStyle,
  return (
    background: "#e5e7eb",
    <div style={{ maxWidth: "480px", margin: "auto", padding: "10px" }}>
    fontWeight: "bold",
      {/* ✅ HEADER MODERNE */}
  };
      <div style={headerStyle}>Prévention Mobile</div>


  return (
      {/* ✅ LISTE DES MÉTIERS */}
    <div style={{ maxWidth: "480px", margin: "auto", padding: "10px" }}>
      {!selectedJob && (
      {/* ✅ HEADER MODERNE */}
        <div style={cardStyle}>
      <div style={headerStyle}>Prévention Mobile</div>
          <h2 style={{ marginBottom: "10px" }}>Sélectionnez un métier</h2>

          {jobs.map((job) => (
            <button
      {/* ✅ LISTE DES MÉTIERS */}
              key={job}
      {!selectedJob && (
              style={buttonStyle}
        <div style={cardStyle}>
              onClick={() => setSelectedJob(job)}
          <h2 style={{ marginBottom: "10px" }}>Sélectionnez un métier</h2>
            >
          {jobs.map((job) => (
              {job}
            <button
            </button>
              key={job}
          ))}
              style={buttonStyle}
        </div>
              onClick={() => setSelectedJob(job)}
      )}
            >

              {job}
            </button>
      {/* ✅ LISTE DES RISQUES */}
          ))}
      {selectedJob && !selectedRisk && (
        </div>
        <div style={cardStyle}>
      )}
          <button style={backButton} onClick={() => setSelectedJob(null)}>

            ← Retour
          </button>
      {/* ✅ LISTE DES RISQUES */}

      {selectedJob && !selectedRisk && (
        <div style={cardStyle}>
          <h2 style={{ marginTop: "15px" }}>Risques : {selectedJob}</h2>
          <button style={backButton} onClick={() => setSelectedJob(null)}>

            ← Retour
          </button>
          {risks[selectedJob].map((risk) => (

            <button
              key={risk}
          <h2 style={{ marginTop: "15px" }}>Risques : {selectedJob}</h2>
              style={buttonPrimary}

              onClick={() => setSelectedRisk(risk)}
            >
          {risks[selectedJob].map((risk) => (
              {risk}
            <button
            </button>
              key={risk}
          ))}
              style={buttonPrimary}
        </div>
              onClick={() => setSelectedRisk(risk)}
      )}
            >

              {risk}
            </button>
      {/* ✅ DETAILS DU RISQUE */}
          ))}
      {selectedRisk && (
        </div>
        <div style={{ ...cardStyle, background: "#fef3c7" }}>
      )}
          <button style={backButton} onClick={() => setSelectedRisk(null)}>

            ← Retour
          </button>
      {/* ✅ DETAILS DU RISQUE */}

      {selectedRisk && (
        <div style={{ ...cardStyle, background: "#fef3c7" }}>
          <h2 style={{ marginTop: "15px", marginBottom: "10px" }}>{selectedRisk}</h2>
          <button style={backButton} onClick={() => setSelectedRisk(null)}>
          <p style={{ lineHeight: "1.5" }}>{riskDetails[selectedRisk]}</p>
            ← Retour
        </div>
          </button>
      )}

    </div>
  );
          <h2 style={{ marginTop: "15px", marginBottom: "10px" }}>{selectedRisk}</h2>
}
          <p style={{ lineHeight: "1.5" }}>{riskDetails[selectedRisk]}</p>
        </div>
      )}
    </div>
  );
}
