import './App.css';
import LoginForm from './Components/Login/login';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import SuperAdminDashboard from './pages/SuperAdmin/superAdminDashboard';
import SchoolAdminDashboard from './pages/SchoolAdmin/SchoolAdminDashboard';
import Protected from './Components/AuthProtection/authProtection';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/*" element={<Protected />}>
            <Route path="schooladmin/*" element={<SchoolAdminDashboard />} />
            <Route path="superadmin/*" element={<SuperAdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
