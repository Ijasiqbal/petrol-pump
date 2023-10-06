import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import './Tab.css'
import Stock from '../stock/Stock';
import Reading from '../reading/Reading';
import Employee from '../Employee/Employee';
import CreditPage from '../credit/CreditPage';
import Sales from '../Sales/Sales';

function ControlledTabsExample() {
  const [key, setKey] = useState('');

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
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
        <Sales />
      </Tab>
      <Tab eventKey="reading" title="Reading">
        <Reading />        
      </Tab>
    </Tabs>
  );
}

export default ControlledTabsExample;