import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DevicesDialog from '../../../Components/Devices/DeviceDialog';
import { createDevice, getDevices, updateDevice, deleteDevice } from '../../../Api/devices'
import { getSchools } from '../../../Api/schools';
import Loader from '../../../Components/Loader/loader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import ConfirmationDialog from '../../../Components/ConfirmationDialog/ConfirmationDialog';


function DeviceList() {
  const [rows, setRows] = useState([])
  const [schools, setSchools] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState({})
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await getDevices();
      setRows(response.data)
    } catch (error) {
      enqueueSnackbar({ message: error.response.data.message, variant: 'error' });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 250)
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await getSchools();
      setSchools(response.data);
    } catch (error) {
      enqueueSnackbar({ message: error.response.data.message, variant: 'error' });
    }
  };

  useEffect(() => {
    fetchCards();
    fetchSchools();
  }, []);

  const handleDelete = async () => {
    if (!deviceToDelete) return;
    
    setLoading(true);
    setDeleteDialogOpen(false);
    try {
      const response = await deleteDevice(deviceToDelete._id)
      enqueueSnackbar({ message: 'Device Deleted', variant: 'success' });
    } catch (error) {
      enqueueSnackbar({ message: error.response?.data?.message || 'Failed to delete device', variant: 'error' });
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 250)
      fetchCards();
      setDeviceToDelete(null);
    }
  }

  const columns = [
    { field: "imeiNumber", headerName: "IMEI Number", flex: 1 },
    { field: "mobileNumber", headerName: "Mobile Number", flex: 1 },
    {
      field: "school",
      headerName: "School",
      flex: 1,
      valueGetter: (params) => params.row?.school?.name
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setSelectedCard(params.row);
              setEditMode(true)
              setOpen(true);
              setLoading(false)
            }, 250)

          }}
            color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => {
            setDeviceToDelete(params.row);
            setDeleteDialogOpen(true);
          }} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      if (editMode) {
        const response = await updateDevice(selectedCard._id, data)
        enqueueSnackbar({ message: 'Device Updated', variant: 'success' });
      } else {
        const response = await createDevice(data)
        enqueueSnackbar({ message: 'Devices Created', variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar({ message: error.response.data.message, variant: 'error' });
    } finally {
      setOpen(false);
      setTimeout(() => {
        fetchCards();
        setLoading(false);
      }, 250)

    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedCard(null);
    setOpen(true);
  };

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{
          width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%', lg: 'calc(100% - 240px)', },
          minHeight: '90vh', ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px', }, backgroundColor: "#f7f7f8", p: 3
        }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" >Devices List</Typography>
          <Button variant='contained' onClick={handleAddClick}>Add Device</Button>
        </Box>
        <Card>
          <CardContent>
            <Box style={{ height: "auto", width: "100%", overflowX: "auto" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 15]}
                disableSelectionOnClick
                getRowId={(row) => row._id}
              />
            </Box>
          </CardContent>
        </Card>
        <DevicesDialog schools={schools} open={open} setOpen={setOpen}
          onSubmit={handleSubmit}
          editMode={editMode}
          selectedCard={selectedCard} />
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeviceToDelete(null);
          }}
          onConfirm={handleDelete}
          title="Confirm Delete Device"
          message={`Are you sure you want to delete device with IMEI "${deviceToDelete?.imeiNumber}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="delete"
        />
        <Loader loading={loading} />
      </Box>
    </SnackbarProvider>
  );
}

export default DeviceList;
