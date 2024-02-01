import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setPetrol, setDiesel, setExtrapriemium, setExtragreen } from "../../Redux/PriceSlice";
import TextField from "@mui/material/TextField";
import './Price.css';
import ReactLoading from 'react-loading';
import useAxios from "../../utils/useAxios";


const Price = () => {

    let apiCall = useAxios();

    const [loading, setLoading] = useState(false);
    const [showmodal2, setShowmodal2] = useState(false);
    const [componentKey, setComponentKey] = useState(1);

    const petrol = useSelector((state) => state.price.petrol);
    const diesel = useSelector((state) => state.price.diesel);
    const extragreen = useSelector((state) => state.price.extragreen);
    const extrapriemium = useSelector((state)=> state.price.extrapriemium);


    const dispatch = useDispatch();

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
          const response = await apiCall.put(
            '/api/prices/1/',
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

      const fetchPrices = async () => {
  
        try {
          const response = await apiCall.get('/api/prices/1/');
          
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
        

    return ( 
        <div className="base">
            <div className='price additional' key={componentKey}>
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
            <div>
                    {loading ? (
                      <div className='loading-overlay'>
                        <ReactLoading type={"spokes"} color={'#000000'} height={'20%'} width={'20%'}/>
                      </div>
                    ) : null} 
            </div>
        </div>
     );
}
 
export default Price;