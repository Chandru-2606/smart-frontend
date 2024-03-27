import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, Box} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { getSchools } from "../../Api/schools";
import { SnackbarProvider, useSnackbar } from "notistack";
import {IconButton} from "@mui/material";
import Close from '@mui/icons-material/Close';

function UserDialog({open, setOpen, selectedUser, isCreateMode, onSubmit}) {
  const [schools, setSchools] = useState([]);
  const [display, setDisplay] = useState(false)
  const { control, handleSubmit, getValues, setValue,reset,  watch, formState: { errors }} = useForm({
    defaultValues: selectedUser
  });
  const role = watch("role");
  const {enqueueSnackbar,closeSnackbar} = useSnackbar();

  const fetchSchools = async()=>{
    try {
      const response = await getSchools()
      setSchools(response.data)
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message,variant : 'error',action: key => (
        <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackbar(key)}>
            <Close fontSize="small" />
        </IconButton>
    ),})
  }
  }
  useEffect(() => {
    if (selectedUser) {
      setValue("username", selectedUser.username || "");
      setValue("password", selectedUser.password || "");
      setValue("role", selectedUser.role || "");
      setValue("school", selectedUser.school || "");
    }
  }, [selectedUser, setValue]);

  useEffect(()=>{
    if(getValues('role') === 'schooladmin' || selectedUser?.role === 'schooladmin'){
      setDisplay(true);
    }else{
      setDisplay(false);
    }
  },[role, selectedUser])

  useEffect(()=>{
    fetchSchools()
  }, [])

  useEffect(() => {
    if (role === "schooladmin") {
      setValue("school", selectedUser?.school || ""); 
    } else {
      setValue("school", ""); 
    }
  }, [role, setValue, selectedUser]);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <Dialog open={open} onClose={()=> {
        setOpen(false)
        reset({
          school : '',
          username : '',
          password : '',
          role : ''
        })
        }}>
        <DialogTitle>{isCreateMode ? "Create User" : "Edit User"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="username"
              control={control}
              defaultValue={selectedUser?.username || ""}
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  fullWidth
                  margin="normal"

                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue={selectedUser?.password || ""}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              defaultValue={selectedUser?.role || ""}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Select
                    {...field}
                    label="Role"
                    inputProps={{ name: "role", id: "role" }}
                    error={!!errors.role}
                  >
                    <MenuItem value="superadmin">Superadmin</MenuItem>
                    <MenuItem value="schooladmin">Schooladmin</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            {display && (
              <Controller
                name="school"
                control={control}
                defaultValue={selectedUser?.school || ""}
                rules={{ required: "School is required" }}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel htmlFor="school">School</InputLabel>
                    <Select
                      {...field}
                      label="School"
                      inputProps={{ name: "school", id: "school" }}
                      error={!!errors.school}
                    >
                      {schools &&
                        schools.map((school) => (
                          <MenuItem key={school._id} value={school._id}>
                            {school.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}
            <Button type="submit" variant="contained" color="primary">
              {isCreateMode ? "Create User" : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
     </SnackbarProvider>
  );
}

export default UserDialog;
