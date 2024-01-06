import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { Box, Typography, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';
import { getSchools } from '../../Api/schools';
import { enqueueSnackbar } from 'notistack';
import { getUsers } from '../../Api/users';
import { getStudents } from '../../Api/student';
import { getTransaction } from '../../Api/transaction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Person3Icon from '@mui/icons-material/Person3';
import ContactlessIcon from '@mui/icons-material/Contactless';

function Dashboard() {
  const [totalSchools, setTotalSchools] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [students, setStudents] = useState(0)
  const [transaction, setTransaction] = useState(0)

  const AllSchools = async()=>{
    try{
    const response = await getSchools()
    if(response.status === 200){
      setTotalSchools(response.data.length)
    }
    }catch(error){
      enqueueSnackbar({message: error.message, variant:'error'})
    }
  }
 const AllUsers = async()=>{
  try{
    const response = await getUsers()
    if(response.status === 200){
    console.log(response.data);
      setTotalUsers(response.data.length)
    }
  }catch(error){
    enqueueSnackbar({message: error.message, variant:'error'})
  }
 }

 const AllStudents = async()=>{
  try {
    const response = await getStudents()
    if(response.status === 200){
      setStudents(response.data.length)
    }
  } catch (error) {
    enqueueSnackbar({message: error.message, variant:'error'})
  }
 }
 const AllTransactions = async()=>{
  try {
    const response = await getTransaction()
    if(response.status === 200){
      setTransaction(response.data.length)
    }
  } catch (error) {
    enqueueSnackbar({message: error.message, variant:'error'})
  }
 }
  useEffect(()=>{
     AllUsers()
     AllSchools()
     AllStudents()
     AllTransactions()
  },[])
  
  return (
    <Box sx={{width: {md: 'calc(100% - 240px)',sm: 'calc(100% - 240px)',xs: '100%',lg: 'calc(100% - 240px)',},
    height: 'auto', ml: {md: '240px',sm: '240px',xs: '0px',lg: '240px',},}} >
      <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Schools</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{totalSchools}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <SchoolIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Users</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{totalUsers}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <AccountCircleIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Students</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{students}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <Person3Icon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Transactions</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{transaction}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <ContactlessIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

      </Grid>
    </Box>
    </Box >
  )
}

export default Dashboard
