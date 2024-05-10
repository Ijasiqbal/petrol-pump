import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import './Opening.css'
import { useEffect, useState } from 'react';
import { UseReadingcontext } from '../../../Readingcontext.js';
import { format } from 'date-fns';
import ErrorModal from '../../../ErrorModal';
import ReactLoading from 'react-loading';
import axiosInstance from '../../../utils/axiosInstance.js';
import { setPetrol,setDiesel,setExtragreen,setExtrapriemium } from '../../../Redux/PriceSlice.js';
import { useSelector, useDispatch } from 'react-redux'


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
  const [nossleValue, setNossleValue] = useState('');
  const [openingReadingP, setopeningReadingP] = useState('');
  const [openingReadingD, setopeningReadingD] = useState('');
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
  const handleNossleChange = (event) => {
    setNossleValue(event.target.value);
  };
  const handleopeningReadingPChange = (event) => {
    const newValue = event.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      setopeningReadingP(newValue);
    }
  };
  const handleopeningReadingDChange = (event) => {
    const newValue = event.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      setopeningReadingD(newValue);
    }
  };
  function resetform(){
    setname('')
    setDU('')
    setNossleValue('')
    setopeningReadingP('')
    setopeningReadingD('')
  };
  function whatFuel2and4() {
    if (DU === 1 && nossleValue === 1) {
      return 'Diesel opening(D3)';
    }
    if (DU === 1 && nossleValue === 2) {
      return 'Diesel opening(D4)';
    }
    if (DU === 2 && nossleValue === 1) {
      return 'Diesel opening(D6)';
    }
    if (DU === 2 && nossleValue === 2) {
      return 'Diesel opening(D5)';
    }
    if (DU === 3 && nossleValue === 1) {
      return 'petrol opening(P6)';
    }
    if (DU === 3 && nossleValue === 2) {
      return 'petrol opening(P5)';
    }

    if (DU === 4 && nossleValue === 1) {
      return 'Extra Green opening(XD2)';
    }
    if (DU === 4 && nossleValue === 2) {
      return 'Extra Green opening(XD1)';
    }
  };
  function whatFuel1and3() {
    if (DU === 1 && nossleValue === 1) {
      return 'Petrol opening(P2)';
    }
    if (DU===1 && nossleValue === 2){
      return 'Petrol opening(P1)'
    }
    if (DU === 2 && nossleValue === 1) {
      return 'Petrol opening(P4)';
    }
    if (DU === 2 && nossleValue === 2) {
      return 'Petrol opening(P3)';
    }
    if (DU === 3 && nossleValue === 1) {
      return 'Extra Premium opening(XP2)';
    }
    if (DU === 3 && nossleValue === 2) {
      return 'Extra Premium opening(XP1)';
    }
    if (DU === 4 && nossleValue === 1) {
      return 'Petrol opening(P8)';
    }
    if (DU === 4 && nossleValue === 2) {
      return 'Petrol opening(P7)';
    }
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
    if (name === '' || DU === '' || nossleValue === '' || openingReadingP === '' || openingReadingD === '') {
      setLoading(false)
      setShowmodal3(true)
    }
    else {
      saveData();
    }
  }

  const saveData = async () => {
    
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm:ss');

    const requestData = {
      name: name,
      dispensingUnit:DU,
      nossle: nossleValue,
      openingP: openingReadingP,
      openingD: openingReadingD,
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
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{minWidth:150}} >
                  <InputLabel id="demo-simple-select-label">Nossle</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={nossleValue}
                    label="Nossle"
                    onChange={handleNossleChange}
                  >
                    <MenuItem value={1}>1 & 2</MenuItem>
                    <MenuItem value={2}>3 & 4</MenuItem>
                  </Select>
                </FormControl> 
                <br />                                           
                  <TextField 
                  sx={{minWidth:150}}
                  id="outlined-basic1" 
                  label={whatFuel1and3()}  
                  variant="outlined"
                  value={openingReadingP}
                  onChange={handleopeningReadingPChange} 
                  />
                  <TextField 
                  
                  id="outlined-basic2" 
                  label={whatFuel2and4()} 
                  variant="outlined"
                  value={openingReadingD}
                  onChange={handleopeningReadingDChange} 
                  /> 
                <button type='submit' onClick={()=>{
                  setLoading(true)
                  validateSave();
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