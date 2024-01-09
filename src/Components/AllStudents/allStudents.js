import React, { useEffect, useState } from 'react';
import { Box, TextField, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getStudents } from '../../Api/student';
import { getSchoolById, getSchools } from '../../Api/schools';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton} from '@mui/material';
import Loader from '../Loader/loader';

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [copyStudents, setCopyStudents] = useState([])
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [loading, setLoading] = useState(false)

  const fetchStudents = async () => {
    setLoading(true)
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
                schoolName: schoolInfo.name, 
                balance: student.balance || 0,
              };
            })
          );
          setTimeout(()=>{
          setStudents(studentsWithSchools);
          setCopyStudents(studentsWithSchools)
          setLoading(false)
        },250)
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
 const handleRecharge =(id)=>{
console.log(id);
 }
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'rfidCardId', headerName: 'RFID Card ID', flex: 1 },
    { field: 'balance', headerName: 'Balance', flex: 1 },
    { field: 'schoolName', headerName: 'School Name', flex: 1 },
    {field: 'edit',headerName: 'Recharge',flex: 0.5,renderCell: (params) => (
        <IconButton onClick={() => handleRecharge(params.row._id)}>
          <EditIcon  />
        </IconButton>
      ),
    },
  ];
  
  const handleSchoolChange = (event) => {
    setLoading(true)
    setSelectedSchool(event.target.value);
    const filtered = copyStudents.filter((item)=> item.schoolName === event.target.value)
    setTimeout(()=>{
      setStudents(filtered)
      setLoading(false)
    },250)
  };
  return (
    <Box sx={{ width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)"},
        height: "auto", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" }}}>
      <Box sx={{ p: 3 }}>
        <Box sx={{display:'flex', alignContent:'center', alignItems:'center'}} >
          <Typography variant='h6' sx={{fontFamily: 'Poppins, sans-serif', fontWeight:'bolder'}}>Students</Typography>
        <Box sx={{  display: "flex", justifyContent: "flex-end", mb: 3,width: "100%",gap:2}}>
          <FormControl sx={{width:"20%"}}>
            <InputLabel id="demo-simple-select-label">Select School</InputLabel>
            <Select  labelId="demo-simple-select-label"  id="demo-simple-select"
              label="Select School"  value={selectedSchool} onChange={handleSchoolChange}>
              {schools.map((school) => (
                <MenuItem key={school._id} value={school.name}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Search Student"  sx={{ mr: 2 }} onChange={(e) => functionChange(e)}/>
        </Box>
        </Box>
        <Box style={{ height: "auto", width: "100%" }}>
          <DataGrid
            rows={students}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            sx={{fontFamily: 'Poppins, sans-serif'}}
          />
        </Box>
      </Box>
      <Loader loading={loading} />
    </Box>
  );
}

export default AllStudents;
