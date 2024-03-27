import React from 'react'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
function TransactionView({open, setOpen, row, student}) {
    const columns = [
        { field: 'transactionType', headerName: 'Transaction Type', flex: 1 },
        { field: 'callDuration', headerName: 'Duration', flex: 1 },
        { field: 'phoneNumber', headerName: 'Number', flex: 1 },
        { field: 'amount', headerName: 'Amount', flex: 1 },
        { field: 'createdAt', headerName: 'Date', flex: 1, renderCell: (params) => moment(params.value).format("DD-MM-YY HH:mm") },
      ];
  return (
    <Dialog open={open} onClose={()=> setOpen(false)} maxWidth="lg" fullWidth >
    <DialogTitle >Transactions of {student?.name}</DialogTitle>
    <DialogContent >
      <DataGrid
        rows={row}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        getRowId={(row) => row._id}
        sx={{ fontFamily: 'Poppins, sans-serif' }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={()=> setOpen(false)}>Close</Button>
    </DialogActions>
  </Dialog>
  )
}

export default TransactionView
