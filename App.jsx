import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, AlertTriangle, Shield } from "lucide-react";

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

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">Application Prévention des Risques</h1>

      {!selectedJob && (
        <Card className="shadow-md">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-lg font-semibold mb-2">Sélectionnez un métier</h2>
            {jobs.map((job) => (
              <Button
                key={job}
                className="w-full flex justify-between items-center"
                onClick={() => setSelectedJob(job)}
              >
                {job}
                <ChevronRight />
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedJob && !selectedRisk && (
        <Card className="shadow-md">
          <CardContent className="p-4 space-y-3">
            <Button variant="outline" onClick={() => setSelectedJob(null)}>
              ← Retour aux métiers
            </Button>
            <h2 className="text-lg font-semibold mb-2">Risques pour : {selectedJob}</h2>
            {risks[selectedJob].map((risk) => (
              <Button
                key={risk}
                className="w-full flex justify-between items-center"
                onClick={() => setSelectedRisk(risk)}
              >
                {risk}
                <AlertTriangle />
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedRisk && (
        <Card className="shadow-md bg-orange-50">
          <CardContent className="p-4 space-y-3">
            <Button variant="outline" onClick={() => setSelectedRisk(null)}>
              ← Retour aux risques
            </Button>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield /> {selectedRisk}
            </h2>
            <p>{riskDetails[selectedRisk]}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
