import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: identifier, 2: new password
  const [msg, setMsg] = useState("");
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier }),
      });
      const data = await response.json();
      
      if (response.ok && data.token) {
        setResetToken(data.token);
        setStep(2);
      } else {
        setMsg(data.msg || "Utilisateur non trouvé");
      }
    } catch {
      setMsg("Erreur lors de la recherche.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    
    if (newPassword !== confirmPassword) {
      setMsg("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
      setMsg("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reset-password/${resetToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Mot de passe modifié avec succès !");
        navigate("/login");
      } else {
        setMsg(data.msg || "Erreur lors de la modification");
      }
    } catch {
      setMsg("Erreur lors de la modification du mot de passe.");
    }
  };

  return (
    <div>
      <h2>Mot de passe oublié</h2>
      
      <div style={{ 
        backgroundColor: "#ff9800", 
        color: "#000", 
        padding: "15px", 
        borderRadius: "6px", 
        marginBottom: "20px",
        border: "2px solid #f57c00",
        fontSize: "0.95rem"
      }}>
        <strong>ℹ️ MODE DÉVELOPPEMENT :</strong> Vous pourrez modifier votre mot de passe directement sans recevoir d'email.
      </div>
      
      {step === 1 && (
        <form onSubmit={handleIdentifierSubmit}>
          <input
            className="form-control mb-2"
            type="text"
            placeholder="Email ou nom d'utilisateur"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100" type="submit">
            Continuer
          </button>
          {msg && <div style={{ color: "red", marginTop: 10 }}>{msg}</div>}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePasswordSubmit}>
          <div style={{ marginBottom: 15, padding: 10, backgroundColor: "#e8f5e9", borderRadius: 5 }}>
            <strong>✅ Utilisateur trouvé :</strong> {identifier}
          </div>
          <input
            className="form-control mb-2"
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className="form-control mb-2"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100" type="submit">
            Modifier le mot de passe
          </button>
          {msg && <div style={{ color: "red", marginTop: 10 }}>{msg}</div>}
        </form>
      )}
    </div>
  );
}