import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import './Credit.css';
import axios from 'axios';
import { format } from 'date-fns';





const Credit = () => {

    const [name, setname] = useState('');
    const [creditAmount,setCreditAmount] = useState('');
    const [Creditors,setCreditors] = useState([])

    async function fetchnames(){

      try{
        const response = await axios.get('http://127.0.0.1:8000/api/creditors/');
        const creditorsdata = response.data;
        const names = creditorsdata.map((creditor) => {return creditor.name});
        setCreditors(names);
        console.log('names',names)
      }catch(error){
        console.error('Error fetching creditors names:', error);
      }
      
    }

    const saveData = async () => {
    
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const currentTime = format(new Date(), 'HH:mm:ss');
  
      const requestData = {
        name: name,
        credit_amount: creditAmount,
        transaction_date: currentDate, 
        transaction_time: currentTime,
      };
    
      console.log('Data being sent:', requestData);
    
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/transactions/',
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

    function resetform(){
      setname('');
      setCreditAmount('')
    }

    useEffect(() => {
      fetchnames();
    },[])


    return ( 
        <div className='credit-base'>
            <h2>Credit</h2>
            <div className='credit-form'>
            <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="demo-simple-select-label">Name</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={name}
                    label="Filler"
                    onChange={(e)=> {setname(e.target.value)}}
                  >
                    {Creditors.map((creditor)=>(
                      <MenuItem value={creditor}>{creditor}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  sx={{ maxWidth: 200 }}
                  id="credit amount"
                  label="Amount"
                  value={creditAmount}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Use a regular expression to allow only integer numbers
                    if (/^\d*\.?\d*$/.test(newValue)) {
                      setCreditAmount(newValue);
                    }
                  }}
                />

                <Fab color="error" className='icon' onClick={saveData} aria-label="add">
                  <AddIcon />
                </Fab>
            </div>
        </div>
     );
}
 
export default Credit;