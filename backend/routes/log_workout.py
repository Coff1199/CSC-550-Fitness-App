from flask import Blueprint, request, jsonify, session
from db import SessionLocal
from models.workout import Workout          # ← correct import now that workout.py exists
from datetime import datetime, date

log_workout_bp = Blueprint("log_workout", __name__)


@log_workout_bp.route('/api/log_workout', methods=["POST"])
def log_workout():
    """
    Log a new workout entry for the logged-in user.
    """
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    user_id = int(session['user_id'])

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    goal_id  = data.get("goalId")
    date_str = data.get("date")
    notes    = data.get("notes", "")

    if not isinstance(notes, str):
        return jsonify({"error": "Invalid input: notes must be a string"}), 400
    if len(notes) > 1000:
        return jsonify({"error": "Notes too long (max 1000 characters)"}), 400

    workout_date = date.today()
    if date_str:
        try:
            workout_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    if goal_id is not None and not isinstance(goal_id, int):
        return jsonify({"error": "Invalid goalId"}), 400

    db = SessionLocal()
    try:
        new_workout = Workout(
            user_id=user_id,
            goal_id=goal_id,
            date=workout_date,
            notes=notes
        )
        db.add(new_workout)
        db.commit()
        db.refresh(new_workout)

        return jsonify({
            "id":         new_workout.id,
            "user_id":    new_workout.user_id,
            "goal_id":    new_workout.goal_id,
            "date":       str(new_workout.date),
            "notes":      new_workout.notes,
            "created_at": str(new_workout.created_at)
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


@log_workout_bp.route('/api/workouts', methods=["GET"])
def get_workouts():
    """
    Get all workouts for the logged-in user, newest first.
    """
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    user_id = int(session['user_id'])

    db = SessionLocal()
    try:
        workouts = (
            db.query(Workout)
            .filter(Workout.user_id == user_id)
            .order_by(Workout.date.desc())
            .all()
        )
        return jsonify([
            {"id": w.id, "goal_id": w.goal_id, "date": str(w.date), "notes": w.notes}
            for w in workouts
        ]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()