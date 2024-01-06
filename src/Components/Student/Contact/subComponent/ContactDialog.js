import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { getContacts } from '../../../../Api/auth';

const ContactForm = ({ open, setContactOpen, onSubmit, student, isEditMode }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: isEditMode ? student : {},
  });

  const handleClose = () => {
    setContactOpen(false)
  };
  
  const handleFormSubmit = (data) => {
    onSubmit(data);
    setContactOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEditMode ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
      <DialogContent sx={{fontFamily: 'Poppins, sans-serif'}}>
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{fontFamily: 'Poppins, sans-serif'}}>
          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name && errors.name.message}
            sx={{fontFamily: 'Poppins, sans-serif'}}
          />

          <TextField
            {...register('phoneNumber', { required: 'Phone Number is required' })}
            label="Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber && errors.phoneNumber.message}
          />

          <FormControl fullWidth margin="normal" error={!!errors.relation}>
            <InputLabel id="relation-label">Relation</InputLabel>
            <Controller
              name="relation"
              control={control}
              rules={{ required: 'Relation is required' }}
              render={({ field }) => (
                <Select labelId="relation-label" label="Relation" {...field}>
                  <MenuItem value="friend">Friend</MenuItem>
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="colleague">Colleague</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.relation && errors.relation.message}</FormHelperText>
          </FormControl>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button type="submit" variant="contained" color="primary">
              {isEditMode ? 'Update' : 'Submit'}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
