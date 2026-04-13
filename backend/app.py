from flask import Flask, jsonify, session
from flask_cors import CORS
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from routes.goals import goals_bp
from routes.auth import auth_bp  # NEW: Import auth blueprint
from routes.add_goal import add_goal_bp
from db import db_bp
from datetime import timedelta
from routes.dashboard import dashboard_bp
from models.workout import Workout
from db import Base, engine

# Load environment variables
load_dotenv()

# start backend in terminal in backend directory using 'python app.py'
app = Flask(__name__)

# NEW: Configure session for login/logout
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)

# Configure CORS to allow credentials (needed for sessions/cookies)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# register your blueprints
app.register_blueprint(goals_bp)
app.register_blueprint(auth_bp)  # NEW: Register auth blueprint
app.register_blueprint(add_goal_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(db_bp)
Base.metadata.create_all(engine)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
