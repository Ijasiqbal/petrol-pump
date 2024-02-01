import TextField from '@mui/material/TextField';
import './Create.css'
import { useState ,useEffect } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { UseReadingcontext } from '../../Readingcontext';
import ErrorModal from '../../ErrorModal';
import ReactLoading from 'react-loading';
import useAxios from '../../utils/useAxios';



const Create = () => {

  let apiCall = useAxios();

    const [name,setname] = useState('');
    const [age,setage] = useState(null);
    const [phone,setphone] = useState(null);
    const [error, setError] = useState(null);
    const [employeenames,setemployeenames] = useState([]);

    const [showmodal,setShowmodal] = useState(false);
    const [showmodal1,setShowmodal1] = useState(false);

    const [loading,setLoading] = useState(false)



    const {api} = UseReadingcontext();

    function createEmployee(){
      if (employeenames.includes(name)) {
        setShowmodal1(true)
        setLoading(false)
      }else {
        handleCreateEmployee();
      }
    }

    async function fetchnames(){

      try{
        const response = await apiCall.get(api+'/api/employee/');
        const employeedata = response.data;
        const names = employeedata.map((employee) => {return employee.name});
        setemployeenames(names);
        console.log('names',names)
      }catch(error){
        console.error('Error fetching employee names:', error);
      }
      
    }
    
    

    const handleCreateEmployee = () => {
        // Create an object with the employee data
        const newEmployee = {
          name: name,
          age: age,
          phone: phone,
        };
        console.log('msg sent:',newEmployee)
    
        // Make a POST request to create a new employee
        apiCall
          .post(api+'/api/employee/', newEmployee)
          .then((response) => {
            console.log('Employee created:', response.data);
            // Clear the input fields after successful creation
            setname('');
            setage('');
            setphone('');
            setError(null);
            setLoading(false)
          })
          .catch((error) => {
            console.error('Error creating employee:', error);
            setError('Record not created');
            setLoading(false)
            setShowmodal(true);
          });
      };

      useEffect(() => {
        fetchnames();
      }, []);

    return ( 
        <div>
          <h3 className='heading3'>Create an Employee</h3>
            <div className='form'>
                <TextField 
                  id="outlined-basic" 
                  label="Name"
                  value={name} 
                  variant="outlined"
                  onChange={(e) => {setname(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase())}} 
                />
                <TextField 
                  sx={{width:100}}
                  id="outlined-basic" 
                  label="Age" 
                  value={age}
                  variant="outlined"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue)) {  // Check if the input value contains only digits
                      setage(inputValue);
                  }}} 
                />
                <TextField 
                  id="outlined-basic" 
                  label="Phone Number" 
                  value={phone}
                  variant="outlined"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue)) {  // Check if the input value contains only digits
                      setphone(inputValue);
                  }}} 
                />  
                <Fab color="error" className='icon' onClick={()=>{
                 setLoading(true);
                 createEmployee();
                }} aria-label="add">
                  <AddIcon />
                </Fab>
            </div>
            <div>
                {error && <p className="error-message">{error}</p>} {/* Display error message if error state is set */}
            </div>
            <div>
              {showmodal && (<ErrorModal message = {'please enter valid data in the fields nd check whether the server is running'} onClose = {()=>{setShowmodal(false)}} />)}
              {showmodal1 && (<ErrorModal message={"This employee name already exist"} onClose = {()=>{setShowmodal1(false)}}/>)}

              {loading ? (
                  <div className='loading-overlay'>
                    <ReactLoading type={"spokes"} color={'#000000'} height={'20%'} width={'20%'}/>
                  </div>
                ) : null}  
              
            </div>

        </div>
     );
}
 
export default Create;