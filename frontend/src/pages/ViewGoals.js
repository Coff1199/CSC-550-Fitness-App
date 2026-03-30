import React, {useEffect, useState} from "react";
import axios from "axios";
import GoalItem from '../components/GoalItem'
// import the components for editing, deleting, or adding goals
import AddGoal from '../components/AddGoal'
import '../styles/goals.css';

export default function ViewGoals()
// function that displays the users goals from the database
{
    const [goals, setGoals] = useState([]);

    // access api and get the goals
    useEffect(() => {
        axios.get("http://localhost:5000/api/view_goals")
        .then(res => setGoals(res.data))
        .catch(err => console.error(err));
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

                <AddGoal />
            </div>
        </>
    );
}