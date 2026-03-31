import React, {useEffect, useState} from "react";
import axios from "axios";
import GoalItem from '../components/GoalItem'
// import the components for editing, deleting, or adding goals
import AddGoal from '../components/AddGoal'
import '../styles/goals.css';

export default function ViewGoals()
/*
Component for view goals page
*/
{
    const [goals, setGoals] = useState([]);

    // access api and get the goals
    const fetchGoals = () => {
        axios.get("http://localhost:5000/api/view_goals")
        .then(res => setGoals(res.data))
        .catch(err => console.error(err));
    }
    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <>
            <div className="view-goals">
                <div className="goals-card">
                <h1 className="goals-title">Goals page demo</h1>

                <div className="goals">
                    {goals.map((goal) => {
                        return (
                            <GoalItem 
                                key={goal.id}
                                id={goal.id}
                                goalName={goal.goalname}
                                goalDesc={goal.goaldesc}
                            />
                        );
                    })}
                </div>
                </div>

                <AddGoal 
                    userId={1}
                    onGoalAdded={fetchGoals}
                />
            </div>
        </>
    );
}