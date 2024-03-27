import React, { useEffect, useState } from 'react';
import { SnackbarProvider, enqueueSnackbar  } from "notistack";
import { Box, Typography, Button, TextField, IconButton, Table, TableRow, TableCell, TableBody, Grid, Card, CardActionArea } from '@mui/material';
import { getStudentBySchool } from '../../../Api/schools';
import { updateStudent } from '../../../Api/student';
import Loader from '../../../Components/Loader/loader';
import RechargeDialog from '../../../Components/Student/Recharge/RechargeDialog';
import { createTransactions } from '../../../Api/transaction';
import { useForm, Controller } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';

function Recharge() {
  const [rows, setRows] = useState([])
  const [copyRows, setCopyRows] = useState([])
  const [searchedCard, setSearchedCard] = useState('')
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([])
  const [selectedRow, setSelectedRow] = useState({})
  const user = JSON.parse(localStorage.getItem('user'))
  const { register,setValue, handleSubmit, control, formState: { errors } } = useForm();


  const fetchStudents = async()=>{
    try {
      const response = await getStudentBySchool(user.school)
      setRows(response.data);
      setCopyRows(response.data);
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message, variant : 'error'})
    }
  }
   useEffect(()=>{
      fetchStudents()
   }, []) 
   const onSearch =(e)=>{
    setSearchedCard(e.target.value)
  }

  const handleSearch =()=>{
    const filtered = copyRows && copyRows.filter((item)=>{
      return (((item.cardID).toLowerCase()).includes(searchedCard.toLowerCase())) 
    })
    if(filtered[0]?.name){
      setLoading(true);
    setTimeout(()=>{
      setRows(filtered);
      setFilteredData(filtered);
      setLoading(false);
    }, 250)
    } else{
      setLoading(true);
      setTimeout(()=>{
        setLoading(false);
        enqueueSnackbar({message:'Card Id Not Found', variant : 'error'})
      }, 250)
    }
  }

  



const onSubmit = async(data)=>{
      setLoading(true);
    let updatedStudent = {
        ...filteredData[0],
        balance : Number(filteredData[0].balance) + Number(data.amount)
    }
    let transactions = {
        transactionType : 'recharge',
        amount : data.amount,
        student : filteredData[0]._id
    }
    try {
        const response = await updateStudent(filteredData[0]._id, updatedStudent)
        const transactionResponse = await createTransactions(transactions);
        enqueueSnackbar({message : 'Recharged Successfully', variant:'success'})
    } catch (error) {
        enqueueSnackbar({message : error.response.data.message , variant : 'error' })
    } finally{
      setTimeout(()=>{
        setLoading(false);
        fetchStudents();
        setFilteredData([]);
        setSearchedCard('');
        setValue('amount', '')
      }, 250)
    }
}

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box sx={{ width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%', lg: 'calc(100% - 240px)' }, minHeight: '90vh', ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px' }, backgroundColor: "#f7f7f8", p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bolder', fontFamily: 'Poppins, sans-serif' }}>Recharge</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', p: 2 }}>
          <Box sx={{display:'flex', gap:3, width : {lg:'50%' , md : '50%'}}}>
              <TextField label='Search CardID' onChange={(e) => onSearch(e)}
               sx={{ minWidth: 120,  mr: 2, mb:2,
                '& .MuiInputBase-input': {
                    height: '25px',
                    padding: '10px',
                },
                '& .MuiInputLabel-root': {
                    top: '-5px',
                    fontSize: '0.875rem',
                },
                '& .MuiInputLabel-shrink': {
                    top: '0px',
                },
            }} />
              <Box>
              <IconButton onClick={handleSearch} >
               <SearchIcon />
              </IconButton>
              </Box>
          </Box>
          <CardActionArea sx={{width : {lg:'50%'}}}>
         <Card >
          {filteredData && filteredData.map((item, index) => (
            <form key={index} onSubmit={handleSubmit(onSubmit)}>
            <Table key={index} style={{ width: '100%', '@media (max-width:600px)': { width: '90%' },fontFamily: 'Poppins, sans-serif'  }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{fontFamily: 'Poppins, sans-serif' }}>Student:</TableCell>
                  <TableCell align="center"  sx={{fontFamily: 'Poppins, sans-serif' }}>{item.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{fontFamily: 'Poppins, sans-serif' }}>CardID:</TableCell>
                  <TableCell align="center" sx={{fontFamily: 'Poppins, sans-serif' }}>{item.cardID}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{fontFamily: 'Poppins, sans-serif' }}>Balance:</TableCell>
                  <TableCell align="center" sx={{fontFamily: 'Poppins, sans-serif' }}>{item.balance ? item.balance : 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{fontFamily: 'Poppins, sans-serif' }}>Recharge:</TableCell>
                  <TableCell align="center" sx={{fontFamily: 'Poppins, sans-serif' }}>
                  <Controller
                          name="amount"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Amount is required' }} 
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Amount"
                              type='number'
                              error={!!errors.amount}
                              helperText={errors.amount ? errors.amount.message : ''}
                              sx={{
                                minWidth: 120,
                                mr: 2,
                                mb: 2,
                                '& .MuiInputBase-input': {
                                  height: '25px',
                                  padding: '10px',
                                },
                                '& .MuiInputLabel-root': {
                                  top: '-5px',
                                  fontSize: '0.875rem',
                                },
                                '& .MuiInputLabel-shrink': {
                                  top: '0px',
                                },
                              }}
                            />
                          )}
                        />

                    </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center"sx={{fontFamily: 'Poppins, sans-serif' }}>
                     <Button variant='contained'  type='submit' sx={{width:'60%'}}>Submit</Button>
                   </TableCell>
                </TableRow>
              </TableBody>
              
            </Table>
            </form>
          ))}
</Card>
</CardActionArea>
        </Box>
        <Loader loading={loading} />
        <RechargeDialog open={open} setOpen={setOpen} onSubmit={onSubmit} />
      </Box>
    </SnackbarProvider>
  )
}

export default Recharge
