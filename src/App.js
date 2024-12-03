import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';
import Preview from './pages/Preview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </Router>
  );
}

export default App;
