import { useState } from 'react';
import './Reading.css'
import Opening from './opening/Opening.js';
import Closing from './closing/Closing.js';
import Dashboard from './Dashboard';


const Reading = () => {
    
    const [active,setactive] = useState('opening')

    return ( 
        <div className={active === "dashboard" ? "base" : "reading"}>
            <div className="btns">
                <ul>
                    <button 
                    onClick={() => {setactive("opening")}}
                    className={active==="opening" ? "btn2 active-btn" : "btn2"}
                    >Opening</button>
                    <button
                    onClick={() =>{setactive("closing")}}
                        className={active==="closing" ? "btn2 active-btn" : "btn2"}                    
                    >Closing</button>
                    <button
                    onClick={() =>{setactive("dashboard")}}
                        className={active==="dashboard" ? "btn2 active-btn" : "btn2"}                    
                    >Reading Dashboard</button>
                </ul>
            </div>
            <div className="content">
                { active==="opening" && <Opening />}
                { active==="closing" && <Closing />}
                { active==="dashboard" && <Dashboard />}
            </div>
        </div>
     );
}
 
export default Reading;