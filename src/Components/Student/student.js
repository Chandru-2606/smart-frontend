import React, { useEffect, useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import {  deleteStudent } from "../../Api/student";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StudentForm from "./subComponent/studentsDetail";
import ContactsIcon from "@mui/icons-material/Contacts";
import ContactDisplay from "./Contact/subComponent/contactDisplay";
import CreateContacts from "./Contact/contact";
import { createContact, getContacts } from "../../Api/contact";
import { tokenValidation } from "../../Api/auth";
import { getContactByStudent } from "../../Api/student";
import { getStudentBySchool } from "../../Api/schools";
import { SnackbarProvider, enqueueSnackbar  } from "notistack";
import { deleteContact } from "../../Api/contact";
import Loader from "../Loader/loader";

export default function StudentFormDialog() {
  const [schoolId, setSchoolId] = useState('')
  const [studentsData, setStudentsData] = useState([]);
  const [copyStudent, setCopyStudent] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedStudentId, setSelectedStudentId]= useState('')
  const [open, setOpen] = React.useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [loading, setLoading] = useState(false)

  const AllStudents = async()=>{
    setLoading(true)
    try{
      const response = await tokenValidation()
      setSchoolId(response.data.school)
      const responseStudent = await getStudentBySchool(response.data.school)
      setTimeout(()=>{
        setStudentsData(responseStudent.data)
        setCopyStudent(responseStudent.data)
        setLoading(false)
      },250)
    }catch(error){
      enqueueSnackbar({message:error.message, variant:'error'})
    }
  }
  useEffect(() => {
    AllStudents()
  }, []);

  const AllContacts = async ()=>{
    try {
      const response = await getContacts()
      setContacts(response.data)
    } catch (error) {
       enqueueSnackbar({message: error.message, variant:'error'})
    }
  }

  useEffect(()=>{
    AllContacts()
  },[])

  useEffect(() => {
    const filtered =studentsData && studentsData.filter((item) => {
        return item._id === selectedId;
      });
    setSelectedStudent(filtered);
  }, [selectedId]);

const createContacts =(id)=>{
  setSelectedStudentId(id)
  setIsFormOpen(true);
}
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "rfidCardId", headerName: "RFID Card ID", flex: 1 },
    { field: "balance", headerName: "Balance", flex: 1 },
    {field: "actions", headerName: "Actions",flex: 1,
      renderCell: (params) => (
        <>
          <EditIcon style={{ cursor: "pointer", marginRight: 8 }}
            onClick={() => {
              setSelectedId(params?.row?._id);
              setOpen(true) }}/>
          <DeleteIcon
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(params.row._id)}
          />
          <ContactsIcon   style={{ cursor: 'pointer', marginLeft:'10px' }} onClick={() => createContacts(params.row._id)}/>
        </>
      ),
    },
  ];
  const handleRowDoubleClick = async(params) => {
    try{
      const response = await getContactByStudent(params.row._id)
       setSelectedContact(response.data);
       setContactOpen(true);
    }catch(error){
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const filtered = contacts.filter((item)=> item.student === id)
      if(filtered.length>0){
        filtered.map(async(item)=>{
          const response = await deleteContact(item._id)
        })
      }
      const studentResponse = await deleteStudent(id);
      if (studentResponse.status === 200) {
        enqueueSnackbar({ message: 'Student Deleted', variant: 'success' });
      }
      AllStudents();
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };
  
  

  const handleFormSubmit = async (data) => {
    try {
      const updatedContact = { ...data, student: selectedStudentId };
      const response = await createContact(updatedContact);
      if (response.status === 201) {
        enqueueSnackbar({ message: "Contact Created", variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };
  
  const functionChange =(e)=>{
    const filtered = copyStudent && copyStudent.filter((item)=>{
      return (((item.name).toLowerCase()).includes(e.target.value.toLowerCase())) ||
      (((item.rfidCardId).toLowerCase()).includes(e.target.value.toLowerCase())) 
    })
    setStudentsData(filtered)
  }
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
    <Box
      sx={{ width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)",xs: "100%",lg: "calc(100% - 240px)",},
        height: "auto",ml: {md: "240px",sm: "240px",xs: "0px",lg: "240px",},}}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb:3, width:'100%' }}>
          <Box>
            <TextField label='Search Student' sx={{mr:2}} onChange={(e)=> functionChange(e)} />
          </Box>
        </Box>
        <StudentForm open={open} setOpen={setOpen} isEditMode={true} 
          initialValues={selectedStudent[0]} AllStudents={AllStudents} />
        <Box style={{ height: "auto", width: "100%" }}>
          <DataGrid
            rows={studentsData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            getRowId={(row) => row._id}
            onRowDoubleClick={handleRowDoubleClick}
            sx={{fontFamily: 'Poppins, sans-serif'}}
          />
          <ContactDisplay open={contactOpen} onClose={() => setContactOpen(false)} 
          contactData={selectedContact} AllStudents={AllStudents} setLoading={setLoading}/>
          <CreateContacts open={isFormOpen} onClose={()=>setIsFormOpen(false)} onSubmit={handleFormSubmit} schoolId={schoolId} />
        </Box>
      </Box>
      <Loader loading={loading} />
    </Box>
    </SnackbarProvider>
  );
}
