// import React from "react";
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";

function App() {
    return (
        <Routes>
            <Route path="/login" element={< LoginPage />} />
        </Routes>
    );
}

export default App