import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardOutlined } from '@mui/icons-material';
import Navbar from '../../Components/navBar/navBar';
import StudentList from './Students/StudentList';
import Dashboard from './dashboard';
import Transactions from './Transactions/TransactionsList';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CreateStudents from './CreateStudents/CreateStudents';
import Recharge from './Recharge/Recharge';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';


function SchoolAdminDashboard() {
  const SchoolAdminRoute = [
    { name: "Dashboard", link: "/", icon: <DashboardOutlined />, component: <Dashboard /> },
    { name: "Create Students", link: "createStudents", icon: <PersonAddAltIcon />, component: <CreateStudents /> },
    { name: "Students", link: "students", icon: <PersonOutlineIcon />, component: < StudentList/> },
    { name: "Recharge", link: "recharge", icon: <CreditScoreIcon />, component: <Recharge /> },
    { name: "Transactions", link: "transactions", icon: <ReceiptLongIcon />, component: <Transactions /> },
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
