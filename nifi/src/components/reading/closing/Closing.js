import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import * as React from 'react';
import './closing.css'
import Detailpage from './Detailpage.js';
import { UseReadingcontext } from '../../../Readingcontext';
import useAxios from '../../../utils/useAxios.js';


const Closing = () => {

let apiCall = useAxios();

const [detailpage,setdetailpage] = useState(false)


const [data,setdata] = useState([]);

const {api} = UseReadingcontext()
const [refreshPage,setrefreshPage] = useState(false);

const[fillername,setfillername] = useState('')
const[fillerid,setfillerid] = useState(null)

const fetchdata = async() => {
    try{
        console.log('Fetching data...');
        const response = await apiCall.get(api+'/api/readings/');
        console.log('Response data:', response.data);
        setdata(response.data);
    }
    catch(error){
        console.error('Error fetching data:', error);
    }

}

useEffect(() => {
    setTimeout(() => {
        
        fetchdata();
    }, 1000);
},[refreshPage]);

    return ( 
        <div className="contents">

            <div className="container">
                {data.map( (item,index) => (
                    (item.received === null) ? (
                        <React.Fragment key={index}>
                            <CssBaseline />
                            <Container maxWidth="sm" sx={{margin:'10px 0',}}>
                              <Box className='box'>
                                <h4 className='nametag'>
                                    {item.name}    
                                </h4>
                                <div>
                                    <h6>{item.nozzle1and2 ? 'Nozzle 1 & 2' : ''}</h6>
                                    <h6>{item.nozzle3and4 ? 'Nozzle 3 & 4' : ''}</h6>
                                </div>
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
            {detailpage && <Detailpage refreshPage={refreshPage} setrefreshPage={setrefreshPage} setdetailpage={setdetailpage} fillername={fillername} fillerid={fillerid} />
            }
            
        </div>
     );
}
 
export default Closing; 