import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import {
  getUsers,
  updateUsers,
  deleteUsers,
  createUsers,
} from "../../Api/users";
import { getSchools } from "../../Api/schools";
import { Box } from "@mui/material";
import UserDialog from "./subComponent/userDialog";
import Loader from "../Loader/loader";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const UserList = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [schoolData, setSchoolData] = useState([]);
  const [isCreateMode, setCreateMode] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, setValue, getValues } = useForm();

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUserData(response.data);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await getSchools();
      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setSchoolData(response.data);
        }, 250);
      }
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: "error" });
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchSchools();
  }, []);

  const handleEdit = (user) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedUser(user);
      setCreateMode(false);
      setDialogOpen(true);
    }, 250);
  };

  const handleCreateUser = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedUser(null);
      setCreateMode(true);
      setDialogOpen(true);
      reset();
    }, 250);
  };

  const handleCloseDialog = () => {
    setLoading(true);
    setTimeout(() => {
      setDialogOpen(false);
      setSelectedUser(null);
    }, 250);
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      const response = await deleteUsers(userId);
      if (response.status === 204) {
        enqueueSnackbar({message:'Deleted', variant:'success'})
        setTimeout(() => {
          setLoading(false);
          fetchUsers();
        }, 250);
      }
    } catch (error) {
        enqueueSnackbar({message:error.message, variant:'error'})
    }
  };

  const handleDialogSubmit = async (data) => {
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
            // alert('New user created');
            enqueueSnackbar({ message: "User Created", variant: "success" });
            setTimeout(() => {
              setLoading(false);
              fetchUsers();
            }, 250);
          }
        } catch (error) {
          enqueueSnackbar({ message: error.message, variant: "error" });
        }
      } else {
        try {
          setLoading(true)
          const response = await updateUsers(selectedUser?._id, requestData);
          if (response.status === 200) {
            setTimeout(() => {
              setLoading(false);
              fetchUsers();
            }, 250);
            enqueueSnackbar({ message: "User Updated", variant: "success" });
          }
        } catch (error) {
          enqueueSnackbar({ message: error.message, variant: "error" });
        } finally {
          setLoading(false);
        }
      }

      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: "error" });
    }
  };

  const columns = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {field: "actions", headerName: "Actions",sortable: false,flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)} color="primary">
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
          sx={{
            width: {
              md: "calc(100% - 240px)",
              sm: "calc(100% - 240px)",
              xs: "100%",
              lg: "calc(100% - 240px)",
            },
            height: "auto",
            ml: {
              md: "240px",
              sm: "240px",
              xs: "0px",
              lg: "240px",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleCreateUser}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                <AddIcon />
                Create User
              </Button>
            </Box>
            {dialogOpen && (
              <UserDialog
                dialogOpen={dialogOpen}
                handleCloseDialog={handleCloseDialog}
                selectedUser={selectedUser}
                isCreateMode={isCreateMode}
                handleDialogSubmit={handleDialogSubmit}
                schoolData={schoolData}
              />
            )}
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <DataGrid
                rows={userData}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row._id}
                sx={{ fontFamily: "Poppins, sans-serif" , minWidth: 700}}
              />
            </Box>
          </Box>
          <Loader loading={loading} />
        </Box>
      </SnackbarProvider>
    </>
  );
};

export default UserList;
