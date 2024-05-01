// Import necessary React and Material-UI components
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import { useState, useEffect } from 'react';
import { UseReadingcontext } from '../../Readingcontext';
import axiosInstance from '../../utils/axiosInstance';

// Create a functional component for displaying Employee data
export default function EmployeeData() {
  // Function to create data rows
  function createData(id, name, age, phone) {
    return { id, name, age, phone };
  }

  // State variables
  const [employees, setEmployees] = useState([]);
  // ... other state variables as needed

  const { api } = UseReadingcontext();

  // Fetch employee data
  async function fetchemployees() {
      try {
      const response = await axiosInstance.get(api + '/api/employee/');
      const employeeData = response.data;
      setEmployees(employeeData);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  }

  // Handle delete employee
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${api}/api/employee/${id}/`);
      // After deletion, fetch the updated list of employees
      fetchemployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  useEffect(() => {
    fetchemployees();
  }, []);

  // Create rows from employee data
  const rows = employees.map((employee) =>
    createData(employee.id, employee.name, employee.age, employee.phone)
  );

  return (
    <>
      {/* Filtering controls, similar to the ReadingTable component */}
      {/* ... your filtering controls here */}

      {/* Employee data table */}
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 500 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Actions</TableCell> {/* Add a new column for actions */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.age}</TableCell>
                <TableCell align="right">{row.phone}</TableCell>
                <TableCell align="right">
                  <DeleteIcon
                    onClick={() => handleDelete(row.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
