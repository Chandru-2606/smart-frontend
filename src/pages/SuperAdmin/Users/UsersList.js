import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, MenuItem, Typography , Box} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsers, updateUsers, deleteUsers, createUsers} from "../../../Api/users";
import UserDialog from "../../../Components/Users/CreateUserDialog";
import Loader from "../../../Components/Loader/loader";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { grey } from "@mui/material/colors";


const UserList = () => {
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateMode, setCreateMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setRows(response.data);
    } catch (error) {
      enqueueSnackbar({ message: error.response.data.message, variant: 'error' });
    }finally{
      setTimeout(()=>{
        setLoading(false)
      }, 250)
    }
  };

 
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      const response = await deleteUsers(userId);
      if (response.status === 204) {
        enqueueSnackbar({message:'User Deleted', variant:'success'})
      }
    } catch (error) {
      enqueueSnackbar({ message: error.response.data.message, variant: 'error' });
    }finally{
      setTimeout(()=>{
        setLoading(false);
        fetchUsers();
      }, 250)
    }
  };

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const requestData = {
        username: data.username,
        password: data.password,
        role: data.role,
      };
      if (data.role === "schooladmin") {
        requestData.school = data.school;
      }
      if (!selectedUser?._id) {
        try {
          const response = await createUsers(requestData);
          if (response.status === 201) {
            fetchUsers()
            enqueueSnackbar({ message: "User Created", variant: "success" });
          }
        } catch (error) {
          enqueueSnackbar({ message: error.response.data.message, variant: 'error' });
        }
      } else {
        try {
          const response = await updateUsers(selectedUser?._id, requestData);
          if (response.status === 200) {
            fetchUsers()
            enqueueSnackbar({ message: "User Updated", variant: "success" });
          }
        } catch (error) {
          enqueueSnackbar({ message: error.response.data.message, variant: 'error' });
        } finally {
          setTimeout(()=>{
            setLoading(false);
            
          }, 250)
        }
      }
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: "error" });
    }finally{
      setOpen(false)
      setTimeout(()=>{
        setLoading(false)
      }, 250)
    }
  };

  const columns = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {field: "actions", headerName: "Actions",sortable: false,flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => {
            setLoading(true);
            setTimeout(()=>{
              setSelectedUser(params.row)
              setCreateMode(false)
              setOpen(true)
              setLoading(false)
            },250)
          }} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row?._id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Box
        sx={{width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%',   lg: 'calc(100% - 240px)', },
          minHeight: '90vh', ml: { md: '240px',sm: '240px',xs: '0px',lg: '240px',},backgroundColor: "#f7f7f8",p: 3}}>
            <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", p:1 }}>
            <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif" , fontWeight:'bolder'}}>Users</Typography>
              <Button
                variant="contained"
                onClick={()=>{
                  setLoading(true);
                  setTimeout(()=>{
                    setSelectedUser(null);
                    setCreateMode(true);
                    setOpen(true);
                    setLoading(false)
                  }, 250)
                }}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                <AddIcon />
                Create User
              </Button>
          </Box>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
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
            <UserDialog
                open={open}
                setOpen={setOpen}
                selectedUser={selectedUser}
                isCreateMode={isCreateMode}
                onSubmit={onSubmit}
              />
          <Loader loading={loading} />
        </Box>
      </SnackbarProvider>
    </>
  );
};

export default UserList;
