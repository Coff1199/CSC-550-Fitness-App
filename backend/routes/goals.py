from flask import Blueprint, jsonify
from sqlalchemy import text
from db import conn

# make a ablueprint of goals
goals_bp = Blueprint("goals", __name__)

@goals_bp.route('/api/view_goals', methods=["GET"])

def get_goals():
    """
    Function for getting the goals from the databse
    :returns: jsonify(goals): the goals as jsosn
    """
    query = text('SELECT * FROM "Goals";')
    result = conn.execute(query)

    goals = [dict(row._mapping) for row in result]
    return jsonify(goals)