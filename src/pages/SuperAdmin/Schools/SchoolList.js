import React, { useState, useEffect , useRef} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import SchoolForm from '../../../Components/School/CreateSchoolDialog'
import { getSchools, updateSchool, createSchool, deleteSchool } from '../../../Api/schools';
import Loader from '../../../Components/Loader/loader';
import { SnackbarProvider, enqueueSnackbar  } from "notistack";
import {Slide} from '@mui/material';
import { grey } from '@mui/material/colors';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import StudentList from '../../SchoolAdmin/Students/StudentList';
import ConfirmationDialog from '../../../Components/ConfirmationDialog/ConfirmationDialog';


const SchoolList = () => {
  const [schoolData, setSchoolData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isCreateMode, setCreateMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null);
  const [visible,setVisible] = useState(false)
  const [selectedSchooldata, setSelectedSchooldata] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);


  const fetchSchools = async () => {
    setLoading(true)
    try {
      const response = await getSchools();
      setSchoolData(response.data);
    } catch (error) {
      enqueueSnackbar({message:error.message, variant:'error'})
    } finally{
      setTimeout(()=>{
        setLoading(false)
      },250)
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  

  const handleCreateSchool = () => {
    setLoading(true);
    setTimeout(()=>{
      setSelectedSchool(null);
      setCreateMode(true);
      setDialogOpen(true);
      setLoading(false);
    })
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSchool(null);
  };

  const handleDelete = async () => {
    if (!schoolToDelete) return;
    
    setDeleteDialogOpen(false);
    try {
      const response = await deleteSchool(schoolToDelete._id);
      if (response.status === 204) {
        enqueueSnackbar({message:'School Deleted', variant:'success'})
        fetchSchools();
      }
    } catch (error) {
      enqueueSnackbar({message:error.response?.data?.message || 'Failed to delete school', variant:'error'})
    } finally {
      setSchoolToDelete(null);
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
      enqueueSnackbar({message:error.response.data.message, variant:'error'})
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
          <IconButton onClick={() => {
            setLoading(true);
            setTimeout(()=>{
              setSelectedSchool(params.row);
              setCreateMode(false);
              setDialogOpen(true);
              setLoading(false);
            }, 250)
          }}
           color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => {
            setSchoolToDelete(params.row);
            setDeleteDialogOpen(true);
          }} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton>
            <ArrowRightAltIcon style={{color:'blue'}} 
            onClick={()=>{
              setLoading(true);
              setTimeout(()=>{
                setVisible(!visible);
                setSelectedSchooldata(params.row)
                setLoading(false)
              }, 250)
            }}
            />
          </IconButton>
        </>
      ),
    },
  ];

  const handleRowDoubleClick = (event) => {
    setLoading(true);
    setTimeout(()=>{
      setVisible(!visible);
      setSelectedSchooldata(event.row)
      setLoading(false);
    }, 250)
  };

  return (
    <>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%',   lg: 'calc(100% - 240px)', },
          minHeight: '90vh', ml: { md: '240px',sm: '240px',xs: '0px',lg: '240px',},backgroundColor: "#f7f7f8",p: 3}}>
          <Box sx={{  width: "100%" }}>
            <Box ref={containerRef} overflow={"hidden"} p={0.5}>
              <Slide
                in={!visible}
                direction={"left"}
                container={containerRef.current}
                mountOnEnter
                unmountOnExit
                style={{ transitionDelay: 150 }}
              >
                
                <Box  >
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, m:1 }} >
              <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bolder" }}>
                Schools
              </Typography>

              <Button variant="contained" sx={{ fontFamily: "Poppins, sans-serif" }} onClick={handleCreateSchool}>
                <AddIcon />
                Create School
              </Button>
            </Box>
            <Box style={{ height: "auto", width: "100%", overflowX: "auto" }}>

                  <DataGrid
                   rows={schoolData}
                   columns={columns} 
                   autoHeight
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                },
            }}
            sx={{fontFamily: 'Poppins, sans-serif',backgroundColor: grey[50],boxShadow:4, minWidth: 900, m:1}}
            pageSizeOptions={[5, 10, 15]}
                     getRowId={(row) => row._id} 
                    onRowDoubleClick={handleRowDoubleClick}/>
                    </Box>
                </Box>
              </Slide>
              <Slide
                in={visible}
                direction="left"
                container={containerRef.current}
                mountOnEnter
                unmountOnExit
                style={{ transitionDelay: 150 }}
              >
                <Box>
                  {/* < Students selectedSchooldata={selectedSchooldata}  /> */}
                  <StudentList selectedSchooldata={selectedSchooldata} setSchoolVisible={setVisible} />
                </Box>
              </Slide>
            </Box>
          </Box>
        </Box>
        
              <SchoolForm
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSubmit={handleDialogSubmit}
                isCreateMode={isCreateMode}
                selectedSchool={selectedSchool}
              />
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSchoolToDelete(null);
          }}
          onConfirm={handleDelete}
          title="Confirm Delete School"
          message={`Are you sure you want to delete school "${schoolToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="delete"
        />
        <Loader loading={loading} />
      </SnackbarProvider>
    </>
  );
};

export default SchoolList;
