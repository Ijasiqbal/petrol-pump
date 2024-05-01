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
import { format, set } from 'date-fns';
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

    const [closeP,setcloseP] = useState(null); 
    const [closeD,setcloseD] = useState(null);
    const [cash,setcash] = useState(null);
    const [card,setcard] = useState(null); 
    const [paytm,setpaytm] = useState(null);
    const [oil,setOil] = useState(null)
    const [testP,setTestP] = useState(null);
    const [testD,setTestD] = useState(null);


    const [openP,setopenP] = useState(null);
    const [openD,setopenD] = useState(null);
    const [DU,setDU] = useState(null);

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
            closingP:closeP,
            closingD:closeD,
            cash:cash,
            card:card,
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
      if (closeP === null || closeD === null || cash === null || card === null || paytm === null) {
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
            setopenP(responseData.openingP);
            setopenD(responseData.openingD);
            setDU(responseData.dispensingUnit);

        } catch (error) {
            console.error('Error fetching data:', error);            
        }
    }

    function expected() {
      let fuelSale = 0;
        if (DU === 1) {
          fuelSale=(closeP - openP -(checkTest ? testP:0)) * petrol + (closeD - openD  -(checkTest ? testD:0)) * diesel 
        } else if (DU === 2) {
          fuelSale=(closeP - openP) * petrol + (closeD - openD) * diesel
       } else if (DU === 3) {
          fuelSale=(closeP - openP) * petrol + (closeD - openD) * diesel
        } else if (DU === 4) {
          fuelSale=(closeP - openP) * petrol + (closeD - openD) * diesel
        }
        if (oil!== null) {
          return fuelSale + parseFloat(oil);
        }else return fuelSale;
    }

    function received(){
        const cashValue = parseFloat(cash) || 0; // Convert to a float or use 0 if it's not a valid number
        const cardValue = parseFloat(card) || 0;
        const paytmValue = parseFloat(paytm) || 0;
        let totalcredit = parseFloat(calcTotalcredit()) || 0;
    
    return cashValue + cardValue + paytmValue + totalcredit;
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
                    <TextField 
                        id="outlined-basic" 
                        label="Petrol closing" 
                        variant="outlined"
                        value={closeP}
                        size="small"
                        type="number"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            setcloseP(newValue);                           
                        }}
                    />
                    <TextField 
                        id="outlined-basic" 
                        label={DU === 1 || DU === 2 ? "Diesel closing" :DU === 3 ? "Extra Premium closing":DU === 4 ? "Extra green closing":""} 
                        variant="outlined"
                        value={closeD}
                        size="small"
                        type="number"
                        onChange={(e)=>{
                            const newValue = e.target.value;
                            setcloseD(newValue);                            
                        }}
                    />
                    <TextField 
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
                      <TextField 
                      {...(!checkTest ? {disabled: true} : {}) }
                      label="Petrol Test"
                      size="small"
                      type="number"
                      sx={{ maxWidth: 180 }}
                      value={testP}
                      onChange={(e)=>{
                        setTestP(e.target.value);
                      }}
                      />
                      <TextField
                      {...(!checkTest ? {disabled: true} : {}) }
                      label={DU === 1 || DU === 2 ? "Diesel test" :DU === 3 ? "Extra Premium test":DU === 4 ? "Extra green test":""}
                      size="small"
                      type="number"
                      value={testD}
                      onChange={(e)=>{
                        setTestD(e.target.value);
                      }}
                      />
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
                    <label className="expected">shortage: {expected()-received()}</label>

                    </div>
                </div>
                <div className="save1">
                <button className="btn1 active-btn" onClick={()=>{
                    expectedValue=expected();
                    receivedValue=received();
                    shortage=(expected()-received());
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