import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import './detailpage.css'
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import { UseReadingcontext } from "../../../Readingcontext";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { format } from 'date-fns';
import ErrorModal from '../../../ErrorModal';
import { useSelector } from "react-redux";
import useAxios from "../../../utils/useAxios";
import { Checkbox } from "@mui/material";



const Detailpage = ({setdetailpage,fillername,fillerid,refreshPage,setrefreshPage}) => {
    let expectedValue = 0;
    let receivedValue = 0;
    let shortage = 0;
    let totalcredit = 0;

    let apiCall = useAxios();

    const [clossingNozzle1,setclossingNozzle1] = useState(null);
    const [clossingNozzle2,setclossingNozzle2] = useState(null);
    const [clossingNozzle3,setclossingNozzle3] = useState(null);
    const [clossingNozzle4,setclossingNozzle4] = useState(null);
    const [cash,setcash] = useState(null);
    const [card,setcard] = useState(null); 
    const [paytm,setpaytm] = useState(null);
    const [oil,setOil] = useState(null)
    const [testNozzle1,setTestNozzle1] = useState(null);
    const [testNozzle2,setTestNozzle2] = useState(null);
    const [testNozzle3,setTestNozzle3] = useState(null);
    const [testNozzle4,setTestNozzle4] = useState(null);


    const [DU,setDU] = useState(null);
    const [data,setData] = useState([]);

    const [Creditors,setCreditors] = useState([])
    const [state, setstate] = useState([]); // Object to store name: amount pairs
    const [count,setcount] = useState(0);

    const [checkTest,setcheckTest] = useState(false);
    const [showmodal,setshowmodal] = useState(false);
    const [showmodal1,setshowmodal1] = useState(false);


    function checkprices(){
      if (!petrol || !diesel || !extragreen || !extrapriemium) {
        setshowmodal(true)
      }
    }
    



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

    const {api
    } = UseReadingcontext();

    const petrol = useSelector((state) => state.price.petrol);
    const diesel = useSelector((state) => state.price.diesel);
    const extragreen = useSelector((state) => state.price.extragreen);
    const extrapriemium = useSelector((state) => state.price.extrapriemium);

    function putdata(){

        const dataobject = {
            cash:cash,
            card:card,
            closingNozzle1:parseFloat(clossingNozzle1),
            closingNozzle2:parseFloat(clossingNozzle2),
            closingNozzle3:parseFloat(clossingNozzle3),
            closingNozzle4:parseFloat(clossingNozzle4),
            paytm:paytm,
            oil:oil,
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

        apiCall.put(api+`/api/readings/${fillerid}/`, dataobject)
        .then((response) => {
            console.log('database updated',response.data);
            let refresh = !refreshPage
            setrefreshPage(refresh)
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
            apiCall
              .post(api+'/api/transactions/', dataobject)
              .then((response) => {
                console.log('Database updated', response.data);
                let refresh = !refreshPage
                setrefreshPage(refresh)
              })
              .catch((error) => {
                console.error('Error updating database:', error);
              });
            }
    }
    function validateSave(){
      if (clossingNozzle1 === null && clossingNozzle2 === null && clossingNozzle3 === null && clossingNozzle4 === null) {
        setshowmodal1(true)
      } else {
        putdata();
        postcredit();
        setrefreshPage(!refreshPage);

      }
    }
    

    async function fetchdata(){
        try {
            const response = await apiCall.get(api+`/api/readings/${fillerid}/`);
            const responseData = response.data;
            setData(responseData);
            setDU(responseData.dispensingUnit);


        } catch (error) {
            console.error('Error fetching data:', error);            
        }
    }


    const expected = () => {
      let fuelSale = 0;
      if (DU === 1 && data.nozzle1and2 && !data.nozzle3and4) {
        fuelSale = (clossingNozzle1 - data.openingNozzle1 - (checkTest ? testNozzle1 : 0)) * petrol + (clossingNozzle2 - data.openingNozzle2 - (checkTest ? testNozzle2 : 0)) * diesel;
      }
      if (DU === 1 && data.nozzle3and4 && !data.nozzle1and2) {
        fuelSale = (clossingNozzle3 - data.openingNozzle3 - (checkTest ? testNozzle3 : 0)) * petrol + (clossingNozzle4 - data.openingNozzle4 - (checkTest ? testNozzle4 : 0)) * diesel;
      }
      if (DU === 1 && data.nozzle1and2 && data.nozzle3and4) {
        fuelSale = (clossingNozzle1 - data.openingNozzle1 - (checkTest ? testNozzle1 : 0)) * petrol + (clossingNozzle2 - data.openingNozzle2 - (checkTest ? testNozzle2 : 0)) * diesel + (clossingNozzle3 - data.openingNozzle3 - (checkTest ? testNozzle3 : 0)) * petrol + (clossingNozzle4 - data.openingNozzle4 - (checkTest ? testNozzle4 : 0)) * diesel;
      }
      if (DU === 2 && data.nozzle1and2 && !data.nozzle3and4) {
        fuelSale = (clossingNozzle1 - data.openingNozzle1 - (checkTest ? testNozzle1 : 0)) * petrol + (clossingNozzle2 - data.openingNozzle2 - (checkTest ? testNozzle2 : 0)) * diesel;
      }
      if (DU === 2 && data.nozzle3and4 && !data.nozzle1and2) {
        fuelSale = (clossingNozzle3 - data.openingNozzle3 - (checkTest ? testNozzle3 : 0)) * petrol + (clossingNozzle4 - data.openingNozzle4 - (checkTest ? testNozzle4 : 0)) * diesel;
      }
      if (DU === 2 && data.nozzle1and2 && data.nozzle3and4) {
        fuelSale = (clossingNozzle1 - data.openingNozzle1 - (checkTest ? testNozzle1 : 0)) * petrol + (clossingNozzle2 - data.openingNozzle2 - (checkTest ? testNozzle2 : 0)) * diesel + (clossingNozzle3 - data.openingNozzle3 - (checkTest ? testNozzle3 : 0)) * petrol + (clossingNozzle4 - data.openingNozzle4 - (checkTest ? testNozzle4 : 0)) * diesel;
      }
      if (DU === 3 && data.nozzle1and2 && !data.nozzle3and4) {
        fuelSale = (clossingNozzle1 - data.openingNozzle1 - (checkTest ? testNozzle1 : 0)) * extrapriemium + (clossingNozzle2 - data.openingNozzle2 - (checkTest ? testNozzle2 : 0)) * petrol;
      }
      if (DU === 3 && data.nozzle3and4 && !data.nozzle1and2) {
        fuelSale = (clossingNozzle3 - data.openingNozzle3 - (checkTest ? testNozzle3 : 0)) * extrapriemium + (clossingNozzle4 - data.openingNozzle4 - (checkTest ? testNozzle4 : 0)) * petrol;
      }
      if (DU === 3 && data.nozzle1and2 && data.nozzle3and4) {
        fuelSale = (clossingNozzle1 - data.openingNozzle1 - (checkTest ? testNozzle1 : 0)) * extrapriemium + (clossingNozzle2 - data.openingNozzle2 - (checkTest ? testNozzle2 : 0)) * petrol + (clossingNozzle3 - data.openingNozzle3 - (checkTest ? testNozzle3 : 0)) * extrapriemium + (clossingNozzle4 - data.openingNozzle4 - (checkTest ? testNozzle4 : 0)) * petrol;
      }
      if (DU === 4 && data.nozzle1and2 && !data.nozzle3and4) {
        fuelSale = (clossingNozzle1 - data.openingNozzle1 - (checkTest ? testNozzle1 : 0)) * petrol + (clossingNozzle2 - data.openingNozzle2 - (checkTest ? testNozzle2 : 0)) * extragreen;
      }
      if (DU === 4 && data.nozzle3and4 && !data.nozzle1and2) {
        fuelSale = (clossingNozzle3 - data.openingNozzle3 - (checkTest ? testNozzle3 : 0)) * petrol + (clossingNozzle4 - data.openingNozzle4 - (checkTest ? testNozzle4 : 0)) * extragreen;
      }
      if (DU === 4 && data.nozzle1and2 && data.nozzle3and4) {
        fuelSale = (clossingNozzle1 - data.openingNozzle1 - (checkTest ? testNozzle1 : 0)) * petrol + (clossingNozzle2 - data.openingNozzle2 - (checkTest ? testNozzle2 : 0)) * extragreen + (clossingNozzle3 - data.openingNozzle3 - (checkTest ? testNozzle3 : 0)) * petrol + (clossingNozzle4 - data.openingNozzle4 - (checkTest ? testNozzle4 : 0)) * extragreen;
      }
      if (oil !== null) {
        return (fuelSale + parseFloat(oil)).toFixed(2);
      }
      else return fuelSale.toFixed(2);
    }


    function received(){
        const cashValue = parseFloat(cash) || 0; // Convert to a float or use 0 if it's not a valid number
        const cardValue = parseFloat(card) || 0;
        const paytmValue = parseFloat(paytm) || 0;
        let totalcredit = parseFloat(calcTotalcredit()) || 0;
    
    return (cashValue + cardValue + paytmValue + totalcredit).toFixed(2);
    }

    async function fetchnames(){

        try{
          const response = await apiCall.get(api+'/api/creditors/');
          const creditorsdata = response.data;
          const names = creditorsdata.map((creditor) => {return creditor.name});
          setCreditors(names);
          console.log('names',names)
        }catch(error){
          console.error('Error fetching creditors names:', error);
        }
        
      }
      const whatFuel1 = () => {
        if (DU === 1) {
          return 'Petrol Closing (P2) ';
        } else if (DU === 2) {
          return 'Petrol Closing (P4) ';
        } else if (DU === 3) {
          return 'Extra Premium Closing (XP2)';
        } else if (DU === 4) {
          return 'Petrol Closing (P8)';
        }
      }
      const whatFuel2 = () => {
        if (DU === 1) {
          return 'Diesel Closing (D3) ';
        } else if (DU === 2) {
          return 'Diesel Closing (D6) ';
        } else if (DU === 3) {
          return 'Extra Premium Closing (P6)';
        } else if (DU === 4) {
          return 'Petrol Closing (XD2)';
        }
      }
      const whatFuel3 = () => {
        if (DU === 1) {
          return 'Petrol Closing (P1) ';
        } else if (DU === 2) {
          return 'Petrol Closing (P3) ';
        } else if (DU === 3) {
          return 'Extra Premium Closing (XP1)';
        } else if (DU === 4) {
          return 'Petrol Closing (P7)';
        }
      }
      const whatFuel4 = () => {
        if (DU === 1) {
          return 'Diesel Closing (D4)';
        } else if (DU === 2) {
          return 'Diesel Closing (D5)';
        } else if (DU === 3) {
          return 'Petrol Closing (P5)';
        } else if (DU === 4) {
          return 'Extra Green Closing (XD1)';
        }
      }
        
    useEffect(() => {
        fetchdata();
        fetchnames();
        checkprices();
    },[petrol, diesel, extragreen, extrapriemium])

    
    return ( 
        <div className="overlay">
            <div>
                <h2>{fillername}</h2>
                <div>
                    {data.nozzle1and2 && <div>
                      <TextField 
                        sx={{ minWidth: 250 }}
                        id="outlined-basic" 
                        label={whatFuel1()} 
                        variant="outlined"
                        value={clossingNozzle1}
                        size="small"
                        type="number"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            setclossingNozzle1(newValue);                          
                        }}
                    />
                    <TextField 
                        sx={{ minWidth: 250 }}
                        id="outlined-basic" 
                        label={whatFuel2()} 
                        variant="outlined"
                        value={clossingNozzle2}
                        size="small"
                        type="number"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            setclossingNozzle2(newValue);                          
                        }}
                    />
                      
                      </div>}
                    {data.nozzle3and4 && <div>
                        <TextField 
                            sx={{ minWidth: 250 }}
                            id="outlined-basic" 
                            label={whatFuel3()} 
                            variant="outlined"
                            value={clossingNozzle3}
                            size="small"
                            type="number"
                            onChange={(e)=>{
                                const newValue = e.target.value;
                                setclossingNozzle3(newValue);                          
                            }}
                        />
                        <TextField 
                            sx={{ minWidth: 250 }}
                            id="outlined-basic" 
                            label={whatFuel4()} 
                            variant="outlined"
                            value={clossingNozzle4}
                            size="small"
                            type="number"
                            onChange={(e)=>{
                                const newValue = e.target.value;
                                setclossingNozzle4(newValue);                          
                            }}
                        />
                      </div>}
                    <TextField 
                        sx={{ minWidth: 250 }}
                        id="outlined-basic" 
                        label="Oil Sales(Rs)" 
                        variant="outlined"
                        value={oil}
                        size="small"
                        type="number"
                        onChange={(e)=>{
                            setOil(e.target.value);                        
                        }}
                        
                    />
                    <div>
                      <Checkbox 
                      value={checkTest}
                      onChange={(e)=>{
                        setcheckTest(e.target.checked);
                      }}
                      />
                      {
                        data.nozzle1and2 && <div>
                          <TextField 
                          
                          {...(!checkTest ? {disabled: true} : {}) }
                          label={whatFuel1() ? whatFuel1().replace('Closing', 'test') : ''}
                          size="small"
                          type="number"
                          sx={{ minWidth: 250 }}
                          value={testNozzle1}
                          onChange={(e)=>{
                            setTestNozzle1(e.target.value);
                          }}
                          />
                          <TextField
                          sx={{ minWidth: 250 }}
                          {...(!checkTest ? {disabled: true} : {}) }
                          label={whatFuel2() ? whatFuel2().replace('Closing', 'test') : ''}
                          size="small"
                          type="number"
                          value={testNozzle2}
                          onChange={(e)=>{
                            setTestNozzle2(e.target.value);
                          }}
                          />
                        </div>
                      }
                      {
                        data.nozzle3and4 && <div>
                          <TextField 
                          sx={{ minWidth: 250 }}
                          {...(!checkTest ? {disabled: true} : {}) }
                          label={whatFuel3() ? whatFuel3().replace('Closing', 'test') : ''}
                          size="small"
                          type="number"
                          value={testNozzle3}
                          onChange={(e)=>{
                            setTestNozzle3(e.target.value);
                          }}
                          />
                          <TextField
                          sx={{ minWidth: 250 }}
                          {...(!checkTest ? {disabled: true} : {}) }
                          label={whatFuel4() ? whatFuel4().replace('Closing', 'test') : ''}
                          size="small"
                          type="number"
                          value={testNozzle4}
                          onChange={(e)=>{
                            setTestNozzle4(e.target.value);
                          }}
                          />
                        </div>
                      }
                    </div>
                </div>
                
                <div className="credit-form">
                    {Array.from({length:count}).map((_,index)=>(
                        <div>
                            <FormControl sx={{ minWidth: 150 }} size='small'>
                              <InputLabel id="demo-simple-select-lab">Name</InputLabel>
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
                    <label className="expected">shortage: {(expected() - received()).toFixed(2)}</label>

                    </div>
                </div>
                <div className="save1">
                <button className="btn1 active-btn" onClick={()=>{
                    expectedValue=expected();
                    receivedValue=received();
                    shortage=(expected()-received()).toFixed(2);
                    totalcredit=calcTotalcredit();
                    validateSave();
                }}>save</button>
            </div>

            </div>
            <div className="closeicon">
                <Fab
                  color="error"
                  aria-label="close"
                  onClick={() => {
                    setrefreshPage(!refreshPage);
                    setdetailpage(false);
                }}
                >
                  <CloseIcon />
                </Fab>
            </div>
            <div>
                {showmodal && (<ErrorModal message = {'Fuel prices is empty. Please enter the fuel prices'} onClose = {()=>{setshowmodal(false)}} />)}   
                {showmodal1 && (<ErrorModal message = {'Please ensure that you have entered data in all the fields'} onClose = {()=>{setshowmodal1(false)}} />)}   

            </div>

        </div>
     );
}
export default Detailpage;