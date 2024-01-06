import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, FormControl, InputLabel, DialogActions } from '@mui/material';

const ContactForm = ({ open, onClose, onSubmit }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    onClose();
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Contact Form</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Student ID field (hidden for simplicity, you may handle it differently) */}

          <TextField
            label="Name"
            {...(errors.name ? { error: true, helperText: errors.name.message } : {})}
            fullWidth
            margin="normal"
            {...register('name', { required: 'Name is required' })}
          />

          {/* Phone Number */}
          <TextField
            label="Phone Number"
            {...(errors.phoneNumber ? { error: true, helperText: errors.phoneNumber.message } : {})}
            fullWidth
            margin="normal"
            {...register('phoneNumber', {
              required: 'Phone Number is required',
              pattern: {
                value: /^\d{10}$/, // Change this pattern according to your requirement
                message: 'Invalid Phone Number',
              },
            })}
          />

          {/* Relation */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="relation-label">Relation</InputLabel>
            <Select
              labelId="relation-label"
              {...register('relation', { required: 'Relation is required' })}
            >
              <MenuItem value="Parent">Parent</MenuItem>
              <MenuItem value="Sibling">Sibling</MenuItem>
              <MenuItem value="Relative">Relative</MenuItem>
            </Select>
            {errors.relation && <span>{errors.relation.message}</span>}
          </FormControl>

          <DialogActions>
            <Button type="submit">Submit</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
