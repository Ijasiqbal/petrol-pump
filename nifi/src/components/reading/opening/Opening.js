import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
import { red } from '@mui/material/colors';
import './Opening.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UseReadingcontext } from '../../../Readingcontext.js';
import { format } from 'date-fns';


const Opening = () => {
  const {petrol,
    setpetrol,
    diesel,
    setdiesel,
    extragreen,
    setextragreen,
    extrapriemium,
    setextrapriemium} = UseReadingcontext();

  const [name, setname] = useState('');
  const [DU,setDU] = useState('')
  const [nossleValue, setNossleValue] = useState('');
  const [openingReadingP, setopeningReadingP] = useState('');
  const [openingReadingD, setopeningReadingD] = useState('');
  const [employeenames,setemployeenames] = useState([]);



  // Function to reset the state values at midnight
const resetStateAtMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // Set to midnight

  const timeUntilMidnight = midnight - now;

  setTimeout(() => {
    setpetrol(null);
    setdiesel(null);
    setextragreen(null);
    setextrapriemium(null);
  }, timeUntilMidnight);
};


  const handleNameChange = (event) => {
    setname(event.target.value);
  };

  const handleDUchange = (event) => {
    setDU(event.target.value);
  };

  const handleNossleChange = (event) => {
    setNossleValue(event.target.value);
  };

  const handleopeningReadingPChange = (event) => {
    const newValue = event.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      setopeningReadingP(newValue);
    }
  };

  const handleopeningReadingDChange = (event) => {
    const newValue = event.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      setopeningReadingD(newValue);
    }
  };


  function resetform(){
    setname('')
    setDU('')
    setNossleValue('')
    setopeningReadingP('')
    setopeningReadingD('')
  }

  async function fetchnames(){

    try{
      const response = await axios.get('http://127.0.0.1:8000/api/employee/');
      const employeedata = response.data;
      const names = employeedata.map((employee) => {return employee.name});
      setemployeenames(names);
      console.log('names',names)
    }catch(error){
      console.error('Error fetching employee names:', error);
    }
    
  }

  const saveData = async () => {
    
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm:ss');

    const requestData = {
      name: name,
      dispensingUnit:DU,
      nossle: nossleValue,
      openingP: openingReadingP,
      openingD: openingReadingD,
      date: currentDate, 
      time: currentTime,
    };
  
    console.log('Data being sent:', requestData);
  
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/readings/',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Data saved:', response.data);
      resetform();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    fetchnames();
    resetStateAtMidnight();
  },[])
  

    return ( 
        <div className="open-form">
          <div className='price'>
          <TextField
            sx={{ maxWidth: 200 }}
            id="petrol-price"
            label="Petrol Price"
            size="small"
            value={petrol}
            onChange={(e) => {
              const newValue = e.target.value;
              // Use a regular expression to allow only integer numbers
              if (/^\d*\.?\d*$/.test(newValue)) {
                setpetrol(newValue);
              }
            }}
          />
          
          <TextField
            sx={{ maxWidth: 200 }}
            id="diesel-price"
            label="Diesel Price"
            size="small"
            value={diesel}
            onChange={(e) => {
              const newValue = e.target.value;
              // Use a regular expression to allow only integer numbers
              if (/^\d*\.?\d*$/.test(newValue)) {
                setdiesel(newValue);
              }
            }}
          />
          <br />

          <TextField
            sx={{ maxWidth: 200 }}
            id="extrapremium-price"
            label="Extra Premium Price"
            size="small"
            value={extrapriemium}
            onChange={(e) => {
              const newValue = e.target.value;
              // Use a regular expression to allow only integer numbers
              if (/^\d*\.?\d*$/.test(newValue)) {
                setextrapriemium(newValue);
              }
            }}
          />
          
          <TextField
            sx={{ maxWidth: 200 }}
            id="extragreen-price"
            label="Extra Green Price"
            size="small"
            value={extragreen}
            onChange={(e) => {
              const newValue = e.target.value;
              // Use a regular expression to allow only integer numbers
              if (/^\d*\.?\d*$/.test(newValue)) {
                setextragreen(newValue);
              }
            }}
          />
          
          
          
          </div>
            <div className='input-row'>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="demo-simple-select-label">Filler Name</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={name}
                    label="Filler"
                    onChange={handleNameChange}
                  >
                    {employeenames.map((employeename)=>(
                      <MenuItem value={employeename}>{employeename}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{minWidth:160}} >
                  <InputLabel id="demo-simple-select-label">Dispensing Unit</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={DU}
                    label="Dispensing unit"
                    onChange={handleDUchange}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{minWidth:150}} >
                  <InputLabel id="demo-simple-select-label">Nossle</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={nossleValue}
                    label="Nossle"
                    onChange={handleNossleChange}
                  >
                    <MenuItem value={1}>1 & 2</MenuItem>
                    <MenuItem value={2}>3 & 4</MenuItem>
                  </Select>
                </FormControl> 
                <br />                                           
                  <TextField 
                  id="outlined-basic1" 
                  label="Opening reading" 
                  variant="outlined"
                  value={openingReadingP}
                  onChange={handleopeningReadingPChange} 
                  />
                  <TextField 
                  id="outlined-basic2" 
                  label="Opening reading" 
                  variant="outlined"
                  value={openingReadingD}
                  onChange={handleopeningReadingDChange} 
                  /> 
                <button type='submit' onClick={saveData} className='btn2 active-btn'>Add</button>
                  
                   
            </div>

        </div>
     );
}
 
export default Opening;