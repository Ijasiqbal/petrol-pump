import { useState } from "react";

const Addstock = () => {
    const [tank1,settank1] = useState('');
    const [tank2,settank2] = useState('');
    const [tank3,settank3] = useState('');
    const [tank4,settank4] = useState('');

    function handlesubmit(e){
        console.log('submited')
    }


    return ( 
        <div>
            <div>
                <h3>Add Stock</h3>
                <form onSubmit={handlesubmit} className="mainstock">
                    <label>Tank 1</label>
                    <input 
                        type="number" 
                        value={tank1}
                        onChange={(e) => settank1(e.target.value)}
                    />
                    <label>Tank 2</label>
                    <input 
                        type="number" 
                        value={tank2}
                        onChange={(e) => settank2(e.target.value)}
                    />
                    <label>Tank 3</label>
                    <input 
                        type="number" 
                        value={tank3}
                        onChange={(e) => settank3(e.target.value)}
                    />
                    <label>Tank 4</label>
                    <input 
                        type="number" 
                        value={tank4}
                        onChange={(e) => settank4(e.target.value)}
                    />
                    <button className="btn1">Save</button>             
                </form>
            </div>
        </div>
     );
}
 
export default Addstock;