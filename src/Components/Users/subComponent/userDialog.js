import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

function UserDialog({
  dialogOpen,
  handleCloseDialog,
  selectedUser,
  isCreateMode,
  handleDialogSubmit,
  schoolData,
}) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const role = watch("role");

  useEffect(() => {
    if (role === "schooladmin") {
      setValue("school", selectedUser?.school || ""); 
    } else {
      setValue("school", ""); 
    }
  }, [role, setValue, selectedUser]);

  return (
    <Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isCreateMode ? "Create User" : "Edit User"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleDialogSubmit)}>
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
            {role === "schooladmin" && (
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
                      {schoolData &&
                        schoolData.map((school) => (
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
    </Box>
  );
}

export default UserDialog;
