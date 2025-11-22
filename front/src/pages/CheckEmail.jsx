import React from "react";
import { useNavigate } from "react-router-dom";

export default function CheckEmail() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <div style={{ 
        backgroundColor: "#ff9800", 
        color: "#000", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "30px",
        border: "3px solid #f57c00"
      }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "10px" }}>
          ⚠️ ATTENTION ⚠️
        </h1>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
          AUCUN EMAIL N'A ÉTÉ ENVOYÉ<br />
          VOUS POUVEZ UTILISER LE COMPTE DIRECTEMENT
        </p>
      </div>
      
      <h2>Vérifiez votre boîte mail</h2>
      <p>
        Un email de confirmation vous a été envoyé.<br />
        Cliquez sur le lien reçu pour activer votre compte.
      </p>
      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate("/login")}
      >
        Retour à la connexion
      </button>
    </div>
  );
}