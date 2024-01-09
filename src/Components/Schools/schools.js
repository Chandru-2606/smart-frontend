import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import SchoolFormDialog from './subComponent/schoolDialog';
import { getSchools, updateSchool, createSchool, deleteSchool } from '../../Api/schools';
import Loader from '../Loader/loader';
import { SnackbarProvider, enqueueSnackbar  } from "notistack";


const SchoolList = () => {
  const [schoolData, setSchoolData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isCreateMode, setCreateMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const {  reset } = useForm();

  const fetchSchools = async () => {
    setLoading(true)
    try {
      const response = await getSchools();
      setTimeout(()=>{
        setSchoolData(response.data);
        setLoading(false)
      },250)
    } catch (error) {
      enqueueSnackbar({message:error.message, variant:'error'})
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleEdit = (school) => {
    setSelectedSchool(school);
    setCreateMode(false);
    setDialogOpen(true);
  };

  const handleCreateSchool = () => {
    setSelectedSchool(null);
    setCreateMode(true);
    setDialogOpen(true);
    reset();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSchool(null);
  };

  const handleDelete = async (schoolId) => {
    try {
      const response = await deleteSchool(schoolId);
      if (response.status === 204) {
        enqueueSnackbar({message:'School Deleted', variant:'success'})
        fetchSchools();
      }
    } catch (error) {
      enqueueSnackbar({message:error.message, variant:'error'})
    }
  };

  const handleDialogSubmit = async (data) => {
    setLoading(true)
    try {
      if (isCreateMode) {
        const response = await createSchool(data);
        if (response.status === 201) {
          setTimeout(()=>{
            fetchSchools();
          },250)
          enqueueSnackbar({message:"School Created", variant:'success'})
        }
      } else {
        const response = await updateSchool(selectedSchool._id, data);
        if (response.status === 200) {
        enqueueSnackbar({message:'School Updated', variant:'success'})
        setTimeout(()=>{
          fetchSchools();
        },250)
        }
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar({message:error.message, variant:'error'})
    }
  };

  const columns = [
    { field: 'name', headerName: 'School Name', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row?._id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box sx={{ width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)"},
        height: "auto", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" }}}>
          <Box sx={{ p: 3, width:'100%' }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant='h6' sx={{ fontFamily: "Poppins, sans-serif", fontWeight:'bolder' }} >Schools</Typography>
              <Button variant="contained" sx={{ fontFamily: "Poppins, sans-serif" }}
                onClick={handleCreateSchool} >
                <AddIcon />
                Create School
              </Button>
            </Box>
            {dialogOpen && (
              <SchoolFormDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleDialogSubmit}
                isCreateMode={isCreateMode}
                selectedSchool={selectedSchool}
              />
            )}
              <DataGrid
                rows={schoolData}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row._id}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              />
          </Box>
        </Box>
        <Loader loading={loading} />
      </SnackbarProvider>
    </>
  );
};

export default SchoolList;
