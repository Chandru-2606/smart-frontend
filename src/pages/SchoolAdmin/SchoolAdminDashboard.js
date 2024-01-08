import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardOutlined } from '@mui/icons-material';
import Navbar from '../../Components/navBar/navBar';
import StudentFormDialog from '../../Components/Student/student';
import Recharge from '../../Components/Recharge/recharge';
import Dashboard from './dashboard';
import Transactions from '../../Components/Transactions/transactions';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CreateStudents from '../../Components/CreateStudents/createStudents';

function SchoolAdminDashboard() {
  const SchoolAdminRoute = [
    { name: "Dashboard", link: "/", icon: <DashboardOutlined />, component: <Dashboard /> },
    { name: "Create Students", link: "createStudents", icon: <CreditScoreIcon />, component: <CreateStudents /> },
    { name: "Students", link: "students", icon: <PersonOutlineIcon />, component: < StudentFormDialog/> },
    { name: "Recharge", link: "recharge", icon: <MonetizationOnIcon />, component: <Recharge /> },
    { name: "Transactions", link: "transactions", icon: <CreditScoreIcon />, component: <Transactions /> },
  ];
  return (
    <>
      <Navbar data={SchoolAdminRoute} />
      <Routes>
        {SchoolAdminRoute.map((route, index) => (
          <Route key={index} path={route.link} element={route.component} />
        ))}
      </Routes>
    </>
  );
}
export default SchoolAdminDashboard;
