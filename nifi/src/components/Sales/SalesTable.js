import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './SalesTable.css';
import useAxios from '../../utils/useAxios';

const SalesTable = () => {

    let apiCall = useAxios();

  const [sales, setSales] = useState([]);

  async function getSales() {
    try {
      const response = await apiCall.get('/api/sales/');
      const salesData = response.data;
      salesData.reverse();
      setSales(salesData);
      console.log('Sales data:', salesData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  }

  useEffect(() => {
    getSales();
  }, []);

  return (
    <div className="salesTableView">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 , background: 'rgb(255, 227, 222)', borderRadius:'15px'}} size='small' aria-label="simple table">
                <TableHead>
                  <TableRow sx={{background: 'rgb(255, 239, 236)'}}>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Fuel Sales</TableCell>
                    <TableCell align="right">Shortage</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Time</TableCell>
                    <TableCell align="right">Debit</TableCell>
                    <TableCell align="right">Oil</TableCell>
                    <TableCell align="right">Item Sales</TableCell>
                    <TableCell align="right">Opening Balance</TableCell>
                    <TableCell align="right">Total Cash</TableCell>
                    <TableCell align="right">Total Card</TableCell>
                    <TableCell align="right">Total Paytm</TableCell>
                    <TableCell align="right">Credit</TableCell>
                    <TableCell align="right">Closing Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell sx={{ minWidth: 120}}align="right">{sale.fuelSales}</TableCell>
                      <TableCell sx={{ minWidth: 120}}align="right">{sale.shortage}</TableCell>
                      <TableCell sx={{ minWidth: 120}} align="right">{sale.date}</TableCell>
                      <TableCell align="right">{sale.time.slice(0,8)}</TableCell>
                      <TableCell align="right">{sale.debit}</TableCell>
                      <TableCell align="right">{sale.oil}</TableCell>
                      <TableCell align="right">{sale.itemSales}</TableCell>
                      <TableCell align="right">{sale.openingBalance}</TableCell>
                      <TableCell align="right">{sale.totalCash}</TableCell>
                      <TableCell align="right">{sale.totalCard}</TableCell>
                      <TableCell align="right">{sale.totalPaytm}</TableCell>
                      <TableCell align="right">{sale.credit}</TableCell>
                      <TableCell align="right">{sale.closingBalance}</TableCell>
                    </TableRow>
                  ))}   
                </TableBody>
              </Table>
            </TableContainer>
    </div>
  );
};

export default SalesTable;
