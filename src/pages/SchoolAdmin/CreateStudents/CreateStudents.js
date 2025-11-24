import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { FileUploadOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { usersData } from "../../../Api/auth";
import { createStudent, bulkCreateStudents } from "../../../Api/student";
import { SnackbarProvider, enqueueSnackbar  } from "notistack";
import AddIcon from '@mui/icons-material/Add';
import StudentForm from "../../../Components/Student/CreateStudentDialog/CreateStudentDialog";
import Loader from "../../../Components/Loader/loader";

const CreateStudents = () => {
  const [schoolId, setSchoolId] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const uploadInputRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const user = JSON.parse(localStorage.getItem('user'))


  const userData = async () => {
    try {
      const response = await usersData();
      setSchoolId(response.data.school);
    } catch (error) {
      enqueueSnackbar({message:error.message, variant:'error'})
    }
  };

  useEffect(() => {
    userData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      // Handle CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvString = event.target.result;
        parseCsvData(csvString);
      };
      reader.readAsText(file);
    } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
      // Handle Excel file
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        const workbook = XLSX.read(result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        parseCsvData(csvData);
      };
      reader.readAsBinaryString(file);
    } else {
      enqueueSnackbar({ message: 'Please upload a CSV or Excel file', variant: 'error' });
    }
  };

  const parseCsvData = (csvString) => {
    setLoading(true);
    Papa.parse(csvString, {
      complete: (result) => {
        if (!result.data || result.data.length === 0) {
          enqueueSnackbar({ message: 'No data found in file', variant: 'error' });
          setLoading(false);
          return;
        }
        
        // Normalize the data by trimming keys and values
        const normalizedData = result.data.map((row) => {
          const normalizedRow = {};
          Object.keys(row).forEach((key) => {
            const trimmedKey = key.trim();
            const value = row[key];
            normalizedRow[trimmedKey] = typeof value === 'string' ? value.trim() : value;
          });
          return normalizedRow;
        });

        const processedRows = normalizedData.map((row, index) => {
          // Extract contacts dynamically
          const contacts = [];
          let contactIndex = 1;
          
          while (row[`contact${contactIndex}Name`] || row[`contact${contactIndex}Phone`]) {
            const contactName = row[`contact${contactIndex}Name`];
            const contactPhone = row[`contact${contactIndex}Phone`];
            const contactRelation = row[`contact${contactIndex}Relation`] || 'Parent';
            
            // Check if contact has valid data (not empty after trimming)
            if (contactName && contactPhone && contactName !== '' && contactPhone !== '') {
              contacts.push({
                name: contactName.trim(),
                phoneNumber: contactPhone.trim(),
                relation: contactRelation.trim() || 'Parent'
              });
            }
            contactIndex++;
          }

          // Extract recharge data
          const rechargeAmount = row.rechargeAmount && row.rechargeAmount !== '' 
            ? parseFloat(row.rechargeAmount) 
            : null;
          const rechargeType = row.rechargeType && row.rechargeType !== ''
            ? row.rechargeType.trim().toLowerCase() 
            : null;

          return {
            id: `row_${index + 1}`,
            name: row.name ? row.name.trim() : '',
            cardID: row.cardID ? row.cardID.trim() : '',
            school: schoolId,
            balance: 0,
            contacts: contacts,
            recharge: rechargeAmount && !isNaN(rechargeAmount) ? {
              amount: rechargeAmount,
              rechargeType: rechargeType || 'talktime'
            } : null,
            // For display purposes
            contactsDisplay: contacts.length > 0 
              ? contacts.map(c => `${c.name} (${c.relation})`).join(', ')
              : 'No contacts',
            rechargeDisplay: rechargeAmount && !isNaN(rechargeAmount)
              ? `${rechargeAmount} (${rechargeType || 'talktime'})`
              : 'No recharge'
          };
        });
  
        // Filter out rows with missing required fields
        const filteredRows = processedRows.filter(
          (row) => row.name && row.cardID && row.name !== '' && row.cardID !== ''
        );

        if (filteredRows.length === 0) {
          enqueueSnackbar({ message: 'No valid rows found. Please check that name and cardID columns are present.', variant: 'error' });
        } else {
          setCsvData(filteredRows);
        }
        setLoading(false);
      },
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // Trim headers during parsing
    });
  };

  const handleUploadClick = () => {
    setLoading(true);
    setTimeout(()=>{
      uploadInputRef.current.click();
      setLoading(false)
    }, 250)
  };

  const handleDataSubmit = async () => {
    setLoading(true);
    try {
      // Structure data for bulk API
      const studentsData = csvData.map((row) => {
        const { id, school, contactsDisplay, rechargeDisplay, ...studentData } = row;
        return {
          name: studentData.name,
          cardID: studentData.cardID,
          school: schoolId,
          balance: studentData.balance || 0,
          contacts: studentData.contacts || [],
          recharge: studentData.recharge || null
        };
      });

      const response = await bulkCreateStudents(studentsData);
      
      if (response.data && response.data.data) {
        const { summary, failed } = response.data.data;
        
        if (summary.successCount > 0) {
          enqueueSnackbar({
            message: `Successfully created ${summary.successCount} student(s)`,
            variant: 'success'
          });
        }
        
        if (summary.failureCount > 0) {
          enqueueSnackbar({
            message: `Failed to create ${summary.failureCount} student(s). Check console for details.`,
            variant: 'warning'
          });
          console.log('Failed students:', failed);
        }
        
        // Clear data if all successful, otherwise keep for review
        if (summary.failureCount === 0) {
          setCsvData([]);
        }
      } else {
        enqueueSnackbar({ message: 'Bulk upload completed', variant: 'success' });
        setCsvData([]);
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      enqueueSnackbar({
        message: error.response?.data?.message || error.message || 'Failed to create students',
        variant: 'error'
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 250);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'cardID', headerName: 'Card ID', flex: 1, minWidth: 120 },
    { 
      field: 'contactsDisplay', 
      headerName: 'Contacts', 
      flex: 1, 
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {params.value || 'No contacts'}
        </Typography>
      )
    },
    { 
      field: 'rechargeDisplay', 
      headerName: 'Recharge', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {params.value || 'No recharge'}
        </Typography>
      )
    },
  ];
  const rows = csvData;
  const onSubmit = async(data)=>{
    setLoading(true);
    setOpen(false)
    let students = {
      ...data,
      balance : data.balance ? data.balance : 0,
      school : user.school
    }
    try {
      await createStudent(students)
      enqueueSnackbar({message:'Student Created', variant:'success'})
    } catch (error) {
      enqueueSnackbar({message:  error.response.data.message, variant:'error'})
    } finally{
      setTimeout(()=>{
          setLoading(false)
      }, 250)
    }
  }
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
    <Box
        sx={{width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%',   lg: 'calc(100% - 240px)', },
          minHeight: '90vh', ml: { md: '240px',sm: '240px',xs: '0px',lg: '240px',},backgroundColor: "#f7f7f8",p: 3}}>
      <Box sx={{ display: "flex", justifyContent: {lg :"flex-end", md:'flex-end'}, mb:3, width:'100%' }}>
          <Box  sx={{gap:2, display:'flex'}} >
          <input  type="file" ref={uploadInputRef} onChange={handleFileUpload} accept=".xls, .xlsx, .csv" style={{ display: "none" }} />
      <Button onClick={handleUploadClick} variant="contained" color="primary" startIcon={<FileUploadOutlined />}>
        Upload File (CSV/Excel)
      </Button>
          <Button variant="contained" onClick={() => setOpen(true)} sx={{fontFamily: 'Poppins, sans-serif', ml:2}} startIcon={<AddIcon />}>
            Add Student
          </Button>
          </Box>
        </Box>
      
      {loading && <CircularProgress />}
      <div style={{ height: 400, width: "100%" , overflowX: "auto"}}>
        {csvData.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        ) : (
          <Typography variant="h6">No data to display</Typography>
        )}
      </div>
      <Button
        onClick={handleDataSubmit}
        variant="contained"
        color="primary"
        disabled={csvData.length === 0}
      >
        Submit
      </Button>

    
      <StudentForm open={open} setOpen={setOpen} schoolId={schoolId} onSubmit={onSubmit} />
      <Loader loading={loading} />
    </Box>
    </SnackbarProvider>
  );
};

export default CreateStudents;
