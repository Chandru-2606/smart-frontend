  import React, { useEffect, useRef, useState } from "react";
  import {
    Button,
    Typography,
    CircularProgress,
    Box,
    Modal,
    Fade,
  } from "@mui/material";
  import { FileUploadOutlined } from "@mui/icons-material";
  import { DataGrid } from "@mui/x-data-grid";
  import Papa from "papaparse";
  import * as XLSX from "xlsx";
  import { tokenValidation } from "../../Api/auth";
  import { createStudent } from "../../Api/student";
  import { SnackbarProvider, enqueueSnackbar  } from "notistack";
  import AddIcon from '@mui/icons-material/Add';
  import StudentForm from "../Student/subComponent/studentsDetail";
  const CreateStudents = () => {
    const [schoolId, setSchoolId] = useState("");
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(false);
    const uploadInputRef = useRef(null);
    const [successfulLeads, setSuccessfulLeads] = useState(0);
    const [open, setOpen] = React.useState(false);


    const userData = async () => {
      try {
        const response = await tokenValidation();
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
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result;
          const workbook = XLSX.read(result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          parseCsvData(csvData);
        };
        reader.readAsBinaryString(file);
      }
    };

    const parseCsvData = (csvString) => {
      setLoading(true);
      Papa.parse(csvString, {
        complete: (result) => {
          const processedRows = result.data.map((row, index) => ({
            id: `row_${index + 1}`,
            name: row.name,
            rfidCardId: row.rfidCardId,
            // balance: row.balance,
            school: schoolId,
          }));
    
          const filteredRows = processedRows.filter(
            (row) => Object.values(row).every((value) => value !== undefined && value !== null && value !== "")
          );
          setCsvData(filteredRows);
          setLoading(false);
        },
        header: true,
      });
    };

    const handleUploadClick = () => {
      uploadInputRef.current.click();
    };

    const handleDataSubmit = async () => {
      try {
        let successCount = 0;
        let failedLeads = [];

        for (let lead of csvData) {
          const { id, ...leadWithoutId } = lead;
          // leadWithoutId.balance = leadWithoutId.balance ? Number(leadWithoutId.balance) : Number(lead.balance) || 0;
          leadWithoutId.school = schoolId;
          try {
            const response = await createStudent(leadWithoutId);
            if (response.success) {
              successCount++;
            } else {
              failedLeads.push(lead);
            }
          } catch (error) {
            failedLeads.push(lead);
          }
          setSuccessfulLeads((prevCount) => prevCount + 1);
        }
        setCsvData([]); 
        enqueueSnackbar({message:'Students Created', variant:'success'})
      } catch (error) {
        enqueueSnackbar({message:error.message, variant:'error'})
      } 
    };

    const columns = [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'rfidCardId', headerName: 'RFID Card ID', flex: 1 },
    ];
    const rows = csvData;

    return (
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{
          width: {
            md: "calc(100% - 240px)",
            sm: "calc(100% - 240px)",
            xs: "100%",
            lg: "calc(100% - 240px)",
          },
          height: "auto",
          ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb:3, width:'100%' }}>
            <Box  sx={{gap:2}} >
            <input  type="file" ref={uploadInputRef} onChange={handleFileUpload} accept=".xls, .xlsx" style={{ display: "none" }} />
        <Button onClick={handleUploadClick} variant="contained" color="primary" startIcon={<FileUploadOutlined />}>
          Upload Excel
        </Button>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{fontFamily: 'Poppins, sans-serif', ml:2}} startIcon={<AddIcon />}>
              Add Student
            </Button>
            </Box>
          </Box>
        
        {loading && <CircularProgress />}
        <div style={{ height: 400, width: "100%" }}>
          {csvData.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
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

      
        <StudentForm open={open} setOpen={setOpen} schoolId={schoolId} />
      </Box>
      </SnackbarProvider>
    );
  };

  export default CreateStudents;
