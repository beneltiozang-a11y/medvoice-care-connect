

# 🏥 MedVoice — Dashboard Patient

## Structure générale
- **Layout** : Sidebar à gauche (navigation) + zone de contenu principal
- **Style** : Moderne & épuré, tons bleus/blancs médicaux, cartes arrondies avec ombres douces
- **Header** : Nom du patient, avatar, notifications

---

## 📄 Page 1 — Accueil / Résumé

**Objectif** : Vue d'ensemble rapide de l'état du patient

**Composants :**
- **Carte de bienvenue** : "Bonjour [Prénom]", date du jour, prochain RDV
- **Résumé médical** : Derniers symptômes signalés, évolution (icône ↑↓), conditions actives
- **Prochain rendez-vous** : Date, heure, médecin, motif — avec bouton d'action
- **Derniers appels** : Mini-liste des 3 derniers appels avec statut et résumé
- **Alertes / Notifications** : Rappels de RDV, documents à fournir

**Données backend nécessaires :**
- `Patient` : id, prénom, nom, avatar
- `Appointment` : date, heure, docteur, motif, statut
- `CallSummary` : date, durée, symptômes extraits, résumé IA
- `MedicalProfile` : symptômes actifs, historique conditions
- `Notification` : type, message, date, lu/non-lu

---

## 📅 Page 2 — Mes Rendez-vous

**Objectif** : Voir, gérer et suivre tous les rendez-vous

**Composants :**
- **Vue calendrier** (mois) avec points colorés sur les jours avec RDV
- **Liste des RDV à venir** : Cartes avec date, heure, médecin, motif, statut (confirmé/en attente/annulé)
- **Historique des RDV passés** : Liste scrollable avec résumé de la consultation
- **Filtres** : Par médecin, par statut, par période

**Données backend nécessaires :**
- `Appointment` : id, date, heure, docteur_id, motif, statut, notes_post_consultation
- `Doctor` : id, nom, spécialité, photo

---

## 📞 Page 3 — Historique des Appels

**Objectif** : Consulter tous les appels passés avec l'IA et les données extraites

**Composants :**
- **Timeline des appels** : Liste chronologique avec date, durée, motif principal
- **Détail d'un appel** (au clic) : Résumé IA complet, symptômes détectés, actions recommandées, évolution par rapport à l'appel précédent
- **Tags de symptômes** : Badges colorés pour visualiser rapidement les thèmes
- **Indicateur d'évolution** : Comparaison entre appels (amélioration / aggravation / stable)

**Données backend nécessaires :**
- `Call` : id, date, durée, transcription_résumé, symptômes[], motif, statut_évolution
- `Symptom` : id, nom, sévérité, date_début, évolution
- `AIAnalysis` : résumé, recommandations, score_urgence

---

## 🧭 Sidebar Navigation
- Logo MedVoice
- Accueil
- Mes Rendez-vous
- Historique des Appels
- Mon Profil (futur)
- Déconnexion

