import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getTransaction , getTransactionByStudent} from '../../../Api/transaction';
import { Box, Typography, IconButton} from '@mui/material';
import Loader from '../../../Components/Loader/loader';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { getStudentBySchool } from '../../../Api/schools';
import TransactionView from '../../../Components/Student/Transactions/TransactionView';
import { grey } from "@mui/material/colors";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


function Transactions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));


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
    { 
      field: "actions", 
      headerName: "Actions", 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ gap: 2 }}>
          <IconButton>
            <ArrowRightAltIcon style={{color:'blue'}} 
            onClick={()=>{
              handleCellDoubleClick(params)
            }}
            />
          </IconButton>
        </Box>
      ),
    },
  ];

  
  const handleCellDoubleClick = async (params) => {
    setLoading(true);
    try {
      const response = await getTransactionByStudent(params.row._id)
      setTransaction(response.data)
      setSelectedStudent(params.row);
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message, variant : 'error'})
    } finally{
      setTimeout(()=>{
        setLoading(false);
        setDialogOpen(true);
      }, 250)
    }
  };

  useEffect(() => {
    getStudentsData();
  }, []);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%',   lg: 'calc(100% - 240px)', },
          minHeight: '90vh', ml: { md: '240px',sm: '240px',xs: '0px',lg: '240px',},backgroundColor: "#f7f7f8",p: 3}}>
        <Typography variant='h6' sx={{ fontFamily: 'Poppins, sans-serif', mb:1, fontWeight:'bolder', ml:1 }}>Transactions</Typography>
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
          sx={{fontFamily: 'Poppins, sans-serif',backgroundColor: grey[50],boxShadow:4, minWidth: 900, m:1}}
          pageSizeOptions={[5, 10, 15]}
          getRowId={(row) => row._id}
          onCellDoubleClick={handleCellDoubleClick}
        />
        </Box>

       
      </Box>
      <TransactionView open={dialogOpen} setOpen={setDialogOpen} row={transaction} student={selectedStudent} />
      <Loader loading={loading} />
    </SnackbarProvider>
  );
}

export default Transactions;
