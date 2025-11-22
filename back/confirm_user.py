from back.app import app
from back.models.user import User
from back.extensions import db

with app.app_context():
    # Récupérer le dernier utilisateur créé
    user = User.query.order_by(User.id.desc()).first()
    
    if user:
        print(f"Utilisateur trouvé: {user.username} ({user.email})")
        print(f"Confirmé: {user.is_confirmed}")
        
        if not user.is_confirmed:
            user.is_confirmed = True
            user.confirmation_token = None
            db.session.commit()
            print("✅ Utilisateur confirmé avec succès!")
        else:
            print("✅ L'utilisateur est déjà confirmé")
    else:
        print("❌ Aucun utilisateur trouvé")
