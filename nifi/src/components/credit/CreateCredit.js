import { useState } from "react";
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import './CreateCredit.css';
import ErrorModal from '../../ErrorModal';
import ReactLoading from 'react-loading';
import { UseReadingcontext } from "../../Readingcontext";
import useAxios from "../../utils/useAxios";



const CreateCredit = () => {

    let apiCall = useAxios();
    
    const [name,setname] = useState('')

    const [ErrorMsg,setErrorMsg] = useState('error updating database. please take note of it and try again later');
    const [showmodal,setShowmodal] = useState(false);
    const [loading,setLoading] = useState(false)

    const {api} = UseReadingcontext();

    const handleCreateCredit = () => {
      // Create an object with the creditor data
      const creditor = {
        name: name,
      };
      console.log('msg sent:',creditor)
  
      // Make a POST request to create a new creditor
      apiCall
        .post(api+'/api/creditors/', creditor)
        .then((response) => {
          console.log('creditor created:', response.data);
          // Clear the input fields after successful creation
          setname('');
          setLoading(false)

        })
        .catch((error) => {
          console.error('Error creating creditor:', error);
          setShowmodal(true);
          setLoading(false)
        });
    };

    return ( 
        <div className="create-credit">
            <h2>Create</h2>
            <div className="create-form">
                <TextField 
                  sx={{ maxWidth: 200 }}
                  id="outlined-basic" 
                  label="Name"
                  value={name} 
                  variant="outlined"
                  onChange={(e) => {setname(e.target.value)}} 
                />

                <Fab color="error" className='icon' onClick={()=>{setLoading(true);handleCreateCredit()}} aria-label="add">
                  <AddIcon />
                </Fab>
            </div>
            <div>
              {showmodal && (<ErrorModal message = {ErrorMsg} onClose = {()=>{setShowmodal(false)}} />)}
              {loading ? (
                  <div className='loading-overlay'>
                    <ReactLoading type={"spokes"} color={'#000000'} height={'20%'} width={'20%'}/>
                  </div>
                ) : null}  
              
            </div>
        </div>
     );
}
 
export default CreateCredit;