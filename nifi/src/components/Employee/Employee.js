import { useState } from 'react';
import './Employee.css'
import Dashboard from '../reading/Dashboard';
import Create from './Create';
import EmployeeData from './EmployeeData';
const Employee = () => {

    const [active,setactive] = useState('create')

    return ( 
        <div className="base">
            <div className="btns">
                <ul>
                    <button 
                    onClick={() => {setactive("create")}}
                    className={active==="create" ? "btn2 active-btn" : "btn2"}
                    >Create</button>
                    <button
                    onClick={() =>{setactive("employeeData")}}
                        className={active==="employeeData" ? "btn2 active-btn" : "btn2"}                    
                    >Employee Data</button>
                </ul>
            </div>
            <div className="content">
                { active==="create" && <Create/>}
                { active==="employeeData" && <EmployeeData />}
            </div>

        </div>
     );
}
 
export default Employee;