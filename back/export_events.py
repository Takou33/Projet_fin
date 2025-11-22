"""
Script pour exporter les événements de la base SQLite locale vers un fichier JSON
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import app
from extensions import db
from models.event import event
import json

with app.app_context():
    events = event.query.all()
    events_list = []
    
    for ev in events:
        events_list.append({
            "title": ev.title,
            "author": ev.author,
            "date_debut": ev.date_debut.isoformat() if ev.date_debut else None,
            "date_fin": ev.date_fin.isoformat() if ev.date_fin else None,
            "genres": ev.genres,
            "description": ev.description,
            "cover_image": ev.cover_image,
            "latitude": ev.latitude,
            "longitude": ev.longitude,
            "prix": ev.prix,
            "event_url": ev.event_url,
            "code_postal": ev.code_postal,
        })
    
    with open("events_export.json", "w", encoding="utf-8") as f:
        json.dump(events_list, f, ensure_ascii=False, indent=2)
    
    print(f"✓ {len(events_list)} événements exportés vers events_export.json")
