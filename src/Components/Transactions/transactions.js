import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getStudents } from '../../Api/student';
import { getTransaction } from '../../Api/transaction';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';
import Loader from '../Loader/loader';
import moment from 'moment';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { getStudentBySchool } from '../../Api/schools';

function Transactions() {
  const [studentsWithTransactions, setStudentsWithTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchTransactionData = async (studentId) => {
    try {
      const response = await getTransaction(studentId);
      return response.data;
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
      return [];
    }
  };
  const user = JSON.parse(localStorage.getItem('user'))

  const getStudentsData = async () => {
    setLoading(true);
    try {
      const studentsResponse = await getStudentBySchool(user.school);
      if (studentsResponse.status === 200) {
        const studentsData = studentsResponse.data;
        const studentsWithTransactionsData = await Promise.all(
          studentsData.map(async (student) => {
            const transactionData = await fetchTransactionData(student._id);
            const mergedData = transactionData && transactionData.length > 0
              ? { ...student, transactionData }
              : { ...student };
            return mergedData;
          })
        );
        setLoading(false);
        setStudentsWithTransactions(studentsWithTransactionsData);
      }
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'rfidCardId', headerName: 'RFID Card ID', flex: 1 },
  ];

  const transactionsColumns = [
    { field: 'amount', headerName: 'Amount', flex: 1 },
    { field: 'createdAt', headerName: 'Date', flex: 1, renderCell: (params) => moment(params.value).format("DD-MM-YY HH:mm") },
  ];

  const handleCellDoubleClick = async (params) => {
    const studentId = params.row._id;
    const transactionData = await fetchTransactionData(studentId);
    const filtered = transactionData.filter((item) => item.student === studentId);
    setLoading(true)
    setTimeout(()=>{
      setFilteredData(filtered);
      setSelectedStudent(params.row);
      // setTransactionDialogOpen(true);
      setDialogOpen(true)
      setLoading(false)
    },250)
  };

  useEffect(() => {
    getStudentsData();
  }, []);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%',   lg: 'calc(100% - 240px)', },
          height: 'auto', ml: { md: '240px',sm: '240px',xs: '0px',lg: '240px',},p: 3}}>
        <Typography variant='h6' sx={{ fontFamily: 'Poppins, sans-serif', mb:1, fontWeight:'bolder' }}>Transactions</Typography>
        <DataGrid
          rows={studentsWithTransactions}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={(row) => row._id}
          onCellDoubleClick={handleCellDoubleClick}
          sx={{ fontFamily: 'Poppins, sans-serif' }}
        />
        <Loader loading={loading} />

        <Dialog open={dialogOpen} onClose={!dialogOpen}>
          <DialogTitle>Transactions for {selectedStudent?.name}</DialogTitle>
          <DialogContent>
            <DataGrid
              rows={filteredData}
              columns={transactionsColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              getRowId={(row) => row._id}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=> setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SnackbarProvider>
  );
}

export default Transactions;
