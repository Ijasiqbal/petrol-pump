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
import './Dashboard.css';
import useAxios from '../../utils/useAxios';
import { FaPrint } from 'react-icons/fa';

export default function Dashboard() {
  function createData(
    id,
    name,
    dispensingUnit,
    openingNozzle1,
    openingNozzle2,
    openingNozzle3,
    openingNozzle4,
    closingNozzle1,
    closingNozzle2,
    closingNozzle3,
    closingNozzle4,
    cash,
    card,
    paytm,
    oil,
    credit,
    expected,
    received,
    shortage,
    date,
    time
  ) {
    return {
      id,
      name,
      dispensingUnit,
      openingNozzle1,
      openingNozzle2,
      openingNozzle3,
      openingNozzle4,
      closingNozzle1,
      closingNozzle2,
      closingNozzle3,
      closingNozzle4,
      cash,
      card,
      paytm,
      oil,
      credit,
      expected,
      received,
      shortage,
      date,
      time,
    };
  }

  const [name, setname] = useState(null);
  const [employeenames, setemployeenames] = useState([]);
  const [month, setmonth] = useState(null);
  const [date, setdate] = useState(null);

  let sum = 0;

  let apiCall = useAxios();

  async function fetchnames() {
    try {
      const response = await apiCall.get('/api/employee/');
      const employeedata = response.data;
      const names = employeedata.map((employee) => employee.name);
      setemployeenames(names);
      console.log('names', names);
    } catch (error) {
      console.error('Error fetching employee names:', error);
    }
  }

  const [data, setData] = useState([]);
  const rows = data.map((item) =>
    createData(
      item.id,
      item.name,
      item.dispensingUnit,
      item.openingNozzle1,
      item.openingNozzle2,
      item.openingNozzle3,
      item.openingNozzle4,
      item.closingNozzle1,
      item.closingNozzle2,
      item.closingNozzle3,
      item.closingNozzle4,
      item.cash,
      item.card,
      item.paytm,
      item.oil,
      item.credit,
      item.expected,
      item.received,
      item.shortage,
      item.date,
      item.time
    )
  );

  async function fetchdata() {
    try {
      const response = await apiCall.get('/api/readings/');
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const responseData = response.data;
      responseData.sort((a, b) => b.id - a.id);
      console.log('Response reading data: ', responseData);
      setData(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  const handlePrint = () => {
    const printableRows = rows.filter((row) => {
      const rowMonth = row.date.split('-')[1];
      const rowDate = row.date.split('-')[2];
      return (
        (name === null || row.name === name) &&
        (date === null || rowDate === date) &&
        (month === null || month === rowMonth)
      );
    });

    const printableContent = `
      <html>
      <head>
        <title>Filtered Data</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h2>Filtered Data</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>DU</th>
              <th>Expected</th>
              <th>Received</th>
              <th>Shortage</th>
              <th>Date</th>
              <th>Cash</th>
              <th>Card</th>
              <th>Paytm</th>
              <th>Oil Sales</th>
              <th>Credit</th>
              <th>Opening Nozzle 1</th>
              <th>Opening Nozzle 2</th>
              <th>Opening Nozzle 3</th>
              <th>Opening Nozzle 4</th>
              <th>Closing Nozzle 1</th>
              <th>Closing Nozzle 2</th>
              <th>Closing Nozzle 3</th>
              <th>Closing Nozzle 4</th>
            </tr>
          </thead>
          <tbody>
            ${printableRows
              .map(
                (row) => `
              <tr>
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.dispensingUnit}</td>
                <td>${row.expected ?? '-'}</td>
                <td>${row.received ?? '-'}</td>
                <td style="color: ${row.shortage > 0 ? 'red' : 'green'};">
                  ${row.shortage}
                </td>
                <td>${row.date}</td>
                <td>${row.cash ?? '-'}</td>
                <td>${row.card ?? '-'}</td>
                <td>${row.paytm ?? '-'}</td>
                <td>${row.oil ?? '-'}</td>
                <td>${row.credit ?? '-'}</td>
                <td>${row.openingNozzle1 ?? '-'}</td>
                <td>${row.openingNozzle2 ?? '-'}</td>
                <td>${row.openingNozzle3 ?? '-'}</td>
                <td>${row.openingNozzle4 ?? '-'}</td>
                <td>${row.closingNozzle1 ?? '-'}</td>
                <td>${row.closingNozzle2 ?? '-'}</td>
                <td>${row.closingNozzle3 ?? '-'}</td>
                <td>${row.closingNozzle4 ?? '-'}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    fetchdata();
    fetchnames();
  }, []);

  return (
    <>
      <h2>Dashboard</h2>
      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel id="demo-simple-select-label">Filter by Name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={name}
          label="Filter"
          onChange={(e) => {
            setname(e.target.value);
            sum = 0;
          }}
        >
          <MenuItem value={null}>select all</MenuItem>
          {employeenames.map((employeename) => (
            <MenuItem key={employeename} value={employeename}>
              {employeename}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }} size="small">
        <InputLabel id="demo-simple-select-label">Filter by Month</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={month}
          label="Month"
          onChange={(e) => {
            setmonth(e.target.value);
            sum = 0;
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
            sum = 0;
          }}
        >
          <MenuItem value={null}>All Dates</MenuItem>
          {Array.from({ length: 31 }, (_, i) => (
            <MenuItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
              {(i + 1).toString().padStart(2, '0')}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className='printBtn' onClick={handlePrint} >
        <div className='btnContainer'>
          <FaPrint  />
          <p>Print</p>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
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
              <TableCell align="right">Opening Nozzle 1</TableCell>
              <TableCell align="right">Opening Nozzle 2</TableCell>
              <TableCell align="right">Opening Nozzle 3</TableCell>
              <TableCell align="right">Opening Nozzle 4</TableCell>
              <TableCell align="right">Closing Nozzle 1</TableCell>
              <TableCell align="right">Closing Nozzle 2</TableCell>
              <TableCell align="right">Closing Nozzle 3</TableCell>
              <TableCell align="right">Closing Nozzle 4</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const rowMonth = row.date.split('-')[1]; // Extract the month from the date
              const rowDate = row.date.split('-')[2];
              // Add a conditional check to filter rows by name
              if (
                (name === null || row.name === name) &&
                (date === null || rowDate === date) &&
                (month === null || month === rowMonth)
              ) {
                sum = sum + row.shortage;
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
                    <TableCell align="right">{row.expected ?? '-'}</TableCell>
                    <TableCell align="right">{row.received ?? '-'}</TableCell>
                    <TableCell 
                      align="right" 
                      style={{ color: row.shortage > 0 ? 'red' : 'green' }}
                    >
                      {row.shortage}
                    </TableCell>                    
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.time}</TableCell>
                    <TableCell align="right">{row.cash ?? '-'}</TableCell>
                    <TableCell align="right">{row.card ?? '-'}</TableCell>
                    <TableCell align="right">{row.paytm ?? '-'}</TableCell>
                    <TableCell align="right">{row.oil ?? '-'}</TableCell>
                    <TableCell align="right">{row.credit ?? '-'}</TableCell>
                    <TableCell align="right">{row.openingNozzle1 ?? '-'}</TableCell>
                    <TableCell align="right">{row.openingNozzle2 ?? '-'}</TableCell>
                    <TableCell align="right">{row.openingNozzle3 ?? '-'}</TableCell>
                    <TableCell align="right">{row.openingNozzle4 ?? '-'}</TableCell>
                    <TableCell align="right">{row.closingNozzle1 ?? '-'}</TableCell>
                    <TableCell align="right">{row.closingNozzle2 ?? '-'}</TableCell>
                    <TableCell align="right">{row.closingNozzle3 ?? '-'}</TableCell>
                    <TableCell align="right">{row.closingNozzle4 ?? '-'}</TableCell>
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="shortage-sum">
        Total Shortage: <span>{sum}</span>
      </div>
    </>
  );
}
