import React, {useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const CreateSchoolDialog = ({ open, onClose, onSubmit, isCreateMode, selectedSchool }) => {
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: isCreateMode ? {} : selectedSchool,
  });

  useEffect(() => {
    setValue('name', selectedSchool?.name || '');
    setValue('address', selectedSchool?.address || '');
  }, [selectedSchool, setValue]);

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        address: '',
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isCreateMode ? 'Create School' : 'Edit School'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleDialogSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue={selectedSchool?.name || ''}
            rules={{ required: 'School Name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="School Name"
                fullWidth
                margin="normal"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue={selectedSchool?.address || ''}
            rules={{ required: 'Address is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                fullWidth
                margin="normal"
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            {isCreateMode ? 'Create School' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSchoolDialog;
