import React, {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/api/message")
        .then(res => setMessage(res.data.message))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Message from Flask:</h1>
            <p>{message}</p>
        </div>
    ) // test
}

export default App;
