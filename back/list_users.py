from back.app import app
from back.models.user import User

with app.app_context():
    users = User.query.all()
    print("=" * 80)
    print(f"{'ID':<5} {'Username':<20} {'Email':<30} {'Confirmé':<10}")
    print("=" * 80)
    for user in users:
        confirmed = "✅ Oui" if user.is_confirmed else "❌ Non"
        print(f"{user.id:<5} {user.username:<20} {user.email:<30} {confirmed:<10}")
    print("=" * 80)
    print(f"Total : {len(users)} utilisateur(s)")
    print("=" * 80)