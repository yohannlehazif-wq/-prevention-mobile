# RESTEV 85 — Passeport Prévention PWA

## Utilisation
1. Héberger le dossier sur un site HTTPS.
2. Ouvrir `index.html`.
3. Le gestionnaire crée ou saisit un code établissement, configure les risques, génère le QR salarié.
4. Le salarié scanne le QR pour accéder uniquement à son portail.
5. Le salarié réalise le QCM, signe l'attestation et peut faire un Signalement Flash photo + Google Maps.

## Supabase
Exécuter `supabase_schema.sql` si vous souhaitez la synchronisation cloud.
L'application fonctionne aussi hors ligne en localStorage.

## PWA / Offline
Le fichier `sw.js` met en cache l'application après première ouverture.
