import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { Box, Typography, IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { enqueueSnackbar } from 'notistack';
import { getAllStats } from '../../Api/transaction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Person3Icon from '@mui/icons-material/Person3';
import ContactlessIcon from '@mui/icons-material/Contactless';
import CallIcon from '@mui/icons-material/Call';
import Loader from '../../Components/Loader/loader';
import { useNavigate } from 'react-router-dom';
function Dashboard() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
 const fetchAllStats = async()=>{
  setLoading(true);
  try {
    const response = await getAllStats()
    setStats(response.data)
  } catch (error) {
    enqueueSnackbar({message: error.response.data.message, variant:'error'})
  } finally {
    setTimeout(()=>{
      setLoading(false);
    }, 250)
  }
 }

  useEffect(()=>{
     fetchAllStats()
  },[])
  
  return (
    <Box sx={{width: {md: 'calc(100% - 240px)',sm: 'calc(100% - 240px)',xs: '100%',lg: 'calc(100% - 240px)',},
    height: 'auto', ml: {md: '240px',sm: '240px',xs: '0px',lg: '240px',},}} >
      <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea onClick={()=> navigate('/superadmin/schools')}>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Schools</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{stats?.totalSchools}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <SchoolIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea onClick={()=> navigate('/superadmin/users')}>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Users</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{stats?.totalUsers}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <AccountCircleIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea onClick={()=> navigate('/superadmin/schools')}>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Students</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{stats?.totalStudents}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <Person3Icon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea onClick={()=> navigate('/superadmin/devices')}>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>Devices</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{stats?.deviceCount}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <ContactlessIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>

       {stats?.stats?.map((item, index)=>{
        return(
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <CardActionArea onClick={()=> navigate('/superadmin/transactions')}>
            <Card sx={{ minWidth: 255, boxShadow: 3, height: "150px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: '5px solid #3f51b5', position: 'relative' }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ position: 'absolute', top: 0, left: 0, pl:2, pt:2 }}>{item._id === 'call' ? 'Call' : 'Recharge'}</Typography>
                <Typography variant="body2" sx={{ fontSize: 30, position: 'absolute', bottom: 0, left: 0, p:4 }}>{item.count}</Typography>
              </CardContent>
              <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, m: 3, '& .MuiSvgIcon-root': { fontSize: 40 } }} aria-label="edit">
                <CallIcon />
              </IconButton>
            </Card>
          </CardActionArea>
        </Grid>
         )
        })}

      </Grid>
    </Box>
    <Loader loading={loading} />
    </Box >
  )
}

export default Dashboard
