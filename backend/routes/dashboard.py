from flask import Blueprint, jsonify, session
from db import conn
from sqlalchemy import text
<<<<<<< HEAD
from datetime import date, timedelta
=======
>>>>>>> feature/editProfile

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
<<<<<<< HEAD

    user_id = session['user_id']

=======
    
    user_id = session['user_id']
    
>>>>>>> feature/editProfile
    # Query 1: Total workouts
    total_result = conn.execute(
        text('SELECT COUNT(*) as count FROM "Workouts" WHERE user_id = :uid'),
        {'uid': user_id}
    ).fetchone()
    total_workouts = total_result[0] if total_result else 0
<<<<<<< HEAD

    # Query 2: Workouts by goal
    workouts_by_goal = conn.execute(text('''
        SELECT g.goalname, COUNT(w.id) as count
        FROM "Goals" g
=======
    
    # Query 2: Workouts by goal
    workouts_by_goal = conn.execute(text('''
        SELECT g.goalname, COUNT(w.id) as count 
        FROM "Goals" g 
>>>>>>> feature/editProfile
        LEFT JOIN "Workouts" w ON g.id = w.goal_id AND w.user_id = :uid
        WHERE g.userid = :uid
        GROUP BY g.goalname
    '''), {'uid': user_id}).fetchall()
<<<<<<< HEAD

    workouts_by_goal_list = [{'goalName': row[0], 'count': row[1]} for row in workouts_by_goal]

=======
    
    workouts_by_goal_list = [{'goalName': row[0], 'count': row[1]} for row in workouts_by_goal]
    
>>>>>>> feature/editProfile
    # Query 3: Recent workouts
    recent_workouts = conn.execute(text('''
        SELECT w.id, w.date, w.notes, g.goalname
        FROM "Workouts" w
        LEFT JOIN "Goals" g ON w.goal_id = g.id
        WHERE w.user_id = :uid
        ORDER BY w.date DESC
        LIMIT 10
    '''), {'uid': user_id}).fetchall()
<<<<<<< HEAD

=======
    
>>>>>>> feature/editProfile
    recent_workouts_list = [
        {'id': row[0], 'date': str(row[1]), 'notes': row[2], 'goalName': row[3]}
        for row in recent_workouts
    ]
<<<<<<< HEAD

    # Query 4: Active goals count
    active_goals = conn.execute(text('''
        SELECT COUNT(*) as count
        FROM "Goals"
        WHERE userid = :uid
        AND (enddate IS NULL OR enddate >= CURRENT_DATE)
    '''), {'uid': user_id}).fetchone()
    active_goals_count = active_goals[0] if active_goals else 0

    # Query 5: Streak calculation
    streak_rows = conn.execute(
        text('SELECT DISTINCT date FROM "Workouts" WHERE user_id = :uid ORDER BY date ASC'),
        {'uid': user_id}
    ).fetchall()

    current_streak = 0
    longest_streak = 0

    if streak_rows:
        workout_dates = [row[0] for row in streak_rows]

        # Longest streak
        longest = 1
        run = 1
        for i in range(1, len(workout_dates)):
            if workout_dates[i] == workout_dates[i - 1] + timedelta(days=1):
                run += 1
                if run > longest:
                    longest = run
            else:
                run = 1
        longest_streak = longest

        # Current streak (must include today or yesterday to be active)
        today = date.today()
        if workout_dates[-1] >= today - timedelta(days=1):
            current_streak = 1
            for i in range(len(workout_dates) - 2, -1, -1):
                if workout_dates[i + 1] == workout_dates[i] + timedelta(days=1):
                    current_streak += 1
                else:
                    break

    # Query 6: Top Personal Records (best value per exercise)
    try:
        top_prs = conn.execute(text('''
            SELECT DISTINCT ON (exercise) exercise, value, unit, achieved_on
            FROM "PersonalRecords"
            WHERE user_id = :uid
            ORDER BY exercise, value DESC
            LIMIT 5
        '''), {'uid': user_id}).fetchall()
        top_prs_list = [
            {'exercise': row[0], 'value': row[1], 'unit': row[2], 'achieved_on': str(row[3])}
            for row in top_prs
        ]
    except Exception:
        top_prs_list = []

=======
    
    # Query 4: Active goals count
    active_goals = conn.execute(text('''
        SELECT COUNT(*) as count 
        FROM "Goals" 
        WHERE userid = :uid 
        AND (enddate IS NULL OR enddate >= CURRENT_DATE)
    '''), {'uid': user_id}).fetchone()
    active_goals_count = active_goals[0] if active_goals else 0
    
>>>>>>> feature/editProfile
    return jsonify({
        'totalWorkouts': total_workouts,
        'workoutsByGoal': workouts_by_goal_list,
        'recentWorkouts': recent_workouts_list,
<<<<<<< HEAD
        'activeGoalsCount': active_goals_count,
        'currentStreak': current_streak,
        'longestStreak': longest_streak,
        'topPersonalRecords': top_prs_list,
=======
        'activeGoalsCount': active_goals_count
>>>>>>> feature/editProfile
    })
