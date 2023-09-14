import { useState } from 'react';
import './Reading.css'
import Opening from './opening/Opening.js';
import Closing from './closing/Closing.js';


const Reading = () => {
    
    const [active,setactive] = useState('opening')

    return ( 
        <div className='reading'>
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
                </ul>
            </div>
            <div className="content">
                { active==="opening" && <Opening />}
                { active==="closing" && <Closing />}
            </div>
        </div>
     );
}
 
export default Reading;