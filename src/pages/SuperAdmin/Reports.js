import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getFilteredTransactions } from '../../Api/reports';

function Reports() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilter = async () => {
        setLoading(true);
        try {
            const params = { startDate, endDate };
            const response = await getFilteredTransactions(params);
            setTransactions(response.data);
        } catch (error) {
            enqueueSnackbar({ message: 'Could not fetch transactions', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Date', 'Student', 'Type', 'Amount']],
            body: transactions.map(t => [new Date(t.createdAt).toLocaleDateString(), t.student?.name, t.transactionType, t.amount])
        });
        doc.save('transactions.pdf');
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(transactions.map(t => ({
            Date: new Date(t.createdAt).toLocaleDateString(),
            Student: t.student?.name,
            Type: t.transactionType,
            Amount: t.amount
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");
        XLSX.writeFile(wb, "transactions.xlsx");
    };
    
    const columns = [
        { field: 'createdAt', headerName: 'Date', flex: 1, valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString() },
        { field: 'student', headerName: 'Student', flex: 1, valueGetter: (params) => params.row.student?.name },
        { field: 'transactionType', headerName: 'Type', flex: 1 },
        { field: 'amount', headerName: 'Amount', flex: 1 },
    ];

    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <Box sx={{
                width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%', lg: 'calc(100% - 240px)', },
                minHeight: '90vh', ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px', }, backgroundColor: "#f7f7f8", p: 3
            }}>
                <Typography variant="h4" gutterBottom>Reports</Typography>
                <Card>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" onClick={handleFilter}>Filter</Button>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button variant="outlined" onClick={exportToPDF}>Export to PDF</Button>
                            <Button variant="outlined" onClick={exportToExcel}>Export to Excel</Button>
                        </Box>
                        <Box style={{ height: 400, width: '100%', marginTop: 16 }}>
                            <DataGrid
                                rows={transactions}
                                columns={columns}
                                loading={loading}
                                getRowId={(row) => row._id}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </SnackbarProvider>
    );
}

export default Reports;
