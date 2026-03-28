from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from routes.goals import goals_bp
from db import db_bp

# start backend in terminal in backend directory using 'python app.py'
app = Flask(__name__)
CORS(app)

# register your blueprints
app.register_blueprint(goals_bp)
app.register_blueprint(db_bp)

if __name__ == "__main__":
    app.run(debug=True)