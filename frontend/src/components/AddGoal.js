import { useState } from 'react';

function AddGoal(props) {
    const [goalName, setGoalName] = useState('');
    const [goalDesc, setGoalDesc] = useState('');
    const [endDate, setEndDate] = useState('');

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <button className="add-goal-btn" onClick={()=> handleShow}>
                Add Goal
            </button>
            {show && (
                <div className="modal-overlay">
                    <div className="modal">
                        <form onSubmit=''>
                            
                        </form>
                    </div>
                </div>
            )}
        
        </>
  );
}

export default AddGoal;