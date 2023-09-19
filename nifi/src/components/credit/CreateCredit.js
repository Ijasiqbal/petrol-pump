import { useState } from "react";
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import './CreateCredit.css';
import axios from 'axios';



const CreateCredit = () => {

    const [name,setname] = useState('')

    const handleCreateCredit = () => {
      // Create an object with the creditor data
      const creditor = {
        name: name,
      };
      console.log('msg sent:',creditor)
  
      // Make a POST request to create a new creditor
      axios
        .post('http://127.0.0.1:8000/api/creditors/', creditor)
        .then((response) => {
          console.log('creditor created:', response.data);
          // Clear the input fields after successful creation
          setname('');
          //setError(null);
        })
        .catch((error) => {
          console.error('Error creating creditor:', error);
          //setError('Record not created');
        });
    };

    return ( 
        <div className="create-credit">
            <h2>Create</h2>
            <div className="create-form">
                <TextField 
                  id="outlined-basic" 
                  label="Name"
                  value={name} 
                  variant="outlined"
                  onChange={(e) => {setname(e.target.value)}} 
                />

                <Fab color="error" className='icon' onClick={handleCreateCredit} aria-label="add">
                  <AddIcon />
                </Fab>
            </div>
        </div>
     );
}
 
export default CreateCredit;