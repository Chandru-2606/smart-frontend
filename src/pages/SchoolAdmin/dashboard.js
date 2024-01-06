import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { Box, Typography, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactlessIcon from '@mui/icons-material/Contactless';
import PaymentIcon from '@mui/icons-material/Payment';
import { getTransaction } from '../../Api/transaction';
import { getStudents } from '../../Api/student';
import { getStudentBySchool } from '../../Api/schools';
import { enqueueSnackbar } from 'notistack';
function Cards() {
  const [students, setStudents] = useState(0)
  const [transactions, setTransactions] = useState(0)
  const [todayTransaction, setTodayTransactions] = useState(0)
  const [totalRecharge, setTotalRechrage] = useState(0)

  const  user = JSON.parse(localStorage.getItem('user'))
  const fetchTransaction =async()=>{
    try{
    const response = await getTransaction()
    setTransactions(response.data.length)
    setTodayTransactions(response.data.length)
    }catch(error){
     enqueueSnackbar({message: error.message, variant:'error'})
    }
  }

  const fetchStudents = async()=>{
    try{
      const response = await getStudentBySchool(user?.school)
      console.log(response.data.length);
      if(response.data){
      setStudents(response.data.length)
      }
    }catch(error){
     enqueueSnackbar({message: error.message, variant:'error'})
    }
  }

  useEffect(()=>{
    fetchTransaction()
    fetchStudents()
  },[])
  return (
    <Box sx={{width: {md: 'calc(100% - 240px)',sm: 'calc(100% - 240px)',xs: '100%',lg: 'calc(100% - 240px)',},
        height: 'auto', ml: {md: '240px',sm: '240px',xs: '0px',lg: '240px',},}}>
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Students</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:3 }}>{students}</Typography>
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
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Today Transaction</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:3 }}>{todayTransaction}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <ContactlessIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Total Transaction</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:3 }}>{transactions}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <ContactlessIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Total Recharge</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:3 }}>{totalRecharge}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <PaymentIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>
      </Grid>
    </Box>
    </Box>
  );
}

export default Cards;