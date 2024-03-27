import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';

const RechargeDialog = ({ open, setOpen, onSubmit }) => {
  const { handleSubmit, register, formState: { errors } } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
    setOpen(false)
  };

  return (
    <Dialog open={open} onClose={()=> setOpen(false)}>
      <DialogTitle>Enter Amount</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            label="Amount"
            fullWidth
            margin="normal"
            {...register("amount", { required: "Amount is required" })}
            error={!!errors.amount}
            helperText={errors.amount ? errors.amount.message : ""}
          />
          <DialogActions>
            <Button onClick={()=> setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Submit</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeDialog;
