import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import './detailpage.css'
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import Creditors from "./Creditors";
import axios from "axios";
import { UseReadingcontext } from "../../../Readingcontext";

const Detailpage = ({setdetailpage,fillername,fillerid,}) => {
    let expectedValue = 0;
    let receivedValue = 0;
    let shortage = 0;

    const [closeP,setcloseP] = useState(null); 
    const [closeD,setcloseD] = useState(null);
    const [cash,setcash] = useState(null);
    const [card,setcard] = useState(null); 
    const [paytm,setpaytm] = useState(null);


    const [openP,setopenP] = useState(null);
    const [openD,setopenD] = useState(null);
    const [DU,setDU] = useState(null);

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
    
    return cashValue + cardValue + paytmValue;
    }

    
    
    useEffect(() => {
        fetchdata();
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
                
                <Creditors />
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
                    putdata();
                    setrefreshPage(!refreshPage);
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