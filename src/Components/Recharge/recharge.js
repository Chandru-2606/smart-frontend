import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getRecharge } from '../../Api/recharge';
import { getStudentByID } from '../../Api/student';
import Loader from '../Loader/loader';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { updateRecharge } from '../../Api/recharge';
import { createTransactions } from '../../Api/transaction';
import { getStudentBySchool } from '../../Api/schools';
import { updateStudent } from '../../Api/student';
import { Edit } from '@mui/icons-material';
function Recharge() {
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('')
  const [amount, setAmount] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const columns = [
    { field: 'rfidCardId', headerName: 'RFID Card ID', flex: 1, valueGetter: (params) => params.row?.rfidCardId || '' },
    { field: 'name', headerName: 'Student Name', flex: 1, valueGetter: (params) => params.row?.name || '' },
    { field: 'balance', headerName: 'Balance', flex: 1 },
    {
      field: 'edit',
      headerName: 'Recharge',
      sortable: false,
      filterable: false,
      width: 80,
      disableClickEventBubbling: true,
      flex:1,
      renderCell: (params) => {
        return (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            <Edit />
          </Button>
        );
      },
    },
  ];
  

  const fetchRechargeAndMerge = async () => {
    setLoading(true);
    try {
      // const response = await getRecharge();
      const response = await getStudentBySchool(user.school)
      console.log(response.data);
      setTimeout(() => {
        setLoading(false);
        setMergedData(response.data);
      }, 250);
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };

  const handleEditClick = (row) => {
    console.log(row);
    setLoading(true)
    setTimeout(()=>{
      setSelectedRow(row);
      setSelectedStudent(row._id)
      setAmount(row.balance)
      setEditDialogOpen(true);
      setLoading(false)
    },250)
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
console.log(selectedStudent);
  const handleEditSave = async() => {
    console.log('totalAmount' ,Number(amount) + Number(editAmount));
    setEditDialogOpen(false);
    let total = Number(amount) + Number(editAmount)
    try{
      let updatedTransaction ={ amount : Number(editAmount), student:selectedRow._id, transactionType:'recharge'}
      const studentResponse = await updateStudent(selectedStudent, {balance:total})
      const transactionResponse = await createTransactions(updatedTransaction)
      fetchRechargeAndMerge()
    }catch(error){
      enqueueSnackbar({message: error.message, variant: 'error'})
    }
  };

  useEffect(() => {
    fetchRechargeAndMerge();
  }, []);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{
          width: {
            md: 'calc(100% - 240px)',
            sm: 'calc(100% - 240px)',
            xs: '100%',
            lg: 'calc(100% - 240px)',
          },
          height: 'auto',
          ml: {
            md: '240px',
            sm: '240px',
            xs: '0px',
            lg: '240px',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <DataGrid
            rows={mergedData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 30]}
            disableSelectionOnClick
            getRowId={(row) => row._id}
            sx={{ fontFamily: 'Poppins, sans-serif' }}
          />
        </Box>
        <Loader loading={loading} />

        <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
          <DialogTitle>Recharge</DialogTitle>
          <DialogContent>
            <TextField
              label="Recharge Amount"
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SnackbarProvider>
  );
}

export default Recharge;
