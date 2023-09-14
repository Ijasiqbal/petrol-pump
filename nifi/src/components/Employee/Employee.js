import { useState } from 'react';
import './Employee.css'
import Dashboard from './Dashboard';
import Create from './Create';
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
                    onClick={() =>{setactive("dashboard")}}
                        className={active==="dashboard" ? "btn2 active-btn" : "btn2"}                    
                    >Employee Dashboard</button>
                </ul>
            </div>
            <div className="content">
                { active==="create" && <Create/>}
                { active==="dashboard" && <Dashboard />}
            </div>

        </div>
     );
}
 
export default Employee;