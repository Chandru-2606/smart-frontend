// SuperAdminDashboard.js
import React from 'react';
import Dashboard from './dashboard';
import Navbar from '../../Components/navBar/navBar';
import { Routes, Route } from 'react-router-dom';
import { DashboardOutlined } from '@mui/icons-material';
import UserList from '../../Components/Users/users';
import SchoolList from '../../Components/Schools/schools';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AllStudents from '../../Components/AllStudents/allStudents';
function SuperAdminDashboard() {
  const SuperAdminRoute = [
    { name: "Dashboard", link: "/", icon: <DashboardOutlined />, component: <Dashboard /> },
    { name: "Users", link: "users", icon: <PeopleAltIcon />, component: <UserList /> },
    { name: "Students", link: "students", icon: <SchoolIcon />, component: <AllStudents /> },
    { name: "Schools", link: "schools", icon: <SchoolIcon />, component: <SchoolList /> },
  ];

  return (
    <>
      <Navbar data={SuperAdminRoute} />
      <Routes>
        {SuperAdminRoute.map((route, index) => (
          <Route key={index} path={route.link} element={route.component} />
        ))}
      </Routes>
    </>
  );
}

export default SuperAdminDashboard;
