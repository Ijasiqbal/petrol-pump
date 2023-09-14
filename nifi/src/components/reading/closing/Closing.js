import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import * as React from 'react';
import './closing.css'
import Detailpage from './Detailpage.js';
import { UseReadingcontext } from '../../../Readingcontext';


const Closing = () => {

const [detailpage,setdetailpage] = useState(false)

const [close,setclose] = useState('');    

const [data,setdata] = useState([]);

const {refreshPage} = UseReadingcontext()

const[fillername,setfillername] = useState('')
const[fillerid,setfillerid] = useState(null)

const fetchdata = async() => {
    try{
        const response = await axios.get('http://127.0.0.1:8000/api/readings/');
        console.log('Response data:', response.data);
        setdata(response.data);
    }
    catch(error){
        console.error('Error fetching data:', error);
    }

}

useEffect(() => {
    fetchdata();
},[refreshPage]);

    return ( 
        <div className="contents">

            <div className="container">
                {data.map( (item,index) => (
                    (item.closingP === null) ? (
                        <React.Fragment key={index}>
                            <CssBaseline />
                            <Container maxWidth="sm" sx={{margin:'10px 0',}}>
                              <Box className='box'>
                                <h4 className='nametag'>
                                    {item.name}    
                                </h4>                  
                                <button className='btn2'onClick={()=> {
                                    setdetailpage(true);
                                    setfillername(item.name)
                                    setfillerid(item.id)
                                }}>close</button>
                              </Box>
                            </Container>
                        </React.Fragment>
                    ) : null

                ))}
                
            </div>
            {detailpage && <Detailpage setdetailpage={setdetailpage} fillername={fillername} fillerid={fillerid} />
            }
            
        </div>
     );
}
 
export default Closing; 