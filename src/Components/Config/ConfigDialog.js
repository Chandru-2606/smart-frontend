import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';

const RateInputDialog = ({ open, setOpen, onSubmit }) => {
  const { handleSubmit, register, formState: { errors } } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Enter Rate</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            label="Rate"
            type="number"
            {...register("rate", {
              required: "Rate is required",
              min: { value: 0, message: "Rate must be greater than or equal to 0" },
            })}
            error={!!errors.rate}
            helperText={errors.rate?.message}
            fullWidth
            margin="normal"
          />
          <DialogActions>
          <Button  >Cancel</Button>
          <Button type="submit" variant="contained">Submit</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RateInputDialog;
