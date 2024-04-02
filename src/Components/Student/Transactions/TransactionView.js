import React from 'react'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { grey } from '@mui/material/colors';
function TransactionView({open, setOpen, row, student}) {
  const columns = [
    { field: 'createdAt', headerName: 'Data', flex: 1, renderCell: (params) => moment(params.row.createdAt).format("DD-MM-YY HH:mm")},
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
  return (
    <Dialog open={open} onClose={()=> setOpen(false)} maxWidth="lg" fullWidth >
    <DialogTitle >Transactions of {student?.name}</DialogTitle>
    <DialogContent >
      <DataGrid
        rows={row}
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
    </DialogContent>
    <DialogActions>
      <Button onClick={()=> setOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
  )
}

export default TransactionView
