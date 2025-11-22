from flask import Flask
from flask_migrate import Migrate
from extensions import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from config import Config
from datetime import timedelta
import os

app = Flask(__name__)
app.config.from_object(Config)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=72)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(
    app,
    origins=["https://projet-fin.onrender.com", "http://localhost:3000"],
    supports_credentials=True
)
mail = Mail(app)

# Forcer l'import des modèles pour Flask-Migrate
from models import user, event
from models.user import User
from models.event import event
from models.notification import Notification

from routes.auth import auth_bp
from routes.events import events_bp

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(events_bp, url_prefix="/api")

# Créer automatiquement les tables au démarrage
with app.app_context():
    db.create_all()
    print("✓ Tables de base de données créées/vérifiées")


@app.route("/")
def index():
    return "API CultureRadar is running!"


@app.route("/api/ping")
def ping():
    return "pong"


@app.route("/api/dbtest")
def dbtest():
    from models.user import User
    try:
        user_count = User.query.count()
        return f"Nombre d'utilisateurs : {user_count}"
    except Exception as e:
        return f"Erreur DB : {e}"


@app.route("/api/recreate-tables", methods=["POST"])
def recreate_tables():
    """ATTENTION: Supprime et recrée toutes les tables - Utiliser avec précaution!"""
    try:
        db.drop_all()
        db.create_all()
        return {"msg": "Tables recréées avec succès"}, 200
    except Exception as e:
        return {"msg": f"Erreur: {str(e)}"}, 500


@app.route("/api/import-json-events", methods=["POST"])
def import_json_events():
    """Importer des événements depuis un JSON uploadé"""
    try:
        from datetime import datetime
        from models.event import event
        
        data = request.get_json()
        events_data = data.get("events", [])
        
        count = 0
        for ev_data in events_data:
            # Convertir les dates string en objets date
            date_debut = None
            date_fin = None
            if ev_data.get("date_debut"):
                date_debut = datetime.strptime(ev_data["date_debut"], "%Y-%m-%d").date()
            if ev_data.get("date_fin"):
                date_fin = datetime.strptime(ev_data["date_fin"], "%Y-%m-%d").date()
            
            # Vérifier si l'événement existe déjà
            exists = event.query.filter_by(
                title=ev_data["title"], 
                date_debut=date_debut
            ).first()
            
            if not exists:
                new_event = event(
                    title=ev_data["title"],
                    author=ev_data["author"],
                    date_debut=date_debut,
                    date_fin=date_fin,
                    genres=ev_data.get("genres"),
                    description=ev_data.get("description"),
                    cover_image=ev_data.get("cover_image"),
                    latitude=ev_data.get("latitude"),
                    longitude=ev_data.get("longitude"),
                    prix=ev_data.get("prix"),
                    event_url=ev_data.get("event_url"),
                    code_postal=ev_data.get("code_postal"),
                )
                db.session.add(new_event)
                count += 1
        
        db.session.commit()
        return {"msg": f"{count} événements importés avec succès"}, 200
    
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Erreur lors de l'import JSON: {error_details}")
        return {"msg": f"Erreur: {str(e)}", "details": error_details}, 500


@app.route("/api/import-events", methods=["POST"])
def import_events():
    """Importer les événements depuis OpenAgenda"""
    try:
        import requests
        import re
        from datetime import datetime
        from models.event import event
        
        OA_KEY = "8a135178e6c348169f33f0bab8e1dc17"
        # Importer seulement 1 agenda pour éviter le timeout (plan gratuit Render = 30s max)
        AGENDAS = [
            {"uid": "2363867", "name": "Nantes"},
        ]
        
        def parse_date(date_str):
            if not date_str:
                return None
            return datetime.strptime(date_str[:10], "%Y-%m-%d").date()
        
        def extract_price(text):
            match = re.search(r'(\d+)\s*euros?', text, re.IGNORECASE)
            if match:
                return match.group(0)
            if "gratuit" in text.lower():
                return "Gratuit"
            return "Non communiqué"
        
        def get_event_url(slug):
            if slug:
                return f"https://openagenda.com/agenda/{slug}"
            return ""
        
        total_count = 0
        for agenda in AGENDAS:
            OA_URL = f"https://api.openagenda.com/v2/agendas/{agenda['uid']}/events?key={OA_KEY}&size=100"
            response = requests.get(OA_URL, timeout=10)
            data = response.json()
            count = 0
            for ev in data.get("events", []):
                title = ev["title"].get("fr") or ev["title"].get("en") or ev["title"]
                description = ev.get("description", {}).get("fr") or ev.get("description", {}).get("en") or ""
                date_debut = parse_date(ev.get("dateRange", {}).get("begin"))
                date_fin = parse_date(ev.get("dateRange", {}).get("end"))
                
                if not date_debut and ev.get("firstTiming"):
                    date_debut = parse_date(ev["firstTiming"].get("begin"))
                if not date_fin and ev.get("lastTiming"):
                    date_fin = parse_date(ev["lastTiming"].get("end"))
                
                cover_image = ""
                if ev.get("image") and ev["image"].get("base") and ev["image"].get("variants"):
                    cover_image = ev["image"]["base"] + ev["image"]["variants"][0]["filename"]
                genres = ", ".join(ev.get("keywords", {}).get("fr", []))
                author = agenda["name"]
                
                latitude = None
                longitude = None
                code_postal = None
                if ev.get("location"):
                    latitude = ev["location"].get("latitude")
                    longitude = ev["location"].get("longitude")
                    code_postal = ev["location"].get("postalCode")
                
                if not date_debut:
                    continue
                exists = event.query.filter_by(title=title, date_debut=date_debut).first()
                if not exists:
                    prix = extract_price(description)
                    slug = ev.get("slug", "")
                    event_url = get_event_url(slug)
                    new_event = event(
                        title=title,
                        author=author,
                        date_debut=date_debut,
                        date_fin=date_fin,
                        genres=genres,
                        description=description,
                        cover_image=cover_image,
                        latitude=latitude,
                        longitude=longitude,
                        prix=prix,
                        event_url=event_url,
                        code_postal=code_postal,
                    )
                    db.session.add(new_event)
                    count += 1
            db.session.commit()
            total_count += count
        
        return {"msg": f"{total_count} événements importés avec succès"}, 200
    
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Erreur lors de l'import: {error_details}")
        return {"msg": f"Erreur: {str(e)}", "details": error_details}, 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
