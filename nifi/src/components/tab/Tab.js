import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import './Tab.css'
import Stock from '../stock/Stock';
import Reading from '../reading/Reading';
import Employee from '../Employee/Employee';
import CreditPage from '../credit/CreditPage';
import Sales from '../Sales/Sales';
import { useNavigate } from 'react-router-dom';
import SalesTabs from '../Sales/SalesTabs';
import Price from '../Price/Price';

function ControlledTabsExample() {
  const [key, setKey] = useState('reading');

  const navigate = useNavigate();

  return (
    <div className="tab">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => {
            setKey(k)
            navigate(`/home/${k}`);
          }}
          className="mb-3"
        >
          <Tab eventKey="stock" title="Stock">
            <Stock />
          </Tab>
          <Tab eventKey="credit" title="Credit">
            <CreditPage />
          </Tab>
          <Tab eventKey="employee" title="Employee Management">
            <Employee />
          </Tab>
          <Tab eventKey="sales" title="Sales">
            <SalesTabs />
          </Tab>
          <Tab eventKey="reading" title="Reading">
            <Reading />        
          </Tab>
          <Tab eventKey="price" title="Price">
            <Price />        
          </Tab>
        </Tabs>
    </div>
  );
}

export default ControlledTabsExample;