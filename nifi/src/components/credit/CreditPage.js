import './CreditPage.css';
import { useState } from 'react';
import CreditDashboard from './CreditDashboard';
import Credit from './Credit';
import Debit from './Debit'
import CreateCredit from './CreateCredit';

const CreditPage = () => {

    const [active,setactive] = useState('Credit');

    return ( 
        <div className="base">
            <div className="btns">
                <ul>
                    <button 
                    onClick={() => {setactive("Credit")}}
                    className={active==="Credit" ? "btn2 active-btn" : "btn2"}
                    >Credit</button>
                    <button
                    onClick={() =>{setactive("debit")}}
                        className={active==="debit" ? "btn2 active-btn" : "btn2"}                    
                    >Debit</button>
                    <button
                    onClick={() =>{setactive("CreditDashboard")}}
                        className={active==="CreditDashboard" ? "btn2 active-btn" : "btn2"}                    
                    >CreditDashboard</button>
                    <button
                    onClick={() =>{setactive("create")}}
                        className={active==="create" ? "btn2 active-btn" : "btn2"}                    
                    >Create</button>
                    
                </ul>
            </div>
            <div className="content">
                { active==="Credit" && <Credit/>}
                { active==="debit" && <Debit />}
                { active==="CreditDashboard" && <CreditDashboard />}
                { active==="create" && <CreateCredit />}
            </div>

        </div>
     );
}
 
export default CreditPage;