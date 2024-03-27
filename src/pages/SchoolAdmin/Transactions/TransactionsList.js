import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getTransaction } from '../../../Api/transaction';
import { Box, Typography} from '@mui/material';
import Loader from '../../../Components/Loader/loader';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { getStudentBySchool } from '../../../Api/schools';
import TransactionView from '../../../Components/Student/Transactions/TransactionView';
import { grey } from "@mui/material/colors";

function Transactions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));


  const fetchTransactionData = async () => {
    try {
      const response = await getTransaction();
      setTransaction(response.data)
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };

  const getStudentsData = async () => {
    setLoading(true);
    try {
      const response = await getStudentBySchool(user.school);
      setRows(response.data)
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }finally{
      setTimeout(()=>{
        setLoading(false)
      }, 250);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: "cardID", headerName: "Card ID", flex: 1, 
      renderCell: (params) => params.row.cardID ? params.row.cardID : "Not Added", 
    },
    { field: 'balance', headerName: 'Balance', flex: 1 },
  ];

  
  const handleCellDoubleClick = async (params) => {
    setLoading(true);
    const filtered = transaction.filter((item) => item.student === params.row._id);
    setTimeout(()=>{
      setFilteredData(filtered);
      setSelectedStudent(params.row);
      setDialogOpen(true);
      setLoading(false);
    },250)
  };

  useEffect(() => {
    getStudentsData();
    fetchTransactionData();
  }, []);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%',   lg: 'calc(100% - 240px)', },
          minHeight: '90vh', ml: { md: '240px',sm: '240px',xs: '0px',lg: '240px',},backgroundColor: "#f7f7f8",p: 3}}>
        <Typography variant='h6' sx={{ fontFamily: 'Poppins, sans-serif', mb:1, fontWeight:'bolder' }}>Transactions</Typography>
        <Box style={{ height: "auto", width: "100%" , overflowX: "auto"}}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15]}
          disableSelectionOnClick
          getRowId={(row) => row._id}
          onCellDoubleClick={handleCellDoubleClick}
          sx={{ boxShadow: 4, backgroundColor: grey[50], fontFamily: 'Poppins, sans-serif', borderRadius: 2, minHeight: '3vh', minWidth: 700 }}
        />
        </Box>

       
      </Box>
      <TransactionView open={dialogOpen} setOpen={setDialogOpen} row={filteredData} student={selectedStudent} />
      <Loader loading={loading} />
    </SnackbarProvider>
  );
}

export default Transactions;
