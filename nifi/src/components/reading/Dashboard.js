import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './Dashboard.css'
import useAxios from '../../utils/useAxios';

export default function Dashboard() {
  function createData(id, name, dispensingUnit,nossle,cash,card,paytm,oil,credit,expected, received,shortage,date,time) {
    return { id, name, dispensingUnit,nossle,cash,card,paytm,oil,credit,expected, received,shortage,date,time};
  }

  const [name, setname] = useState(null);
  const [employeenames,setemployeenames] = useState([]);
  const [month,setmonth] = useState(null)
  const [date,setdate] = useState(null);



  let sum = 0;

  let apiCall = useAxios();

  async function fetchnames(){
    try{
      const response = await apiCall.get('/api/employee/');
      const employeedata = response.data;
      const names = employeedata.map((employee) => {return employee.name});
      setemployeenames(names);
      console.log('names',names)
    }catch(error){
      console.error('Error fetching employee names:', error);
    }
  }

  //const {employeedata,loading,error} = useAxiosGet(api+'/api/employee/');
  const [data, setData] = useState([]);
  const rows = data.map((item) =>createData(item.id, item.name, item.dispensingUnit,item.nossle,item.cash,item.card,item.paytm,item.oil,item.credit, item.expected, item.received,item.shortage,item.date,item.time)
  );

  async function fetchdata() {

    try {
      const response = await apiCall.get('/api/readings/')
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const responseData = response.data;
      responseData.sort((a, b) => b.id - a.id);
      setData(responseData);
      
    } catch (error) {
      console.error(error);      
    }
  }





  useEffect(() => {
    fetchdata();
    fetchnames();
  }, []);

  return (
    <>
        <h2>Dashboard</h2>
    <FormControl sx={{ minWidth: 150 }} size='small'>
      <InputLabel id="demo-simple-select-label">Filter by Name</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={name}
        label="Filler"
        onChange={(e) => {
          setname(e.target.value);
          sum=0;
        }}
      >
        <MenuItem value={null}>select all</MenuItem>
        {employeenames.map((employeename) => (
          <MenuItem value={employeename}>{employeename}</MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl sx={{ minWidth: 150 }} size='small'>
      <InputLabel id="demo-simple-select-label">Filter by Month</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={month}
        label="Age"
        onChange={(e) => {
          setmonth(e.target.value);
          sum=0;
        }}
      >
        <MenuItem value={null}>Select All Months</MenuItem>
        <MenuItem value="01">January</MenuItem>
        <MenuItem value="02">February</MenuItem>
        <MenuItem value="03">March</MenuItem>
        <MenuItem value="04">April</MenuItem>
        <MenuItem value="05">May</MenuItem>
        <MenuItem value="06">June</MenuItem>
        <MenuItem value="07">July</MenuItem>
        <MenuItem value="08">August</MenuItem>
        <MenuItem value="09">September</MenuItem>
        <MenuItem value="10">October</MenuItem>
        <MenuItem value="11">November</MenuItem>
        <MenuItem value="12">December</MenuItem>
      </Select>
    </FormControl>

    <FormControl sx={{ minWidth: 150 }} size="small">
      <InputLabel id="filter-by-date-label">Filter by Date</InputLabel>
      <Select
        labelId="filter-by-date-label"
        id="filter-by-date-select"
        value={date}
        label="Filter by Date"
        onChange={(e) => {
          setdate(e.target.value);
          sum=0;
        }}
      >
        <MenuItem value={null}>All Dates</MenuItem>
        {
          Array.from({ length: 31 }, (_, i) => (
            <MenuItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
              {(i + 1).toString().padStart(2, '0')}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
    
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size='small' aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Dispensing Unit</TableCell>
              <TableCell align="right">Expected</TableCell>
              <TableCell align="right">Received</TableCell>
              <TableCell align="right">Shortage</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Cash</TableCell>
              <TableCell align="right">Card</TableCell>
              <TableCell align="right">Paytm</TableCell>
              <TableCell align="right">Oil Sales</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell align="right">Nozzle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const rowMonth = row.date.split('-')[1]; // Extract the month from the date
              const rowDate = row.date.split('-')[2];
              // Add a conditional check to filter rows by name
              if ((name === null || row.name === name) && (date === null || rowDate === date) && (month === null || month === rowMonth)) {
                sum = sum+row.shortage
                return (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.dispensingUnit}</TableCell>
                    <TableCell align="right">{row.expected}</TableCell>
                    <TableCell align="right">{row.received}</TableCell>
                    <TableCell align="right">{row.shortage}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.time}</TableCell>
                    <TableCell align="right">{row.cash}</TableCell>
                    <TableCell align="right">{row.card}</TableCell>
                    <TableCell align="right">{row.paytm}</TableCell>
                    <TableCell align="right">{row.oil}</TableCell>
                    <TableCell align="right">{row.credit}</TableCell>
                    <TableCell align="right">{row.nossle}</TableCell>
                  </TableRow>
                );
              }
              // If the name doesn't match, return null (won't render the row)
              return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <h6>Total Shortage:{sum}</h6>
      </div>
      </>
  );
}
