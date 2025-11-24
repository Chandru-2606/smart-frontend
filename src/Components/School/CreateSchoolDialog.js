import React, {useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const CreateSchoolDialog = ({ open, onClose, onSubmit, isCreateMode, selectedSchool }) => {
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: isCreateMode ? { callTimeLimitMinutes: 0 } : selectedSchool,
  });

  useEffect(() => {
    setValue('name', selectedSchool?.name || '');
    setValue('address', selectedSchool?.address || '');
    setValue('callTimeLimitMinutes', selectedSchool?.callTimeLimitMinutes || 0);
  }, [selectedSchool, setValue]);

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        address: '',
        callTimeLimitMinutes: 0,
      });
    }
  }, [open, reset]);

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleDialogSubmit = (data) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isCreateMode ? 'Create School' : 'Edit School'}</DialogTitle>
      <form onSubmit={handleSubmit(handleDialogSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'School Name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="School Name"
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  error={Boolean(errors.address)}
                  helperText={errors.address?.message}
                />
              )}
            />
            <Controller
              name="callTimeLimitMinutes"
              control={control}
              rules={{ required: 'Call time limit is required', min: { value: 0, message: 'Must be a positive number' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Call Time Limit (minutes)"
                  type="number"
                  fullWidth
                  error={Boolean(errors.callTimeLimitMinutes)}
                  helperText={errors.callTimeLimitMinutes?.message}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isCreateMode ? 'Create School' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateSchoolDialog;
