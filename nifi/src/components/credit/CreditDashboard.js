import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { UseReadingcontext } from '../../Readingcontext';
import axiosInstance from '../../utils/axiosInstance';
import Switch from '@mui/material/Switch';
import { de } from 'date-fns/locale';

export default function CreditDashboard() {
  function createData(id, name,credit_amount,debit_amount,modeOfPayment,markAsPaid,transaction_date,transaction_time) {
    return {id, name,credit_amount,debit_amount,modeOfPayment,markAsPaid,transaction_date,transaction_time};
  }

  const [name, setname] = useState(null);
  const [Creditors,setCreditors] = useState([]);
  const [month,setmonth] = useState(null)
  const [date,setdate] = useState(null);

  const {api} = UseReadingcontext();

  let totalCredit = 0;
  let totalDebit = 0;
  let unpaidCheques = 0;

  const [data, setData] = useState([]);
  const rows = data.map((item) =>
    createData(item.id, item.name,item.credit_amount,item.debit_amount,item.modeOfPayment,item.markAsPaid,item.transaction_date,item.transaction_time)
  );

  async function fetchdata() {
    try {
      const response = await axiosInstance.get('/api/transactions/');
  
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const responseData = response.data;
  
      // Sort the response data by id in ascending order
      responseData.sort((a, b) => b.id - a.id);
      setData(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchnames(){

    try{
      const response = await axiosInstance.get(api+'/api/creditors/');
      const creditorsdata = response.data;
      const names = creditorsdata.map((creditor) => {return creditor.name});
      setCreditors(names);
      console.log('names',names)
    }catch(error){
      console.error('Error fetching creditors names:', error);
    }
    
  }
  async function handleSwitchChange(event, id) {
    try {
      console.log('Switch event:', event.target.checked);
      const response = await axiosInstance.put(`/api/transactions/${id}/`, {
        markAsPaid: event.target.checked,
      });
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      fetchdata();
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
    <FormControl sx={{ minWidth: 150 }} size='small'>
      <InputLabel id="demo-simple-select-label">Filter by Name</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={name}
        label="Filler"
        onChange={(e) => {
          setname(e.target.value)
          totalCredit=0;
          totalDebit=0;
        }}
      >
        <MenuItem value={null}>select all</MenuItem>
        {Creditors.map((creditor) => (
          <MenuItem value={creditor}>{creditor}</MenuItem>
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
          setmonth(e.target.value)
          totalCredit=0;
          totalDebit=0;
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
          totalCredit=0;
          totalDebit=0;
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
              <TableCell align="right">Credit</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Mode Of Payment</TableCell>
              <TableCell align="right">Mark as Paid</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const rowMonth = row.transaction_date.split('-')[1]; // Extract the month from the date
              const rowDate = row.transaction_date.split('-')[2];
              // Add a conditional check to filter rows by name
              if ((name === null || row.name === name) && (date === null || rowDate === date) && (month === null || month === rowMonth)) {
                const creditAmount = parseFloat(row.credit_amount);
                const debitAmount = parseFloat(row.debit_amount);
                if (!isNaN(creditAmount)) {
                  totalCredit += creditAmount;
                }
                if (!isNaN(debitAmount)) {
                  totalDebit += debitAmount;
                }
                if (row.modeOfPayment === 'cheque' && !row.markAsPaid) {
                  unpaidCheques += debitAmount;
                }
                return (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right" style={{color:"red"}}>{row.credit_amount}</TableCell>
                    <TableCell align="right" style={{color:"green"}}>{row.debit_amount}</TableCell>
                    <TableCell align="center">{row.modeOfPayment}</TableCell>
                    <TableCell align="center">
                        {row.modeOfPayment === 'cheque' ? (
                          <Switch
                            // Assuming you have a state to track the switch value
                            checked={row.markAsPaid}
                            onChange={(event) => handleSwitchChange(event, row.id)}
                            color="primary"
                          />
                        ) : (
                          <Switch checked={row.markAsPaid} disabled />
                        )}
                    </TableCell>
                    <TableCell align="right">{row.transaction_date}</TableCell>
                    <TableCell align="right">{row.transaction_time}</TableCell>
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
        <h6>Outstanding amount:{totalCredit-totalDebit+unpaidCheques}</h6>
      </div>
      </>
  );
}
