import React, {useState, useEffect} from 'react';
import { createStudent, updateStudent } from '../../../Api/student';
import {  enqueueSnackbar  } from "notistack";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';


const StudentForm = ({ open, setOpen, onSubmit, schoolData, isEditMode, initialValues , AllStudents}) => {
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
    setValue('name', initialValues?.name || '');
    setValue('school', initialValues?.school || ''); 
    setValue('rfidCardId', initialValues?.rfidCardId || '');
    setValue('balance', initialValues?.balance || '');
  }, [initialValues, setValue]);

  React.useEffect(() => {
    if (!open) {
      reset({
        name: '',
        rfidCardId: '',
        balance: '',
      });
    }
  }, [open, reset]);
  const handleFormSubmit = async (data) => {
    if (initialValues?._id) {
      const updatedStudent ={ ...data, _id :initialValues?._id ,balance:0};
      const response = await updateStudent(updatedStudent._id, updatedStudent)
      enqueueSnackbar({message:"Student Updates", variant:'success'})
    } else {
      delete data._id
      try{
        const updatedStudent = {...data , school : user.school, balance:0}
        const response = await createStudent(updatedStudent)
        enqueueSnackbar({message:"Student Created", variant:'success'})
        AllStudents()
      }catch(error){
        enqueueSnackbar({message:error.message, variant:'error'})
      }
    }
    setOpen(false)
  };
  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{initialValues?._id ? "Edit Student" : "Add Student"}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              {...register("name", { required: true })}
              error={errors.name ? true : false}
              helperText={errors.name && "Name is required"}
              label="Name"
              sx={{ mb: 2 }}
              defaultValue={initialValues?.name} 
            />
           
            <TextField
              {...register("rfidCardId", {
                required: true,
              })}
              error={errors.rfidCardId ? true : false}
              helperText={errors.rfidCardId ? "RFID Card ID is required " : ""}
              label="RFID Card ID"
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
