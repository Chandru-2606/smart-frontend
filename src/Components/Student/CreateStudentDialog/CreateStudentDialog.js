import React, {useState, useEffect} from 'react';
import { createStudent, updateStudent } from '../../../Api/student';
import {  enqueueSnackbar  } from "notistack";
import { Dialog,  DialogTitle, DialogContent, TextField, Button, Box} from '@mui/material';
import { useForm } from 'react-hook-form';


const StudentForm = ({ open, setOpen,  isEditMode, initialValues,fetchStudents , onSubmit}) => {
  const user = JSON.parse(localStorage.getItem('user'))

  const {
    register,
    control,
    handleSubmit,reset,
    formState: { errors },setValue
  } = useForm({
    defaultValues: isEditMode ? initialValues : {},
  });
  useEffect(() => {
    if (initialValues?._id) {
      setValue('name', initialValues?.name || '');
      setValue('school', initialValues?.school || ''); 
      setValue('cardID', initialValues?.cardID || '');
      setValue('balance', initialValues?.balance || '');
    }else{
      setValue('name', '');
      setValue('school', ''); 
      setValue('cardID', '');
      setValue('balance', 0);
    }
   
  }, [initialValues, setValue]);

  React.useEffect(() => {
    if (!open) {
      reset({
        name: '',
        cardID: '',
        balance: '',
      });
    }
  }, [open, reset]);
  
  
  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{initialValues?._id ? "Edit Student" : "Add Student"}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box >
            <TextField
              {...register("name", { required: true })}
              error={errors.name ? true : false}
              helperText={errors.name && "Name is required"}
              label="Name"
              sx={{ mb: 2 }}
              defaultValue={initialValues?.name} 
            />
            </Box>
           
            <TextField
              {...register("cardID")}
              label="Card ID"
              sx={{ mb: 2 }}
            />
            <TextField
              disabled={true}
              type="number"
              {...register("balance", {
                valueAsNumber: true,
              })}
              label="Balance"
              sx={{ mb: 2 }}
              defaultValue={initialValues?.balance || 0} 
            />
            
            <Button type="submit" variant="contained" sx={{ width: "100%" }}>
              {initialValues?._id  ? "Update" : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default StudentForm;
