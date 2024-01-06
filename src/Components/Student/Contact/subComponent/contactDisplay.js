import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineIcon';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { enqueueSnackbar } from 'notistack';
import { deleteContact, updateContact } from '../../../../Api/contact';

const ContactDisplay = ({ open, onClose, contactData, AllStudents, setLoading }) => {
  const [editedContacts, setEditedContacts] = useState({});
  const [selectedContactIds, setSelectedContactIds] = useState([]);

  useEffect(() => {
    const initialEditedContacts = {};
    contactData.forEach((contact) => {
      initialEditedContacts[contact._id] = contact;
    });
    setEditedContacts(initialEditedContacts);
  }, [contactData]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await deleteContact(id);
      enqueueSnackbar({ message: 'Contact Deleted', variant: 'success' });
      setTimeout(() => {
        onClose();
        AllStudents();
      }, 250);
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };

  const handleSaveChanges = async (id) => {
    try {
      const response = await updateContact(id, editedContacts[id]);
      onClose();
      AllStudents();
      setSelectedContactIds([]);
      enqueueSnackbar({ message: 'Contact Updated', variant: 'success' });
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };

  const handleChange = (event, contactId) => {
    const { name, value } = event.target;
    setEditedContacts((prevEditedContacts) => ({
      ...prevEditedContacts,
      [contactId]: { ...prevEditedContacts[contactId], [name]: value },
    }));
  };

  const handleEdit = (contactId) => {
    setSelectedContactIds((prevSelectedContactIds) => [...prevSelectedContactIds, contactId]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif' }}>Contact Details</DialogTitle>
      <DialogContent>
       {contactData.length > 0 ?  <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight:'bolder'}}>Name</TableCell>
                <TableCell sx={{textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight:'bolder'}}>Phone Number</TableCell>
                <TableCell sx={{textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight:'bolder'}}>Relation</TableCell>
                <TableCell sx={{textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight:'bolder'}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contactData.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>
                    <input
                      name="name"
                      value={
                        selectedContactIds.includes(contact._id)
                          ? editedContacts[contact._id]?.name || ''
                          : contact.name || ''
                      }
                      onChange={(event) => handleChange(event, contact._id)}
                      style={{ border: 'none', backgroundColor: 'white', height: '30px', fontSize: '16px', width: '100%', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}
                      disabled={!selectedContactIds.includes(contact._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      name="phoneNumber"
                      value={
                        selectedContactIds.includes(contact._id)
                          ? editedContacts[contact._id]?.phoneNumber || ''
                          : contact.phoneNumber || ''
                      }
                      onChange={(event) => handleChange(event, contact._id)}
                      disabled={!selectedContactIds.includes(contact._id)}
                      style={{ border: 'none', backgroundColor: 'white', height: '30px', fontSize: '16px', width: '100%', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}
                    />
                  </TableCell>
                  <TableCell >
                    <input
                      name="relation"
                      value={
                        selectedContactIds.includes(contact._id)
                          ? editedContacts[contact._id]?.relation || ''
                          : contact.relation || ''
                      }
                      onChange={(event) => handleChange(event, contact._id)}
                      disabled={!selectedContactIds.includes(contact._id)}
                      style={{ border: 'none', backgroundColor: 'white', height: '30px', fontSize: '16px', width: '100%', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}
                    />
                  </TableCell>
                  <TableCell sx={{display:'flex'}}>
                    {!selectedContactIds.includes(contact._id) && (
                      <IconButton onClick={() => handleEdit(contact._id)}>
                        <EditIcon sx={{ color: 'blue' }} />
                      </IconButton>
                    )}
                    {selectedContactIds.includes(contact._id) && (
                      <IconButton onClick={() => handleSaveChanges(contact._id)}>
                        <CheckCircleOutlineIcon sx={{ color: 'blue' }} />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDelete(contact._id)}>
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> : 
        <Typography variant='v6' fontWeight='bolder'>No Contacts Added</Typography>
        }
      </DialogContent>
    </Dialog>
  );
};

export default ContactDisplay;
