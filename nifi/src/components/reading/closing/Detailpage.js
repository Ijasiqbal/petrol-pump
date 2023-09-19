import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import './detailpage.css'
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import Creditors from "./Creditors";
import axios from "axios";
import { UseReadingcontext } from "../../../Readingcontext";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { format } from 'date-fns';



const Detailpage = ({setdetailpage,fillername,fillerid,}) => {
    let expectedValue = 0;
    let receivedValue = 0;
    let shortage = 0;
    let totalcredit = 0;

    const [closeP,setcloseP] = useState(null); 
    const [closeD,setcloseD] = useState(null);
    const [cash,setcash] = useState(null);
    const [card,setcard] = useState(null); 
    const [paytm,setpaytm] = useState(null);


    const [openP,setopenP] = useState(null);
    const [openD,setopenD] = useState(null);
    const [DU,setDU] = useState(null);

    const [Creditors,setCreditors] = useState([])
    const [state, setstate] = useState([]); // Object to store name: amount pairs
    const [count,setcount] = useState(0)



    const addState = () => {
        setcount(count+1)
        setstate([...state,{name:'',creditamount:''}])
      }

    function updateState(index,field,value){
        const updatedstate = [...state]
        updatedstate[index][field] = value;
        setstate(updatedstate);
      } 

    function calcTotalcredit(){
        let sum = 0;
        Array.from({length:count}).map((_,index) => {
            sum = sum+parseFloat(state[index].creditamount)
        })
        return sum;
    }  

    const {refreshPage,
           setrefreshPage,
           petrol,
           diesel,
           extragreen,
           extrapriemium,
    } = UseReadingcontext()

    function putdata(){

        const dataobject = {
            closingP:closeP,
            closingD:closeD,
            cash:cash,
            card:card,
            paytm:paytm,
            credit:parseFloat(totalcredit),
            expected:expectedValue,
            received:receivedValue,
            shortage:shortage,
        }
        const config = {
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
            },
        };
        console.log('Updating record with fillerid', fillerid, 'Data:', dataobject)

        axios.put(`http://127.0.0.1:8000/api/readings/${fillerid}/`, dataobject)
        .then((response) => {
            console.log('database updated',response.data);
            setdetailpage(false);
            
        })
        .catch((error) => {
            console.error('Error updating database:', error);
        })
        }

    function postcredit(){
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        const currentTime = format(new Date(), 'HH:mm:ss');

        for (let index = 0; index < state.length; index++) {
            const dataobject = {
                name: state[index].name,
                credit_amount: state[index].creditamount,
                transaction_date: currentDate,
                transaction_time: currentTime,
            }
            console.log('updating request for credit transaction',dataobject)
            axios
              .post('http://127.0.0.1:8000/api/transactions/', dataobject)
              .then((response) => {
                console.log('Database updated', response.data);
              })
              .catch((error) => {
                console.error('Error updating database:', error);
              });
            }
    }
    

    async function fetchdata(){
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/readings/${fillerid}/`);
            const responseData = response.data;
            setopenP(responseData.openingP);
            setopenD(responseData.openingD);
            setDU(responseData.dispensingUnit);

        } catch (error) {
            console.error('Error fetching data:', error);            
        }
    }

    function expected() {
        if (DU === 1) {
            return (closeP - openP) * petrol + (closeD - openD) * diesel;
        } else if (DU === 2) {
            return (closeP - openP) * petrol + (closeD - openD) * diesel;
        } else if (DU === 3) {
            return (closeP - openP) * petrol + (closeD - openD) * extrapriemium;
        } else if (DU === 4) {
            return (closeP - openP) * diesel + (closeD - openD) * extragreen;
        }
    }

    function received(){
        const cashValue = parseFloat(cash) || 0; // Convert to a float or use 0 if it's not a valid number
        const cardValue = parseFloat(card) || 0;
        const paytmValue = parseFloat(paytm) || 0;
        let totalcredit = parseFloat(calcTotalcredit()) || 0;
    
    return cashValue + cardValue + paytmValue + totalcredit ;
    }

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

    
    
    useEffect(() => {
        fetchdata();
        fetchnames();
    },[])

    
    return ( 

        
        <div className="overlay">
            <div>
                <h2>{fillername}</h2>
                <div>
                    <TextField 
                        id="outlined-basic" 
                        label="Petrol closing" 
                        variant="outlined"
                        value={closeP}
                        size="small"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            if (/^\d*\.?\d*$/.test(newValue)) {
                              setcloseP(newValue);
                            }                            
                        }}
                    />
                    <TextField 
                        id="outlined-basic" 
                        label="Diesel closing" 
                        variant="outlined"
                        value={closeD}
                        size="small"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            if (/^\d*\.?\d*$/.test(newValue)) {
                              setcloseD(newValue);
                            }                            
                        }}
                    />
                </div>
                
                <div className="credit-form">
                    {Array.from({length:count}).map((_,index)=>(
                        <div>
                            <FormControl sx={{ minWidth: 150 }} size='small'>
                              <InputLabel id="demo-simple-select-label">Name</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={state[index].name}
                                label="creditor"
                                onChange={(e)=> {
                                    const selectedName = e.target.value;
                                    updateState(index,'name',selectedName);
                                }}
                              >
                                {Creditors.map((creditor)=>(
                                  <MenuItem value={creditor}>{creditor}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
            
                            <TextField
                              sx={{ maxWidth: 200 }}
                              size='small'
                              id="credit amount"
                              label="Amount"
                              value={state[index].creditamount}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                // Use a regular expression to allow only numeric values (including decimals)
                                if (/^\d*\.?\d*$/.test(newValue)) {
                                  updateState(index,'creditamount',newValue)
                                }
                              }}
                            />
                        </div>
                    ))}
                    <button className='btn1' onClick={()=>{addState()}}>{count===0 ? 'Add Credit' : 'Add another credit' }</button>
                </div>
                
                <div className="inputgrp">
                    <TextField 
                        id="outlined-basic" 
                        label="cash" 
                        variant="outlined"
                        value={cash}
                        size="small"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            if (/^\d*\.?\d*$/.test(newValue)) {
                              setcash(newValue);
                            }                        
                        }}
                    />
                    <TextField 
                        id="outlined-basic"
                        className="inputmiddle" 
                        label="card" 
                        variant="outlined"
                        value={card}
                        size="small"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            if (/^\d*\.?\d*$/.test(newValue)) {
                              setcard(newValue);
                            }                        
                        }}
                    />
                    <TextField 
                        id="outlined-basic" 
                        label="paytm" 
                        variant="outlined"
                        value={paytm}
                        size="small"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            if (/^\d*\.?\d*$/.test(newValue)) {
                              setpaytm(newValue);
                            }                        
                        }}
                    />
                    <div className="calc">
                    <label className="expected">Expected:{expected()}</label>
                    <br />
                    <label className="expected">received: {received()}</label>
                    <br />
                    <label className="expected">shortage: {expected()-received()}</label>

                    </div>
                </div>
                <div className="save1">
                <button className="btn1 active-btn" onClick={()=>{
                    expectedValue=expected();
                    receivedValue=received();
                    shortage=(expected()-received());
                    totalcredit=calcTotalcredit();
                    putdata();
                    setrefreshPage(!refreshPage);
                    postcredit();
                }}>save</button>
            </div>

            </div>
            <div className="closeicon">
                <Fab
                  color="error"
                  aria-label="close"
                  onClick={() => {
                    setdetailpage(false);
                }}
                >
                  <CloseIcon />
                </Fab>
            </div>

        </div>
     );
}
 
export default Detailpage;