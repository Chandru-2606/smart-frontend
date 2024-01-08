import React, { useEffect, useState } from 'react';
// import { Box, DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getStudents } from '../../Api/student';
import { getSchoolById, getSchools } from '../../Api/schools';

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [copyStudents, setCopyStudents] = useState([])
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');


  const fetchStudents = async () => {
    try {
      const studentsResponse = await getStudents();
      if (studentsResponse.data) {
        const schoolsResponse = await getSchools();
        if (schoolsResponse.status === 200) {
          setSchools(schoolsResponse.data);
          const studentsWithSchools = await Promise.all(
            studentsResponse.data.map(async (student) => {
              const schoolResponse = await getSchoolById(student.school);
              const schoolInfo = schoolResponse.data;
              return {
                ...student,
                schoolName: schoolInfo.name, // Flatten the school name
              };
            })
          );
  
          setStudents(studentsWithSchools);
          setCopyStudents(studentsWithSchools)
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    fetchStudents();
  }, []);

  const functionChange =(e)=>{
    const filtered = copyStudents && copyStudents.filter((item)=>{
      return (((item.name).toLowerCase()).includes(e.target.value.toLowerCase())) ||
      (((item.rfidCardId).toLowerCase()).includes(e.target.value.toLowerCase())) 
    })
    setStudents(filtered)
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'rfidCardId', headerName: 'RFID Card ID', flex: 1 },
    { field: 'balance', headerName: 'Balance', flex: 1 },
    { field: 'schoolName', headerName: 'School Name', flex: 1 },
  ];
  

  const handleSchoolChange = (event) => {
    setSelectedSchool(event.target.value);
    const filtered = copyStudents.filter((item)=> item.schoolName === event.target.value)
    setStudents(filtered)
  };
  return (
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
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 3,
            width: "100%",gap:2
          }}
        >
          <FormControl sx={{width:"20%"}}>
            <InputLabel id="demo-simple-select-label">Select School</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select School"
              value={selectedSchool}
              onChange={handleSchoolChange}
            >
              {schools.map((school) => (
                <MenuItem key={school._id} value={school.name}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Search Student"
            sx={{ mr: 2 }}
            onChange={(e) => functionChange(e)}
          />
        </Box>
        <Box style={{ height: "auto", width: "100%" }}>
          <DataGrid
            rows={students}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default AllStudents;
