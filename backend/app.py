from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

# start backend with in terminal in backend directory using 'python app.py'
app = Flask(__name__)
CORS(app)
@app.route("/api/message")
def home():
    return jsonify({"message":"running..."})

load_dotenv()
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

engine = create_engine(os.getenv("DATABASE_URL"))
conn = engine.connect()
print("Connected to DB")

if __name__ == "__main__":
    app.run(debug=True)