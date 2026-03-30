import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from flask import jsonify, Blueprint

# make a blueprint of db
db_bp = Blueprint("database", __name__)

@db_bp.route('/api/message', methods=["GET"])
def home():
    """
    Function to show if flask is connected
    :return: jsonify message for running
    """
    return jsonify({"message":"running..."})

# get the databse
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# create the engine and connect to database 
engine = create_engine(os.getenv("DATABASE_URL"))
conn = engine.connect()
print("Connected to DB")

