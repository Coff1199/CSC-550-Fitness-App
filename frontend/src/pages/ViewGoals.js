import React, {useEffect, useState} from "react";
import axios from "axios";
import GoalItem from '../components/GoalItem'
// import the components for editing, deleting, or adding goals
import AddGoal from '../components/AddGoal'
import DeleteGoal from "../components/DeleteGoal";
import '../styles/goals.css';

export default function ViewGoals()
/*
Component for view goals page
*/
{
    const [goals, setGoals] = useState([]);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // access api and get the goals
    const fetchGoals = () => {
        axios.get("http://localhost:5000/api/view_goals", {
            withCredentials: true
        })
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
                                onDeleteClick={() => {
                                    setSelectedGoalId(goal.id);
                                    setShowDeleteModal(true);
                                }}
                            />
                        );
                    })}
                </div>
                </div>

                <AddGoal 
                    userId={1}
                    onGoalAdded={fetchGoals}
                />
                {showDeleteModal && (
                <DeleteGoal
                    goalId={selectedGoalId}
                    onClose={() => setShowDeleteModal(false)}
                    onGoalDeleted={() => {
                        fetchGoals();
                        setTimeout(() => {
                            setShowDeleteModal(false);
                        }, 800);
                    }}
                />
            )}
            </div>
        </>
    );
}