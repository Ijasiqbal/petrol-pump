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





const Debit = () => {

    const [name, setname] = useState('');
    const [DebitAmount,setDebitAmount] = useState('');
    const [Debitors,setDebitors] = useState([])

    const [ErrorMsg,setErrorMsg] = useState('error updating database. please take note of it and try again later');
    const [showmodal,setShowmodal] = useState(false);
    const [showmodal1,setShowmodal1] = useState(false);
    const [loading,setLoading] = useState(false);

    const {api} = UseReadingcontext();

    async function fetchnames(){

      try{
        const response = await axios.get(api+'/api/creditors/');
        const debitorsdata = response.data;
        const names = debitorsdata.map((debitor) => {return debitor.name});
        setDebitors(names);
        console.log('names',names)
      }catch(error){
        console.error('Error fetching Debitors names:', error);
      }
      
    }
    function validateSave(){
      if (name === '' || DebitAmount === '') {
        setShowmodal1(true);
        setLoading(false);
      }else {
        saveData();
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
                  label="Debit Amount"
                  value={DebitAmount}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Use a regular expression to allow only integer numbers
                    if (/^\d*\.?\d*$/.test(newValue)) {
                      setDebitAmount(newValue);
                    }
                  }}
                />

                <Fab color="error" className='icon' onClick={()=>{setLoading(true);validateSave()}} aria-label="add">
                  <AddIcon />
                </Fab>
            </div>
            <div>
              {showmodal && (<ErrorModal message = {ErrorMsg} onClose = {()=>{setShowmodal(false)}} />)}
              {showmodal1 && (<ErrorModal message = {"Please ensure that you have entered data in all the fields."} onClose = {()=>{setShowmodal1(false)}} />)}

              {loading ? (
                  <div className='loading-overlay'>
                    <ReactLoading type={"spokes"} color={'#000000'} height={'20%'} width={'20%'}/>
                  </div>
                ) : null}  
              
            </div>
        </div>
     );
}
 
export default Debit;