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
import ErrorModal from '../../ErrorModal';
import ReactLoading from 'react-loading';
import { UseReadingcontext } from '../../Readingcontext';





const Credit = () => {

    const [name, setname] = useState('');
    const [creditAmount,setCreditAmount] = useState('');
    const [Creditors,setCreditors] = useState([])

    const [ErrorMsg,setErrorMsg] = useState('error updating database. please take note of it and try again later');
    const [showmodal,setShowmodal] = useState(false);
    const [loading,setLoading] = useState(false)

    const {api} = UseReadingcontext();


    async function fetchnames(){

      try{
        const response = await axios.get(api+'/api/creditors/');
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
          api+'/api/transactions/',
          requestData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
    
        console.log('Data saved:', response.data);
        resetform();
        setLoading(false)
      } catch (error) {
        console.error('Error saving data:', error);
        setShowmodal(true);
        setLoading(false)
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
                  label="Credit Amount"
                  value={creditAmount}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Use a regular expression to allow only integer numbers
                    if (/^\d*\.?\d*$/.test(newValue)) {
                      setCreditAmount(newValue);
                    }
                  }}
                />

                <Fab color="error" className='icon' onClick={()=>{
                  setLoading(true)
                  saveData()
                }} aria-label="add">
                  <AddIcon />
                </Fab>
            </div>
            <div>
              {showmodal && (<ErrorModal message = {ErrorMsg} onClose = {()=>{setShowmodal(false)}} />)}
              {loading ? (
                  <div className='loading-overlay'>
                    <ReactLoading type={"spokes"} color={'#000000'} height={'20%'} width={'20%'}/>
                  </div>
                ) : null}  
              
            </div>
        </div>
     );
}
 
export default Credit;