import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/App.css';
import Home from './pages/Home';
import  Header from './components/Header';

function App() {
    // npm start to run in frontend folder

    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/home" element={<Home/>} />
                </Routes>
            </BrowserRouter>
        </>
    ) 
}

export default App;
