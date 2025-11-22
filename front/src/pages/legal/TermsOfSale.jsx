import React from "react";

export default function TermsOfSale() {
  return (
    <div className="legal-page">
      <h1>Conditions Générales de Vente</h1>
      
      <div style={{ 
        backgroundColor: "#ff9800", 
        color: "#000", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "30px",
        border: "3px solid #f57c00",
        fontSize: "1rem",
        fontWeight: "500"
      }}>
        <h3 style={{ marginTop: 0, color: "#000" }}>⚠️ PROJET ÉTUDIANT FICTIF</h3>
        <p style={{ marginBottom: 0 }}>
          Ce site est un projet étudiant à but pédagogique uniquement. <strong>Aucun achat réel ne peut être effectué, aucune réservation n'est réellement prise en compte.</strong> Toutes les informations présentes sur ce site, y compris les adresses email, les coordonnées d'entreprise et les données utilisateurs, sont entièrement fictives. Ce projet ne constitue pas une entreprise réelle et n'offre aucun service commercial.
        </p>
      </div>

      <h2>Éditeur</h2>
      <p>
        Capsule Culture – SASU<br />
        SIRET : 903 112 654 00021<br />
        Siège social : 4 rue pas trop cher, 75011 Paris, France<br />
        Email : <a href="mailto:contact.principale@gmail.com">contact.principale@gmail.com</a><br />
        Représentée par Mme Lemoine, Présidente
      </p>
      <h2>Produits et services concernés</h2>
      <ul>
        <li>Abonnements Premium (utilisateurs particuliers)</li>
        <li>Abonnements Professionnels (organisateurs d’événements)</li>
        <li>Mises en avant d’événements (upvote ou promotion)</li>
        <li>Commissions sur billetterie en ligne</li>
      </ul>
      <h2>Modalités de paiement</h2>
      <p>
        Les paiements s’effectuent par carte bancaire via un prestataire sécurisé (Stripe, Paypal ou autre).<br />
        Les prix sont indiqués en euros TTC.
      </p>
      <h2>Rétractation & résiliation</h2>
      <p>
        L’utilisateur dispose d’un droit de rétractation de 14 jours.<br />
        Les abonnements sont sans engagement, résiliables à tout moment depuis l’espace personnel.
      </p>
      <h2>Responsabilité & litiges</h2>
      <p>
        Capsule Culture ne garantit pas la présence ou le succès des événements promus.<br />
        Tout litige sera soumis au droit français et traité par les tribunaux de Paris.
      </p>
    </div>
  );
}