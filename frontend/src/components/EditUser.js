import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function EditUser(props) {
    const { user } = useAuth();

    const [firstname, setFirstname] = useState(props.firstname || '');
    const [lastname, setLastname] = useState(props.lastname || '');
    const [email, setEmail] = useState(props.email || '');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setFirstname(props.firstname || '');
        setLastname(props.lastname || '');
        setEmail(props.email || '');
    }, [props.userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!firstname.trim() || !lastname.trim() || !email.trim()) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/edit_user', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: props.userId,
                    firstname,
                    lastname,
                    email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update user');
            }

            setSuccess('Profile updated successfully!');
            setError('');

            props.onUserUpdated();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">

                {success && (
                    <>
                        <p className="success-message">{success}</p>
                        <button className="close-btn" onClick={props.onClose}>
                            Close
                        </button>
                    </>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} className="edit-user-form">

                        <h2 className="form-title">Edit Profile</h2>

                        {error && <p className="error-message">{error}</p>}

                        <label className="form-label">First Name</label>
                        <input
                            className="form-input"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />

                        <label className="form-label">Last Name</label>
                        <input
                            className="form-input"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />

                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="form-buttons">
                            <button type="submit" className="submit-btn">
                                Update
                            </button>

                            <button
                                type="button"
                                className="close-btn"
                                onClick={props.onClose}
                            >
                                Close
                            </button>
                        </div>

                    </form>
                )}

            </div>
        </div>
    );
}

export default EditUser;