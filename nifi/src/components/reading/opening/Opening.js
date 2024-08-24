import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import './Opening.css'
import { useEffect, useState } from 'react';
import { UseReadingcontext } from '../../../Readingcontext.js';
import { format, set } from 'date-fns';
import ErrorModal from '../../../ErrorModal';
import ReactLoading from 'react-loading';
import axiosInstance from '../../../utils/axiosInstance.js';
import { setPetrol,setDiesel,setExtragreen,setExtrapriemium } from '../../../Redux/PriceSlice.js';
import { useSelector, useDispatch } from 'react-redux'
import { Checkbox, FormControlLabel } from '@mui/material';


const Opening = () => {

  const dispatch = useDispatch();
  const petrol = useSelector((state) => state.price.petrol);
  const diesel = useSelector((state) => state.price.diesel);
  const extragreen = useSelector((state) => state.price.extragreen);
  const extrapriemium = useSelector((state) => state.price.extrapriemium);

  const {
    api
  } = UseReadingcontext();

  const [name, setname] = useState('');
  const [DU,setDU] = useState('')
  const [nozzle1and2,setnozzle1and2] = useState(false);
  const [nozzle3and4,setnozzle3and4] = useState(false);
  const [openingNozzle1, setopeningNozzle1] = useState('');
  const [openingNozzle2, setopeningNozzle2] = useState('');
  const [openingNozzle3, setopeningNozzle3] = useState('');
  const [openingNozzle4, setopeningNozzle4] = useState('');
  const [employeenames,setemployeenames] = useState([]);

  const [showmodal,setShowmodal] = useState(false);
  const [showmodal2,setShowmodal2] = useState(false);
  const [showmodal3,setShowmodal3] = useState(false);
  const [loading,setLoading] = useState(false);
  const [componentKey, setComponentKey] = useState(1);

  const fetchPrices = async () => {
  
    try {
      const response = await axiosInstance.get('/api/prices/1/');
      
      const priceData = response.data;
  
      const { petrol, diesel, extragreen, extrapremium } = priceData;
  
      // Update state variables with the fetched prices
      dispatch(setPetrol(petrol));
      dispatch(setDiesel(diesel));
      dispatch(setExtragreen(extragreen));
      dispatch(setExtrapriemium(extrapremium));
  
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const savePrices = async () => {
    setLoading(true);
  
    const requestData = {
      petrol: petrol,
      diesel: diesel,
      extragreen: extragreen,
      extrapremium: extrapriemium,
    };
  
    console.log('Prices being sent:', requestData);
  
    try {
      const response = await axiosInstance.post(
        '/api/prices/',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Prices saved:', response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error saving prices:', error);
      setLoading(false);
      setShowmodal2(true);
    }
  };
  

  const handleNameChange = (event) => {
    setname(event.target.value);
  };

  const handleDUchange = (event) => {
    setDU(event.target.value);
  };



  function resetform(){
    setname('')
    setDU('')
    setnozzle1and2(false)
    setnozzle3and4(false)
    setopeningNozzle1('')
    setopeningNozzle2('')
    setopeningNozzle3('')
    setopeningNozzle4('')
  };

  async function fetchnames(){
    try{
      const response = await axiosInstance.get(api+'/api/employee/');
      const employeedata = response.data;
      const names = employeedata.map((employee) => {return employee.name});
      setemployeenames(names);
      console.log('names',names)
    }catch(error){
      console.error('Error fetching employee names:', error);
    }
    
  };
  function validateSave(){
    if (name === '' || DU === '' || nozzle1and2 && (openingNozzle1 === '' || openingNozzle2 === '')|| nozzle3and4 && (openingNozzle3 === '' || openingNozzle4 === '')) {
      setLoading(false)
      setShowmodal3(true)
    }
    else {
      saveData();
    }
  }

  const whatFuel1 = () => {
    if (DU === 1) {
      return 'Petrol Opening (P2) ';
    } else if (DU === 2) {
      return 'Petrol Opening (P4) ';
    } else if (DU === 3) {
      return 'Extra Premium Opening (XP2)';
    } else if (DU === 4) {
      return 'Petrol Opening (P8)';
    }
  }
  const whatFuel2 = () => {
    if (DU === 1) {
      return 'Diesel Opening (D3) ';
    } else if (DU === 2) {
      return 'Diesel Opening (D6) ';
    } else if (DU === 3) {
      return 'Extra Premium Opening (P6)';
    } else if (DU === 4) {
      return 'Petrol Opening (XD2)';
    }
  }
  const whatFuel3 = () => {
    if (DU === 1) {
      return 'Petrol Opening (P1) ';
    } else if (DU === 2) {
      return 'Petrol Opening (P3) ';
    } else if (DU === 3) {
      return 'Extra Premium Opening (XP1)';
    } else if (DU === 4) {
      return 'Petrol Opening (P7)';
    }
  }
  const whatFuel4 = () => {
    if (DU === 1) {
      return 'Diesel Opening (D4)';
    } else if (DU === 2) {
      return 'Diesel Opening (D5)';
    } else if (DU === 3) {
      return 'Petrol Opening (P5)';
    } else if (DU === 4) {
      return 'Extra Green Opening (XD1)';
    }
  }

  const saveData = async () => {
    
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm:ss');

    const requestData = {
      name: name,
      dispensingUnit:DU,
      nozzle1and2: nozzle1and2,
      nozzle3and4: nozzle3and4,
      openingNozzle1: parseFloat(openingNozzle1) || null, 
      openingNozzle2: parseFloat(openingNozzle2) || null, 
      openingNozzle3: parseFloat(openingNozzle3) || null, 
      openingNozzle4: parseFloat(openingNozzle4) || null,
      date: currentDate, 
      time: currentTime,
    };
  
    console.log('Data being sent:', requestData);
  
    try {
      const response = await axiosInstance.post(
        api+'/api/readings/',
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
      setLoading(false);
      setShowmodal(true)
    }
  };

  useEffect(() => {
    fetchnames();
  },[componentKey])
  

    return ( 
        <div className="open-form">
          <div className='price' key={componentKey}>
          <TextField
            sx={{ maxWidth: 200 }}
            id="petrol-price"
            label="Petrol Price"
            size="small"
            value={petrol}
            onChange={(e) => {
              const newValue = e.target.value;
              // Use a regular expression to allow only integer numbers
              if (/^\d*\.?\d{0,8}$/.test(newValue)) {
                dispatch(setPetrol(newValue));
              }
            }}
          />
          
          <TextField
            sx={{ maxWidth: 200 }}
            id="diesel-price"
            label="Diesel Price"
            size="small"
            value={diesel}
            onChange={(e) => {
              const newValue = e.target.value;
              // Use a regular expression to allow only integer numbers
              if (/^\d*\.?\d{0,8}$/.test(newValue)) {
                dispatch(setDiesel(newValue));
              }
            }}
          />
          <br />

          <TextField
            sx={{ maxWidth: 200 }}
            id="extrapremium-price"
            label="Extra Premium Price"
            size="small"
            value={extrapriemium}
            onChange={(e) => {
              const newValue = e.target.value;
              // Use a regular expression to allow only integer numbers
              if (/^\d*\.?\d*$/.test(newValue)) {
                dispatch(setExtrapriemium(newValue));
              }
            }}
          />
          
          <TextField
            sx={{ maxWidth: 200 }}
            id="extragreen-price"
            label="Extra Green Price"
            size="small"
            value={extragreen}
            onChange={(e) => {
              const newValue = e.target.value;
              // Use a regular expression to allow only integer numbers
              if (/^\d*\.?\d*$/.test(newValue)) {
                dispatch(setExtragreen(newValue));
              }
            }}
          />
          <button type='submit' onClick={()=>{
            savePrices();
          }} className='btn2 active-btn'>save</button>

          <button type='submit' onClick={()=>{
            fetchPrices()
            setComponentKey((prevKey) => prevKey + 1);
          }} className='btn2 active-btn'>Prev</button>
          
          
          +
          </div>
            <div className='input-row'>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="demo-simple-select-label">Filler Name</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={name}
                    label="Filler"
                    onChange={handleNameChange}
                    required
                  >
                    {employeenames.map((employeename)=>(
                      <MenuItem value={employeename}>{employeename}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{minWidth:160}} >
                  <InputLabel id="demo-simple-select-label">Dispensing Unit</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={DU}
                    label="Dispensing unit"
                    onChange={handleDUchange}
                    required
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{minWidth:150, ml: 2 }} >
                  <FormControlLabel sx={{height: 30}}
                    control={<Checkbox 
                      checked={nozzle1and2}
                      onChange={(e) => setnozzle1and2(e.target.checked)}
                    />}
                    label="Nozzle1&2"
                    value={nozzle1and2}
                  />
                  <FormControlLabel sx={{height: 30}}
                    control={<Checkbox 
                      checked={nozzle3and4}
                      onChange={(e) => setnozzle3and4(e.target.checked)}
                    />}
                    label="Nozzle3&4"
                  
                  />
                </FormControl> 
                <br />  
                { nozzle1and2 ? (
                  <> 
                  <TextField 
                  sx={{minWidth:300}}
                  id="outlined-basic1" 
                  label={whatFuel1()} 
                  type='number' 
                  variant="outlined"
                  value={openingNozzle1}
                  onChange={(e)=>{setopeningNozzle1(e.target.value)}} 
                  inputProps={{ step: "0.01" }}
                  required
                  />
                  <TextField 
                  sx={{minWidth:300}}
                  id="outlined-basic2" 
                  label={whatFuel2()} 
                  type='number'
                  variant="outlined"
                  value={openingNozzle2}
                  onChange={(e)=>{setopeningNozzle2(e.target.value)}} 
                  inputProps={{ step: "0.01" }}
                  required
                  />                  
                  </>
                ) : null }   
                { nozzle3and4 ? (
                  <> 
                  <TextField 
                  sx={{minWidth:300}}
                  id="outlined-basic3" 
                  label={whatFuel3()} 
                  type='number' 
                  variant="outlined"
                  value={openingNozzle3}
                  onChange={(e)=>{setopeningNozzle3(e.target.value)}} 
                  inputProps={{ step: "0.01" }}
                  required
                  />
                  <TextField 
                  sx={{minWidth:300}}
                  id="outlined-basic4" 
                  label={whatFuel4()} 
                  type='number'
                  variant="outlined"
                  value={openingNozzle4}
                  onChange={(e)=>{setopeningNozzle4(e.target.value)}} 
                  inputProps={{ step: "0.01" }}
                  required
                  />                  
                  </>
                ) : null }
                   
                <button type='submit' onClick={()=>{
                  setLoading(true)
                  validateSave()
                }} className='btn2 active-btn'>Add</button>
                <div>
                  {showmodal && (<ErrorModal message = {"Record not created. Please check all fields and check whether server is down"} onClose = {()=>{setShowmodal(false)}} />)}
                  {showmodal2 && (<ErrorModal message = {"Fuel prices are not updated to the database"} onClose = {()=>{setShowmodal2(false)}} />)}
                  {showmodal3 && (<ErrorModal message = {"Please ensure that u have entered data in all the feilds"} onClose = {()=>{setShowmodal3(false)}} />)}

                  {loading ? (
                      <div className='loading-overlay'>
                        <ReactLoading type={"spokes"} color={'#000000'} height={'20%'} width={'20%'}/>
                      </div>
                    ) : null}  
                  
                </div>
                
                  
                   
            </div>
            

        </div>
     );
}
 
export default Opening;