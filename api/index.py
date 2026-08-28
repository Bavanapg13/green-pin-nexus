import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from backend.app.database import init_db
try:
    init_db()
except Exception as e:
    print("Database initialization note:", e)

from backend.app.main import app
