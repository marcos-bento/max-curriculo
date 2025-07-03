import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Form from './pages/Form/Form';
import Preview from './pages/Preview/Preview';
import SobreProjeto from './pages/sobreProjeto/sobreProjeto';
import SobreDev from './pages/sobreDev/sobreDev';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/sobreProjeto" element={<SobreProjeto />} />
        <Route path="/sobreDev" element={<SobreDev />} />
      </Routes>
    </Router>
  );
}

export default App;
