import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { Box, Typography, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactlessIcon from '@mui/icons-material/Contactless';
import { getStudentBySchool } from '../../Api/schools';
import { enqueueSnackbar } from 'notistack';
import { getStats } from '../../Api/transaction';
import { getDevices } from '../../Api/devices';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader/loader';
function Dashboard() {
  const [stats, setStats] = useState([])
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate()
  const  user = JSON.parse(localStorage.getItem('user'))

  const fetchStats = async()=>{
    setLoading(true);
    try {
      const response = await getStats(user.school)
      setStats(response.data)
    } catch (error) {
      enqueueSnackbar({message: error.response.data.message, variant:'error'})
    } finally{
      setTimeout(()=>{
        setLoading(false)
      }, 250)
    }
  }

  
  useEffect(()=>{
    fetchStats();
  },[])
  return (
    <Box sx={{width: {md: 'calc(100% - 240px)',sm: 'calc(100% - 240px)',xs: '100%',lg: 'calc(100% - 240px)',},
        height: 'auto', ml: {md: '240px',sm: '240px',xs: '0px',lg: '240px',},}}>
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea onClick={()=> navigate('/schooladmin/students')}>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Students</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:3 }}>{stats.studentCount}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <AccountCircleIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea onClick={()=> navigate('/schooladmin/transactions')}>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Recharge Today</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:3 }}>{ stats?.transactionStats?.recharge }</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <ContactlessIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea onClick={()=> navigate('/schooladmin/transactions')}>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Call's Today</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:3 }}>{ stats?.transactionStats?.call }</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <ContactlessIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>
      </Grid>
    </Box>
    <Loader loading={loading} />
    </Box>
  );
}

export default Dashboard;