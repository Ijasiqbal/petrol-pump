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





const Debit = () => {

    const [name, setname] = useState('');
    const [DebitAmount,setDebitAmount] = useState('');
    const [Debitors,setDebitors] = useState([])

    async function fetchnames(){

      try{
        const response = await axios.get('http://127.0.0.1:8000/api/creditors/');
        const debitorsdata = response.data;
        const names = debitorsdata.map((debitor) => {return debitor.name});
        setDebitors(names);
        console.log('names',names)
      }catch(error){
        console.error('Error fetching Debitors names:', error);
      }
      
    }

    const saveData = async () => {
    
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const currentTime = format(new Date(), 'HH:mm:ss');
  
      const requestData = {
        name: name,
        debit_amount: DebitAmount,
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
      setDebitAmount('')
    }

    useEffect(() => {
      fetchnames();
    },[])


    return ( 
        <div className='credit-base'>
            <h2>Debit</h2>
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
                    {Debitors.map((debitor)=>(
                      <MenuItem value={debitor}>{debitor}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  sx={{ maxWidth: 200 }}
                  id="credit amount"
                  label="Amount"
                  value={DebitAmount}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Use a regular expression to allow only integer numbers
                    if (/^\d*\.?\d*$/.test(newValue)) {
                      setDebitAmount(newValue);
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
 
export default Debit;