import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, IconButton } from '@mui/material';
import { getSuperAdminSummary } from '../../Api/reports';
import Loader from '../../Components/Loader/loader';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            try {
                const response = await getSuperAdminSummary();
                setSummary(response.data);
            } catch (error) {
                enqueueSnackbar({ message: 'Could not fetch summary data', variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderLeft: `5px solid ${color}` }}>
            <CardActionArea>
                <CardContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" color="textSecondary">{title}</Typography>
                        <Typography variant="h4">{value}</Typography>
                    </Box>
                    <IconButton sx={{ color: color, backgroundColor: `${color}1a` }}>
                        {icon}
                    </IconButton>
                </CardContent>
            </CardActionArea>
        </Card>
    );

    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <Box sx={{
                width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%', lg: 'calc(100% - 240px)' },
                minHeight: '90vh', ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px' }, p: 3
            }}>
                <Typography variant="h4" gutterBottom>Super Admin Dashboard</Typography>
                {loading ? <Loader loading={loading} /> : (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Schools" value={summary?.totalSchools} icon={<SchoolIcon />} color="#2196f3" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Students" value={summary?.totalStudents} icon={<PeopleIcon />} color="#4caf50" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Transactions" value={summary?.totalTransactions} icon={<ReceiptIcon />} color="#ff9800" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard title="Total Recharge" value={`₹${summary?.totalRechargeAmount}`} icon={<MonetizationOnIcon />} color="#f44336" />
                        </Grid>
                    </Grid>
                )}
            </Box>
        </SnackbarProvider>
    );
}

export default Dashboard;
