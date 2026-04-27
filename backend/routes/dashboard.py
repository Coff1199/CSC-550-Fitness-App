from flask import Blueprint, jsonify, session
from db import conn
from sqlalchemy import text

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user_id = session['user_id']
    
    # Query 1: Total workouts
    total_result = conn.execute(
        text('SELECT COUNT(*) as count FROM "Workouts" WHERE user_id = :uid'),
        {'uid': user_id}
    ).fetchone()
    total_workouts = total_result[0] if total_result else 0
    
    # Query 2: Top 3 goals by workout count with progress data
    goal_progress_rows = conn.execute(text('''
        SELECT
            g.id,
            g.goalname,
            COALESCE(g.estimated_workouts, 10) AS estimated_workouts,
            COUNT(w.id) AS workout_count
        FROM "Goals" g
        LEFT JOIN "Workouts" w ON g.id = w.goal_id AND w.user_id = :uid
        WHERE g.userid = :uid
        GROUP BY g.id, g.goalname, g.estimated_workouts
        ORDER BY workout_count DESC
        LIMIT 3
    '''), {'uid': user_id}).fetchall()

    goal_progress_list = []
    for row in goal_progress_rows:
        est = row[2] if row[2] and row[2] > 0 else 10
        count = row[3]
        pct = min(round((count / est) * 100, 1), 100)
        goal_progress_list.append({
            'id': row[0],
            'goalName': row[1],
            'estimatedWorkouts': est,
            'workoutCount': count,
            'progressPct': pct
        })

    # Query 3: Recent workouts
    recent_workouts = conn.execute(text('''
        SELECT w.id, w.date, w.notes, g.goalname
        FROM "Workouts" w
        LEFT JOIN "Goals" g ON w.goal_id = g.id
        WHERE w.user_id = :uid
        ORDER BY w.date DESC
        LIMIT 10
    '''), {'uid': user_id}).fetchall()
    
    recent_workouts_list = [
        {'id': row[0], 'date': str(row[1]), 'notes': row[2], 'goalName': row[3]}
        for row in recent_workouts
    ]
    
    # Query 4: Active goals count
    active_goals = conn.execute(text('''
        SELECT COUNT(*) as count 
        FROM "Goals" 
        WHERE userid = :uid 
        AND (enddate IS NULL OR enddate >= CURRENT_DATE)
    '''), {'uid': user_id}).fetchone()
    active_goals_count = active_goals[0] if active_goals else 0
    
    return jsonify({
        'totalWorkouts': total_workouts,
        'goalProgress': goal_progress_list,
        'recentWorkouts': recent_workouts_list,
        'activeGoalsCount': active_goals_count
    })
