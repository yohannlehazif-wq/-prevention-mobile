import { useState } from "react";

export default function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);

  const jobs = [
    "Technicien maintenance",
    "Commercial itinérant",
    "Boucher",
    "Coiffeur / Coiffeuse",
    "Production industrielle",
  ];

  const risks = {
    "Technicien maintenance": ["Chute de hauteur", "CMR", "Électrique", "TMS"],
    "Commercial itinérant": ["Risque routier", "Stress", "TMS volant"],
    "Boucher": ["Coupure", "Manutention", "Froid", "CMR nettoyants"],
    "Coiffeur / Coiffeuse": ["Allergènes", "Postures prolongées", "Produits chimiques"],
    "Production industrielle": ["Machines", "Bruit", "CMR", "Manutention"],
  };

  const riskDetails = {
    "CMR": "Substances Cancérogènes, Mutagènes et Reprotoxiques. Nécessite une évaluation stricte, substitution si possible, EPI adaptés et suivi renforcé.",
    "Chute de hauteur": "Risque majeur. Prévoir harnais, garde-corps, procédure de travail en hauteur.",
    "Électrique": "Consignation, habilitation électrique, EPI spécifiques.",
    "TMS": "Troubles Musculo-Squelettiques : adapter postes, pauses, ergonomie.",
    "Risque routier": "Fatigue, distraction, vitesse. Plan de mobilité et bonnes pratiques de conduite.",
    "Stress": "Organisation, charge de travail, prévention RPS.",
    "Coupure": "Couteaux affûtés, gants anti-coupure, formation gestes sûrs.",
    "Manutention": "Aides mécaniques, formation gestes et postures.",
    "Froid": "Vêtements isolants, rotation des tâches.",
    "Allergènes": "Produits sensibilisants, gants, ventilation.",
    "Postures prolongées": "Réglage du poste, alternance des tâches.",
    "Produits chimiques": "FDS, stockage sécurisé, EPI.",
    "Machines": "Carters, consignation, interdiction de contournement.",
    "Bruit": "Casques anti-bruit, isolement.",
  };

  const buttonStyle = {
    padding: "12px 16px",
    borderRadius: "8px",
    margin: "6px 0",
    width: "100%",
    cursor: "pointer",
    border: "1px solid #ccc",
    background: "white",
    textAlign: "left",
    fontSize: "16px",
  };

  const cardStyle = {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    background: "white",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "480px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Application Prévention des Risques
      </h1>

      {!selectedJob && (
        <div style={cardStyle}>
          <h2>Sélectionnez un métier</h2>
          {jobs.map((job) => (
            <button key={job} style={buttonStyle} onClick={() => setSelectedJob(job)}>
              {job}
            </button>
          ))}
        </div>
      )}

      {selectedJob && !selectedRisk && (
        <div style={cardStyle}>
          <button
            style={{ ...buttonStyle, background: "#eee" }}
            onClick={() => setSelectedJob(null)}
          >
            ← Retour aux métiers
          </button>
          <h2>Risques pour : {selectedJob}</h2>
          {risks[selectedJob].map((risk) => (
            <button key={risk} style={buttonStyle} onClick={() => setSelectedRisk(risk)}>
              {risk}
            </button>
          ))}
        </div>
      )}

      {selectedRisk && (
        <div style={{ ...cardStyle, background: "#fff7e6" }}>
          <button
            style={{ ...buttonStyle, background: "#eee" }}
            onClick={() => setSelectedRisk(null)}
          >
            ← Retour aux risques
          </button>
          <h2>{selectedRisk}</h2>
          <p>{riskDetails[selectedRisk]}</p>
        </div>
      )}
    </div>
  );
}
