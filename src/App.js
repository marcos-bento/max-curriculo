import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Form from './pages/Form/Form';
import SobreProjeto from './pages/sobreProjeto/sobreProjeto';
import SobreDev from './pages/sobreDev/sobreDev';
import { ToastContainer } from 'react-toastify';
import SelecionarModelo from './pages/SelecionarModelo/SelecionarModelo';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/sobreProjeto" element={<SobreProjeto />} />
        <Route path="/sobreDev" element={<SobreDev />} />
        <Route path="/selecionarModelo" element={<SelecionarModelo />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
