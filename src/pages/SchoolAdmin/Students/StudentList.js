import React, { useEffect, useState, useRef } from 'react'
import { getStudentBySchool } from '../../../Api/schools';
import { deleteStudent, updateStudent, updateCardValidity } from '../../../Api/student';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { grey } from "@mui/material/colors";
import { Box, Typography, TextField, IconButton, Slide, Switch } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from '../../../Components/Loader/loader';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ContactView from '../../../Components/Student/ContactView/ContactView';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import StudentDetails from '../../../Components/Student/CreateStudentDialog/CreateStudentDialog';
import ConfirmationDialog from '../../../Components/ConfirmationDialog/ConfirmationDialog';


function StudentList({selectedSchooldata, setSchoolVisible}) {
  const [rows, setRows] = useState([]);
  const [copyRows, setCopyRows] = useState([])
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [visible, setVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState('')
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  

  const fetchStudents = async()=>{
    try {
      const response = await getStudentBySchool(selectedSchooldata ? selectedSchooldata?._id :user.school)
      setRows(response.data);
      setCopyRows(response.data);
    } catch (error) {
     enqueueSnackbar({message: error.response.data.message, variant:'error'})
    }
  }

  useEffect(()=>{
      fetchStudents();
  }, [])
 
  const handleVisible =(data)=>{
    setSelectedRow(data)
    setVisible(true)
  }

  const handleCardValidityChange = async (id, newIsValid) => {
    try {
      await updateCardValidity(id, newIsValid);
      enqueueSnackbar({ message: 'Card validity updated', variant: 'success' });
      fetchStudents(); // Refresh the list
    } catch (error) {
      enqueueSnackbar({ message: error.response.data.message, variant: 'error' });
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { 
      field: "cardID", 
      headerName: "CardID", 
      flex: 1, 
      renderCell: (params) => params.row.cardID ? params.row.cardID : "Not Added", 
    },
    { field: "balance", headerName: "Balance", flex: 1 },
    {
      field: "isCardValid",
      headerName: "Card Valid",
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.isCardValid}
          onChange={(e) => handleCardValidityChange(params.row._id, e.target.checked)}
        />
      ),
    },
    {
      field: "activePack",
      headerName: "Active Pack",
      flex: 1,
      renderCell: (params) => params.row.activePack || "None",
    },
    {
      field: "packValidity",
      headerName: "Pack Validity",
      flex: 1,
      renderCell: (params) => params.row.packValidity ? new Date(params.row.packValidity).toLocaleDateString() : "N/A",
    },
    { 
      field: "actions", 
      headerName: "Actions", 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ gap: 2 }}>
          <IconButton>
          <EditIcon 
            style={{ cursor: "pointer"}}
            onClick={() => {
              setLoading(true);
              setTimeout(()=>{
                setOpen(true);
                setSelectedRow(params.row)
                setLoading(false)
              }, 250)
            }}
          />
          </IconButton>
  
        
            <IconButton>
          <DeleteIcon
            style={{ cursor: "pointer", color: "red"}}
            onClick={() => {
              setStudentToDelete(params.row);
              setDeleteDialogOpen(true);
            }}
          />
          </IconButton>
          <IconButton>
            <ArrowRightAltIcon style={{color:'blue'}} 
            onClick={()=>{
              handleVisible(params.row)
            }}
            />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!studentToDelete) return;
    
    setLoading(true);
    setDeleteDialogOpen(false);
    try {
      const studentResponse = await deleteStudent(studentToDelete._id);
      if (studentResponse.status === 204) {
        enqueueSnackbar({ message: 'Student Deleted', variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar({ message: error.response?.data?.message || 'Failed to delete student', variant: 'error' });
    } finally {
      setTimeout(() => {
        setLoading(false);
        fetchStudents();
        setStudentToDelete(null);
      }, 250);
    }
  };


  const onSearch =(e)=>{
    const filtered = copyRows && copyRows.filter((item)=>{
      return (((item.name).toLowerCase()).includes(e.target.value.toLowerCase())) ||
      (((item.cardID).toLowerCase()).includes(e.target.value.toLowerCase())) 
    })
    setRows(filtered)
  }

  const handleRowDoubleClick = ()=>{

  }

  const onSubmit = async(data)=>{
    setLoading(true);
    try {
      const response = await updateStudent(selectedRow._id, data)
      enqueueSnackbar({message: 'Student Updated', variant:'success'})
    } catch (error) {
      enqueueSnackbar({message: error.response.data.message, variant:'error'})
    } finally{
      setTimeout(()=>{
        fetchStudents()
        setOpen(false)
        setLoading(false)
      }, 250)
    }
  }
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
    <Box
       sx={ selectedSchooldata ? {} :{width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%',   lg: 'calc(100% - 240px)', },
         minHeight: '90vh', ml: { md: '240px',sm: '240px',xs: '0px',lg: '240px',},backgroundColor: "#f7f7f8",p: 3}}>
        <>
        {!visible && 
         <Box sx={{display:{lg: 'flex', md:'flex', sm:'flex'}, justifyContent:'space-between', mb:1, m:1}}>
            <Box sx={{display: 'flex', alignItems:'center'}}>
             {selectedSchooldata?._id &&
              <ArrowBackIosNewIcon style={{cursor:'pointer', marginRight:'10px'}} onClick={()=>{ setSchoolVisible(false)}} />
            }
              <Typography variant="h6" sx={{fontWeight:'bolder',fontFamily: 'Poppins, sans-serif' }} >Students { selectedSchooldata ? `of ${selectedSchooldata.name}` : ''}</Typography>
           </Box>
           <TextField label='Search Student'  onChange={(e)=> onSearch(e)} />
         </Box> }
         <Slide direction="left" in={!visible} container={containerRef.current} mountOnEnter unmountOnExit>
     <Box style={{ height: "auto", width: "100%" , overflowX: "auto"}}>
         <DataGrid
           rows={rows}
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
           onRowDoubleClick={handleRowDoubleClick}
         />
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
                  <ContactView setVisible={setVisible} selectedRow={selectedRow} fetchStudents={fetchStudents} />
                </Box>
              </Slide>
       </>
       <StudentDetails open={open} setOpen={setOpen} onSubmit={onSubmit} initialValues={selectedRow} />
       <ConfirmationDialog
         open={deleteDialogOpen}
         onClose={() => {
          setDeleteDialogOpen(false);
          setStudentToDelete(null);
         }}
         onConfirm={handleDelete}
         title="Confirm Delete Student"
         message={`Are you sure you want to delete student "${studentToDelete?.name}"? This action cannot be undone.`}
         confirmText="Delete"
         cancelText="Cancel"
         type="delete"
       />
       <Loader loading={loading} />
       </Box>
       </SnackbarProvider>
  )
}

export default StudentList;
