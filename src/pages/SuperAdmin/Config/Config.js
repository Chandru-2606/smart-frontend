import React, { useEffect, useState } from 'react'
import { Box, Typography, IconButton, Card, CardContent, Grid, CardActionArea } from '@mui/material'
import { SnackbarProvider, enqueueSnackbar  } from "notistack";
import { getConfig, updateConfig } from '../../../Api/config'
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from "@mui/icons-material/Edit";
import { grey } from '@mui/material/colors';
import RateInputDialog from '../../../Components/Config/ConfigDialog';
import Loader from '../../../Components/Loader/loader';

function Config() {
   const [rows, setRows] = useState([]);
   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [selectedRow, setSelectedRow] = useState({})

   const fetchConfig = async()=>{
    setLoading(true);
    try {
        const response = await getConfig()
        setRows(response.data)
    } catch (error) {
      enqueueSnackbar({message: error.response.data.message, variant:'error'})
    } finally{
        setTimeout(()=>{
           setLoading(false)
        }, 250)
    }
   }

   useEffect(()=>{
       fetchConfig();
   }, [])

   const columns = [
    { field: "rate", headerName: "Rate Per Min", flex: 1 },
    { 
      field: "actions", 
      headerName: "Actions", 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ gap: 2 }}>
          <IconButton>
          <EditIcon 
            style={{ cursor: "pointer"}}
            onClick={() => {
              setLoading(true);
              setTimeout(()=>{
                setOpen(true);
                setSelectedRow(params.row)
                setLoading(false);
              }, 250)
            }}
          />
          </IconButton>
        </Box>
      ),
    },
  ];

 const onSubmit = async(data)=>{
    setLoading(false);
    try {
        const response = await updateConfig(selectedRow._id, data)
        enqueueSnackbar({message: 'Updated Successfully', variant:'success'})
    } catch (error) {
        enqueueSnackbar({message: error.response.data.message, variant:'error'})
    } finally{
        setTimeout(()=>{
            setLoading(false);
            fetchConfig();
        }, 250)
    }
 }
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
    <Box sx={{
      width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%', lg: 'calc(100% - 240px)' },
      minHeight: '90vh', ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px' }, backgroundColor: "#f7f7f8", p: 3
    }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bolder', fontFamily: 'Poppins, sans-serif' }} > Config </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
      {rows.map(row => (
        <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
          <CardActionArea>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Rate Per Minute</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{row.rate} </Typography>
              </CardContent>
            <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit"
                onClick={() => {
                setSelectedRow(row);
                setOpen(true);
              }}>
                <EditIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>
      ))}
      </Grid>

      <RateInputDialog open={open} setOpen={setOpen} onSubmit={onSubmit} />
      <Loader loading={loading} />

    </Box>
  </SnackbarProvider>

  )
}

export default Config
