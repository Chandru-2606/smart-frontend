// SuperAdminDashboard.js
import React from 'react';
import Dashboard from './dashboard';
import Navbar from '../../Components/navBar/navBar';
import { Routes, Route } from 'react-router-dom';
import { DashboardOutlined } from '@mui/icons-material';
import UserList from './Users/UsersList';
import SchoolList from './Schools/SchoolList';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DeviceList from './Devices/DeviceList';
import TabletAndroidIcon from '@mui/icons-material/TabletAndroid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Config from './Config/Config';
import Transactions from './Transactions/Transactions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Reports from './Reports';
import AssessmentIcon from '@mui/icons-material/Assessment';

function SuperAdminDashboard() {
  const SuperAdminRoute = [
    { name: "Dashboard", link: "/", icon: <DashboardOutlined />, component: <Dashboard /> },
    { name: "Users", link: "users", icon: <PeopleAltIcon />, component: <UserList /> },
    { name: "Schools", link: "schools", icon: <SchoolIcon />, component: <SchoolList /> },
    { name: "Devices", link: "devices", icon: <TabletAndroidIcon />, component: <DeviceList /> },
    { name: "Config", link: "config", icon: <AccountBalanceWalletIcon />, component: <Config /> },
    { name: "Transactions", link: "transactions", icon: <ReceiptLongIcon />, component: <Transactions /> },
    { name: "Reports", link: "reports", icon: <AssessmentIcon />, component: <Reports /> },
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
