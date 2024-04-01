import { Box, Button, Typography , IconButton} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getContactByStudent } from '../../../Api/student';
import { DataGrid } from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import ContactForm from './element/CreateContactDialog';
import { createContact, deleteContact, updateContact } from '../../../Api/contact';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from '../../Loader/loader';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RechargeDialog from '../Recharge/RechargeDialog';
import { createTransactions } from '../../../Api/transaction';
import { updateStudent } from '../../../Api/student';
import { enqueueSnackbar } from 'notistack';

function ContactView({setVisible, selectedRow, fetchStudents}) {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState({})
    const [loading, setLoading] = useState(false)
    const [rechargeDialog, setRechargeDialog] = useState(false)

    const fetchContactByStudent =async()=>{
        setLoading(true);
        try {
            const response = await getContactByStudent(selectedRow._id)
            setRows(response.data)
        } catch (error) {
            enqueueSnackbar({message : error.response.data.message, variant:'error'})
        } finally{
            setTimeout(()=>{
                setLoading(false);
            }, 250)
        }
    }
    useEffect(()=>{
       fetchContactByStudent()
    }, [])

    const columns =[
        { field: "name", headerName: "Name", flex: 1 },
        { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
        { field: "relation", headerName: "Relation", flex: 1 },
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
                        setSelectedContact(params.row)
                        setLoading(false);
                        setOpen(true)
                    }, 250)
                  }}
                />
                </IconButton>
        
              
                  <IconButton>
                <DeleteIcon
                  style={{ cursor: "pointer", color: "red"}}
                  onClick={() => handleDelete(params.row)}
                />
                </IconButton>
               </Box>
            ),
          },
    ]

    const onSubmit =async(data)=>{
        setLoading(true);
        let updated = {
            ...data,
            student : selectedRow._id
        }
        try {
            if (selectedContact?._id) {
                const response = await updateContact(selectedContact._id, data)
            }else{
            const response = await createContact(updated)
            }
        } catch (error) {
            enqueueSnackbar({message: error.response.data.message, variant:'error'})
        } finally{
            setTimeout(()=>{
                fetchContactByStudent()
                setSelectedContact({})
                setLoading(false)
            }, 250)
        }
    }

    const handleDelete =async(data)=>{
        setLoading(true);
        try {
            const response = await deleteContact(data._id)
            enqueueSnackbar({message: 'Contact Deleted' , variant:'success'})
        } catch (error) {
            enqueueSnackbar({message : error.response.data.message, variant: 'error'})
        } finally{
            setTimeout(()=>{
                fetchContactByStudent()
               setLoading(false)
            }, 250)
        }
    }

    const onRechargeSubmit =async(data)=>{
        let updatedStudent = {
            ...selectedRow,
            balance : Number(selectedRow.balance) + Number(data.amount)
        }
        let transactions = {
            transactionType : 'recharge',
            amount : data.amount,
            student : selectedRow._id
        }
        try {
            const response = await updateStudent(selectedRow._id, updatedStudent)
            const transactionResponse = await createTransactions(transactions)
        } catch (error) {
            enqueueSnackbar({message:error.response.data.message, variant:'success'})
        } finally{
            fetchStudents()
            setVisible(false)
        }
    }
  return (
    <Box>
      <Box sx={{display:'flex', justifyContent:'space-between', mb:1}}>
           <Box sx={{display: {lg:'flex' , md:'flex'}, justifyContent:'center', alignContent:'center' , alignItems:'center', m:1}}>
               <ArrowBackIosNewIcon style={{cursor:'pointer', marginRight:'10px'}} onClick={()=>{ setVisible(false)}} />
               <Typography variant="h6" sx={{fontWeight:'bolder',fontFamily: 'Poppins, sans-serif' }} >Contact of {selectedRow?.name} </Typography>
           </Box>
            <Box sx={{mr:1}}>
            <Button variant='contained' sx={{mr:2}}
            onClick={()=>{
                setLoading(true);
                setTimeout(()=>{
                    setLoading(false)
                    setRechargeDialog(true)
                })
            }}
            >Recharge</Button>
            <Button variant='contained' onClick={()=>{
                setLoading(true);
                setTimeout(()=>{
                    setOpen(true);
                    setSelectedContact({})
                    setLoading(false)
                }, 250)
            }}>Create Contact</Button>
            </Box>
         </Box>
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
         />
       </Box>
       <Loader loading={loading} />
       <ContactForm 
        open={open}
        setOpen={setOpen}
        selectedContact={selectedContact}
        setSelectedContact={setSelectedContact}
        onSubmit={onSubmit}
        />
        <RechargeDialog open={rechargeDialog} setOpen={setRechargeDialog} onSubmit={onRechargeSubmit} />
    </Box>
  )
}

export default ContactView
