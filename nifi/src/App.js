import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Tabs from './components/tab/Tab'; // Assuming the path is correct
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Stock from './components/stock/Stock';
import Sales from './components/Sales/Sales';
import Reading from './components/reading/Reading';
import CreditPage from './components/credit/CreditPage';
import Employee from './components/Employee/Employee';
import SalesTabs from './components/Sales/SalesTabs';

function App() {
  return (
    <Router >
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home/*" element={<Tabs />}>
            <Route index element={<Tabs />} />
            <Route path="register" element={<Register />} />
            <Route path="credit" element={<CreditPage />} />
            <Route path="sales" element={<SalesTabs />} />
            <Route path="stock" element={<Stock />} />
            <Route path="reading" element={<Reading />} />
            <Route path="employee" element={<Employee />} />
          </Route>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
