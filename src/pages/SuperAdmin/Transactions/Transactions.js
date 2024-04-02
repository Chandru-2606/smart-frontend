import React, { useEffect, useState } from 'react'
import { SnackbarProvider, enqueueSnackbar  } from "notistack";
import { Box, Typography, Button , IconButton, Autocomplete, TextField} from '@mui/material';
import { getTransaction, deleteTransaction } from '../../../Api/transaction';
import { DataGrid } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '../../../Components/Loader/loader';
import { getSchools } from '../../../Api/schools';
import moment from 'moment';


function Transactions() {
     const [rows, setRows] = useState([]);
     const [schools, setSchools] = useState([]);
     const [copyRows, setCopyRows] = useState([])
     const [selectedSchool, setSelectedSchool] = useState(null);
     const [loading, setLoading] = useState(false);

    const fetchTransactions = async()=>{
        setLoading(true);
        try {
            const response = await getTransaction()
            setRows(response.data)
            setCopyRows(response.data)
        } catch (error) {
            enqueueSnackbar({message : error.response.data.message, variant : 'error'})
        }finally {
            setTimeout(()=>{
                setLoading(false)
            }, 250)
        }
    }

    const fetchSchools = async()=>{
        try {
            const response = await getSchools()
            setSchools(response.data)
        } catch (error) {
            enqueueSnackbar({message : error.response.data.message, variant : "error"})
        }
    }

    useEffect(()=>{
        fetchTransactions();
        fetchSchools()
    }, [])
    
    const columns = [
        { field: 'createdAt', headerName: 'Data', flex: 1, renderCell: (params) => moment(params.row.createdAt).format("DD-MM-YY HH:mm")},
        { field: 'name', headerName: 'Student', flex: 1, renderCell: (params) => params?.row?.student?.name },
        { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, renderCell: (params) => params?.row.phoneNumber ? params?.row.phoneNumber : '-' },
        { field: 'callDuration', headerName: 'Call Duration', flex: 1, renderCell: (params) => params?.row?.callDuration ? params?.row?.callDuration : '-'  },
        { field: 'transactionType', headerName: 'Transaction Type', flex: 1, renderCell: (params) => params?.row?.transactionType === 'call' ? 'Call' : 'Recharge' },
        { 
            field: 'amount', 
            headerName: 'Amount', 
            flex: 1, 
            renderCell: (params) => {
              const amount = params?.row?.amount;
              const transactionType = params?.row?.transactionType;
              const cellStyle = {
                color: transactionType === 'recharge' ? 'green' : 'red'
              };
          
              return (
                <div style={cellStyle}>
                  {transactionType === 'recharge' ? ` ₹ ${amount?.toFixed(2)} Cr` : `₹ ${amount?.toFixed(2)} Dr` }
                </div>
              );
            }
          },
        // { field: 'sname', headerName: 'School', flex: 2, renderCell: (params) => params?.row?.student?.school?.name },
          
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     sortable: false,
        //     flex: 1,
        //     renderCell: (params) => (
        //       <>
        //         {/* <IconButton onClick={() => {
        //           setLoading(true);
        //           setTimeout(()=>{
        //             setSelectedCard(params.row);
        //             setEditMode(true)
        //             setOpen(true);
        //             setLoading(false)
        //           },250)
                 
        //         }}
        //          color="primary">
        //           <EditIcon />
        //         </IconButton> */}
        //         <IconButton onClick={() => handleDelete(params.row?._id)} color="error">
        //           <DeleteIcon />
        //         </IconButton>
        //       </>
        //     ),
        //   },
    ]

    const handleDelete = async(id)=>{
        setLoading(true);
        try {
            const response = await deleteTransaction(id)
            fetchTransactions()
        } catch (error) {
            enqueueSnackbar({message : error.response.data.message, variant:'error'})
        } finally{
            setTimeout(()=>{
               setLoading(false)
            }, 250)
        }
    }
    const handleChange =(data)=>{
        setLoading(true);
        const filtered = copyRows.filter((item)=> item.student.school._id === data._id)
        setTimeout(()=>{
            setRows(filtered)
            setLoading(false)
        }, 250)
    }
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{
          width: {
            md: "calc(100% - 240px)",
            sm: "calc(100% - 240px)",
            xs: "100%",
            lg: "calc(100% - 240px)",
          },
          minHeight: "90vh",
          ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
          backgroundColor: "#f7f7f8",
          p: 2
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 , alignContent:'center', alignItems:'center', m:1}}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bolder", fontFamily: "Poppins, sans-serif" }}
          >
            Transactions
          </Typography>
          <Autocomplete
            id="fund-auto-complete"
            options={schools}
            getOptionLabel={(option) => option.name}
            sx={{ width: "30%", mt: 3 }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(event, item) => handleChange(item)}
            renderInput={(params) => <TextField {...params} label="Schools" />}
          />
        </Box>
        <Box style={{ height: "auto", width: "100%", overflowX: "auto" }}>
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
          />
        </Box>
        <Loader loading={loading} />
      </Box>
    </SnackbarProvider>
  );
}

export default Transactions
