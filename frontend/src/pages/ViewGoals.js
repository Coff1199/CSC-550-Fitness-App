// import the components for editing, deleting, or adding goals
import '../styles/goals.css';

export default function ViewGoals()
// function that displays the users goals from the database
{
    return (
        <>
            <div className="view-goals">
                <div className="goals-card">
                <h1 className="goals-title">Goals page demo</h1>

                <div className="goals">
                    <div className="goal-item">
                    <h2>Goal 1</h2>
                    <p>Placeholder Text</p>
                    <div className="goal-actions">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                    </div>
                    </div>

                    <div className="goal-item">
                    <h2>Goal 2</h2>
                    <p>Another placeholder</p>
                    <div className="goal-actions">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                    </div>
                    </div>
                </div>
                </div>

                <button className="add-goal-btn">Add Goal</button>
            </div>
        </>
    );
}