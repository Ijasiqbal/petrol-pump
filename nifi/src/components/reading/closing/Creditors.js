import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import './creditors.css'
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { UseReadingcontext } from '../../../Readingcontext';




const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};




const Creditors = () => {

    const [personName, setPersonName] = useState([]);
    const [Names,setNames] = useState([]);

    const {api} = UseReadingcontext();

    async function fetchnames(){

      try{
        const response = await axios.get(api+'/api/creditors/');
        const creditorsdata = response.data;
        const names = creditorsdata.map((creditor) => {return creditor.name});
        setNames(names);
        console.log('names',names)
      }catch(error){
        console.error('Error fetching creditors names:', error);
      }
      
    }

    useEffect(() => {
      fetchnames();
    },[])

    //the below code is to dynamically assign name variables to each name selected
    const initialStates = {}; // Initialize an object to store state variables

    personName.forEach((personname) => {
      initialStates[personname] = ''; // Create a property for each personname
    });
    
    const [states, setStates] = React.useState(initialStates);
    
    const handleInputChange = (event, personname) => {
      const { value } = event.target;
    
      // Regular expression for numeric validation (allowing decimals)
      const numericRegex = /^[0-9]*(\.[0-9]*)?$/;
    
      // Check if the input value is a valid number (including decimals)
      if (numericRegex.test(value)) {
        setStates((prevState) => ({
          ...prevState,
          [personname]: value,
        }));
      }
    };   
    const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    //Till here


    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

      
    return ( 

        <div className="row">
            <div className='label'> 
                <label>Creditors:</label>
            </div>
            <div>
                <FormControl sx={{ m: 1, width: 200 }}>
                  <InputLabel id="demo-multiple-checkbox-label" sx={{m:-1}}>Name</InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={personName}
                    size='small'
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {Names.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={personName.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </div>
            {personName.map((personname) => (
                <div>
                    <TextField 
                        id="outlined-basic" 
                        label={`Amount for ${personname}`}
                        variant="outlined"
                        value={states[personname]}
                        size="small"
                        onChange={(e) => handleInputChange(e, personname)}
                    />
                </div>
            ))}
            <br />
        </div>
     );
}
 
export default Creditors;