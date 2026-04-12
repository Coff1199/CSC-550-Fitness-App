
export default function GoalItem(properties) {
    /**
     * React component that creates a goal item 
     * params: key, id : integers, goalName, goalDesc : strings, react components for 
     * returns a div goal item with  the goals name, description, and edit and delete buttons
     **/

    return(
        <>
            <div className="goal-item">
            <h2>{properties.goalName}</h2>
            <p>{properties.goalDesc}</p>
                <div className="goal-actions">
                    {
                        // TODO: add any aadditional componenets for edit and delete
                    }
                    <button className="edit-btn">Edit temp</button>
                    <button 
                        className="delete-btn"
                        onClick={properties.onDeleteClick}
                    >
                        Delete Goal
                    </button>
                </div>
            </div>
        </>
    );
}