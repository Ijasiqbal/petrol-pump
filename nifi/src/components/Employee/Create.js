import TextField from '@mui/material/TextField';
import { Icon } from '@mui/material';import { red } from '@mui/material/colors';
import './Create.css'
import { useState } from 'react';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


const Create = () => {

    const [name,setname] = useState('');
    const [age,setage] = useState(null);
    const [phone,setphone] = useState(null);
    const [error, setError] = useState(null);
    

    const handleCreateEmployee = () => {
        // Create an object with the employee data
        const newEmployee = {
          name: name,
          age: age,
          phone: phone,
        };
        console.log('msg sent:',newEmployee)
    
        // Make a POST request to create a new employee
        axios
          .post('http://127.0.0.1:8000/api/employee/', newEmployee)
          .then((response) => {
            console.log('Employee created:', response.data);
            // Clear the input fields after successful creation
            setname('');
            setage('');
            setphone('');
            setError(null);
          })
          .catch((error) => {
            console.error('Error creating employee:', error);
            setError('Record not created');
          });
      };

    return ( 
        <div>
          <h3 className='heading3'>Create an Employee</h3>
            <div className='form'>
                <TextField 
                  id="outlined-basic" 
                  label="Name"
                  value={name} 
                  variant="outlined"
                  onChange={(e) => {setname(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase())}} 
                />
                <TextField 
                  sx={{width:100}}
                  id="outlined-basic" 
                  label="Age" 
                  value={age}
                  variant="outlined"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue)) {  // Check if the input value contains only digits
                      setage(inputValue);
                  }}} 
                />
                <TextField 
                  
                  id="outlined-basic" 
                  label="Phone Number" 
                  value={phone}
                  variant="outlined"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue)) {  // Check if the input value contains only digits
                      setphone(inputValue);
                  }}} 
                />  
                <Fab color="error" className='icon' onClick={handleCreateEmployee} aria-label="add">
                  <AddIcon />
                </Fab>
                    
                    <div>
                    </div>
 
            </div>
            <div>
                {error && <p className="error-message">{error}</p>} {/* Display error message if error state is set */}
            </div>

        </div>
     );
}
 
export default Create;