// Protected.js
import React , {useEffect}from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { tokenValidation } from '../../Api/auth';
import { enqueueSnackbar } from 'notistack';
function Protected() {
  const location = useLocation();
  const userRole = localStorage.getItem('role');
  const isAuthenticated = localStorage.getItem('token');

   const tokenVerify =async()=>{
    try{
    const response = await tokenValidation()
    }catch(error){
      localStorage.clear()
      enqueueSnackbar({message:'Auth Failed. re-login'})
      return <Navigate to="/" />;
    }
   }
   useEffect(()=>{
    tokenVerify()
   },[])

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  const rolePath = `/${userRole.toLowerCase()}`;
  if (!location.pathname.startsWith(rolePath)) {
    return <Navigate to={rolePath} />;
  }
  return <Outlet />;
}

export default Protected;
