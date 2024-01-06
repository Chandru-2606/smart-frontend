import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { VerifyLogin } from '../../Api/auth';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Loader from '../Loader/loader';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import logo from '../../Images/logo.png'

function LoginForm() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await VerifyLogin(data);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/superadmin');
        console.log(response.data.user);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        enqueueSnackbar({ message: 'Logged In Successfully', variant: 'success' });
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } else {
        enqueueSnackbar({ message: 'Invalid credentials', variant: 'error' });
        setLoading(false);
      }
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
      setLoading(false);
    }
  };
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (isAuthenticated) {
    if (userRole === 'superadmin') {
      return <Navigate to="/superadmin" />;
    }
    if (userRole === 'schooladmin') {
      return <Navigate to="/schooladmin" />;
    }
    return <Navigate to="/404" />;
  }

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    background: "#dfc2f0",
  }}>
        
        <Box
          component="form"
          noValidate
          sx={{
            width: { md: '35%', sm: '50%', xs: '85%', lg: '30%' },
            height: { md: '80vh', sm: '80vh', xs: '80vh', lg: '80vh' },
            background: "white",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.5s",
            p:3
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <img src={logo} alt='logo' style={{width:'20%', height:'20%'}} />
          <Typography variant="h5" component="h2" sx={{ p: 1, fontFamily: 'Poppins, sans-serif' }}>
            Name of the School
          </Typography>
          <Typography variant="h5" component="h2" sx={{ p: 1, fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
            Welcome Back
          </Typography>
          <Box sx={{p:0,display:'flex', justifyContent:'center',alignItems:'center', flexDirection:'column', width:'100%'}}>
          
          <TextField
            {...register('username', {
              required: true,
            })}
            type="text"
            label="Username"
            error={!!errors.username}
            helperText={errors.username && 'Username is Required'}
            sx={{ mt:2,mb: 2, width: '80%', fontFamily: 'Poppins, sans-serif',}}
          />
          <TextField
            {...register('password', { required: true })}
            type="password"
            label="Password"
            error={!!errors.password}
            helperText={errors.password && 'Password is Required'}
            sx={{ mb: 2, width: '80%', fontFamily: 'Poppins, sans-serif',}}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt:2,mb: 2, width: '80%',fontFamily: 'Poppins, sans-serif', }}>
            Login
          </Button>
        </Box>

        <div style={{ fontSize: '12px', fontFamily: 'Poppins, sans-serif' , marginTop:'30px'}}>
          &copy; {new Date().getFullYear()} Name of the School. All rights reserved.
        </div>
        <Loader loading={loading} />
        </Box>
      </Box>
    </SnackbarProvider>
  );
}

export default LoginForm;
