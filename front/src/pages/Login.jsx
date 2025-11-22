import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import eventService from "../services/eventService";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState("right");
  const [isSliding, setIsSliding] = useState(false);
  const [hovered, setHovered] = useState({ left: false, right: false });

  useEffect(() => {
    // Charger les événements suggérés sans authentification
    fetch(`${process.env.REACT_APP_API_URL}/events/suggestions`)
      .then(res => res.json())
      .then(data => {
        setSuggestions(data);
        // Préchargement des images
        data.forEach(ev => {
          const img = new window.Image();
          img.src = ev.cover_image;
        });
      })
      .catch(err => console.error("Erreur chargement suggestions:", err));
  }, []);

  useEffect(() => {
    if (!suggestions.length) return;
    const timer = setInterval(() => {
      setSlideDirection("right");
      setPrevIndex(current);
      setIsSliding(true);
      const nextIndex = (current + 1) % suggestions.length;
      setTimeout(() => {
        setCurrent(nextIndex);
        setIsSliding(false);
        setPrevIndex(null);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, [suggestions, current]);

  const handlePrev = () => {
    setSlideDirection("left");
    setPrevIndex(current);
    setIsSliding(true);
    setTimeout(() => {
      setCurrent((current - 1 + suggestions.length) % suggestions.length);
      setIsSliding(false);
      setPrevIndex(null);
    }, 300);
  };

  const handleNext = () => {
    setSlideDirection("right");
    setPrevIndex(current);
    setIsSliding(true);
    setTimeout(() => {
      setCurrent((current + 1) % suggestions.length);
      setIsSliding(false);
      setPrevIndex(null);
    }, 300);
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(credentials);
      const user = await authService.me();
      setUser(user);
      navigate("/");
    } catch (error) {
      alert("Erreur de connexion : " + (error.msg || "Identifiants invalides"));
    }
  };

  const event = suggestions.length > 0 ? suggestions[current] : null;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Titre principal */}
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "20px", color: "#fff" }}>
        Capsule Culture
      </h1>
      
      {/* Bandeau d'avertissement */}
      <div style={{ 
        backgroundColor: "#FF7961", 
        color: "#000", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "20px",
        border: "3px solid #D32F2F",
        textAlign: "center"
      }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", margin: 0 }}>
          Il s'agit d'un projet étudiant fictif pour lequel aucun réel achat ou aucune réservation ne pourrait être effectué
        </h3>
      </div>

      {/* Preview du site */}
      <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", textAlign: "center", marginBottom: "20px", color: "#fff" }}>
        Preview du site
      </h2>

      {/* Carrousel d'événements */}
      {event && (
        <div
          style={{
            width: "100%",
            position: "relative",
            height: "320px",
            overflow: "hidden",
            borderRadius: "18px",
            boxShadow: "0 2px 12px #0002",
            background: "#222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px"
          }}
        >
          {/* Ancienne image, animée vers l'extérieur */}
          {isSliding && prevIndex !== null && (
            <img
              src={suggestions[prevIndex].cover_image}
              alt={suggestions[prevIndex].title}
              className={`carousel-img slide-out-${slideDirection}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.6)",
                borderRadius: "18px",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 1,
              }}
            />
          )}
          {/* Nouvelle image, animée vers l'intérieur */}
          {isSliding && prevIndex !== null ? (
            <img
              src={suggestions[
                (prevIndex + (slideDirection === "right" ? 1 : -1) + suggestions.length) % suggestions.length
              ].cover_image}
              alt={suggestions[
                (prevIndex + (slideDirection === "right" ? 1 : -1) + suggestions.length) % suggestions.length
              ].title}
              className={`carousel-img slide-in-${slideDirection}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.6)",
                borderRadius: "18px",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 2,
              }}
            />
          ) : (
            <img
              src={event.cover_image}
              alt={event.title}
              className="carousel-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.6)",
                borderRadius: "18px",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 2,
              }}
            />
          )}
          {/* Ancien titre, animé vers l'extérieur */}
          {isSliding && prevIndex !== null && (
            <div
              className={`carousel-title slide-out-${slideDirection}`}
              style={{
                position: "absolute",
                zIndex: 5,
                color: "#fff",
                fontSize: "2.2em",
                fontWeight: "bold",
                textShadow: "0 2px 8px #000",
                width: "100%",
                textAlign: "center",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                pointerEvents: "none"
              }}
            >
              {suggestions[prevIndex].title}
            </div>
          )}
          {/* Nouveau titre */}
          <div
            className={`carousel-title${isSliding ? ` slide-in-${slideDirection}` : ""}`}
            style={{
              position: "absolute",
              zIndex: 6,
              color: "#fff",
              fontSize: "2.2em",
              fontWeight: "bold",
              textShadow: "0 2px 8px #000",
              width: "100%",
              textAlign: "center",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              pointerEvents: "none"
            }}
          >
            {event.title}
          </div>
          {/* Points blancs */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              zIndex: 3
            }}
          >
            {suggestions.map((_, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  width: current === idx ? 18 : 10,
                  height: current === idx ? 18 : 10,
                  borderRadius: "50%",
                  background: "#fff",
                  opacity: current === idx ? 1 : 0.5,
                  transition: "all 0.3s"
                }}
              />
            ))}
          </div>

          {/* Flèche gauche */}
          <button
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: 60,
              zIndex: 10,
              background: hovered.left ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.18)",
              border: "none",
              borderRadius: 0,
              color: "#fff",
              fontSize: "2em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingLeft: 12,
              transition: "background 0.2s"
            }}
            onMouseEnter={() => setHovered(h => ({ ...h, left: true }))}
            onMouseLeave={() => setHovered(h => ({ ...h, left: false }))}
            onClick={handlePrev}
            aria-label="Précédent"
          >
            &#8592;
          </button>

          {/* Flèche droite */}
          <button
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: 60,
              zIndex: 10,
              background: hovered.right ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.18)",
              border: "none",
              borderRadius: 0,
              color: "#fff",
              fontSize: "2em",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 12,
              transition: "background 0.2s"
            }}
            onMouseEnter={() => setHovered(h => ({ ...h, right: true }))}
            onMouseLeave={() => setHovered(h => ({ ...h, right: false }))}
            onClick={handleNext}
            aria-label="Suivant"
          >
            &#8594;
          </button>
        </div>
      )}

      {/* Descriptif du site */}
      <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", gap: "15px" }}>
        <div style={{ flex: "0 0 auto" }}>
          <img 
            src="/event_preview.png" 
            alt="Événement exemple"
            style={{
              width: "300px",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "1.5rem", color: "#fff", lineHeight: "1.8", margin: 0 }}>
            Inscriver vous au évènement proche de chez vous et que vous serait intéressé <br />
            grâce à vos préférences culturelles vous avez données<br />
            On vous propose des événements adaptés à vos goûts et à votre localisation,<br />
            pour une expérience culturelle personnalisée et enrichissante.<br />
            Vous pouvez voir à quel jour les évènements ont lieu, leur description et leur localisation.
          </p>
        </div>
      </div>

      {/* Deuxième section : créer des événements */}
      <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", gap: "15px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "1.5rem", color: "#fff", lineHeight: "1.8", margin: 0 }}>
            Utiliser notre site pour créer des annonces pour vos évènements culturels.<br />
            Partagez vos événements avec une communauté passionnée et intéressée par la culture.<br />
            Gérez facilement vos annonces et atteignez un public ciblé.<br />
            Profitez d'une plateforme intuitive pour maximiser la visibilité de vos événements.
          </p>
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <img 
            src="/create_event.png" 
            alt="Créer un événement"
            style={{
              width: "300px",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}
          />
        </div>
      </div>

      {/* Texte centré */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "1.2rem", color: "#fff", lineHeight: "1.8", maxWidth: "800px", margin: "0 auto" }}>
          Capsule Culture est l'idée de Mme Lemoine, passionnée de culture et habitante de Montreuil, qui 
          observe chaque jour l'incroyable vitalité artistique de Paris et de sa périphérie... mais aussi 
          son inaccessibilité pour une large partie de la population. Trop d’évènements, trop de 
          plateformes, et paradoxalement, trop peu de recommandations vraiment utiles, 
          contextualisées et accessibles. 
          De cette frustration est née l’idée de CultureRadar, une plateforme digitale intelligente et 
          inclusive, conçue pour reconnecter les habitants avec leur offre culturelle locale. L’objectif : 
          leur proposer une solution digitale qui pense à la place de l’utilisateur, capable de 
          suggérer des expériences culturelles pertinentes, personnalisées et de proximité, selon leurs 
          goûts, leur localisation, leur emploi du temps, leurs moyens de transport, et même les 
          conditions météo.
        </p>
      </div>

      {/* Formulaire de connexion */}
      <div style={{ maxWidth: "500px", margin: "0 auto", background: "#f5f5f5", padding: "40px", borderRadius: "8px" }}>
        <h2 style={{ marginBottom: "30px", textAlign: "center", color: "#000" }}>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            name="username"
            placeholder="Nom d'utilisateur"
            onChange={handleChange}
            required
            style={{ padding: "12px", fontSize: "1rem" }}
          />
          <input
            className="form-control mb-3"
            name="password"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
            style={{ padding: "12px", fontSize: "1rem" }}
          />
          <button type="submit" className="btn btn-primary w-100" style={{ padding: "12px", fontSize: "1.1rem" }}>
            Se connecter
          </button>
        </form>
        <div className="mt-3" style={{ textAlign: "center", color: "#000" }}>
          <span>Pas de compte ? </span>
          <Link to="/register" style={{ color: "#000", textDecoration: "underline" }}>Créer un compte</Link>
        </div>
        <div className="mt-2" style={{ textAlign: "center" }}>
          <Link to="/forgot-password" style={{ color: "#000", textDecoration: "underline" }}>Mot de passe oublié&nbsp;?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
