import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, FormControl, InputLabel, DialogActions } from '@mui/material';

const ContactForm = ({ open, setOpen, onSubmit, selectedContact ={} }) => {
  const {handleSubmit, register, reset,setValue, formState: { errors } } = useForm()
  const handleFormSubmit = (data) => {
    onSubmit(data);
    handleClose()
  };

  useEffect(()=>{
    if (selectedContact._id) {
      setValue('name', selectedContact.name)
      setValue('phoneNumber', selectedContact.phoneNumber)
      setValue('relation', selectedContact.relation)
    }else{
      setValue('name', '')
      setValue('phoneNumber', '')
      setValue('relation', '')
    }
  }, [selectedContact])
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open}
      onClose={handleClose}>
      <DialogTitle> {selectedContact._id ? 'Edit Contact' : 'Create Contact'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            label="Name"
            {...(errors.name
              ? { error: true, helperText: errors.name.message }
              : {})}
            fullWidth
            margin="normal"
            defaultValue={""}
            {...register("name", { required: "Name is required" })}
          />

          <TextField
            label="Phone Number"
            type='number'
            {...(errors.phoneNumber
              ? { error: true, helperText: errors.phoneNumber.message }
              : {})}
              defaultValue={""}
            fullWidth
            margin="normal"
            {...register("phoneNumber", {
              required: "Phone Number is required",
              pattern: {
                value: /^\d{5}$|^\d{10}$|^\d{11}$/,
                message: "Phone number must be 5, 10, or 11 digits",
              },
            })}
          />

          {/* Relation */}
          <FormControl fullWidth margin="normal">
            {/* <InputLabel id="relation-label">Relation</InputLabel> */}
            {/* <Select
              labelId="relation-label"
              {...register("relation", { required: "Relation is required" })}
              defaultValue={selectedContact.relation} 
            > */}
              <InputLabel id="relation-label">Relation</InputLabel>

            <Select
    labelId="demo-simple-select-label"
    id="relation-label"
    // value={age}
    label="Relation"
    // onChange={handleChange}
    {...register("relation", { required: "Relation is required" })}
    defaultValue={selectedContact.relation} 
  >
              <MenuItem value="Parent">Parent</MenuItem>
              <MenuItem value="Sibling">Sibling</MenuItem>
              <MenuItem value="Relative">Relative</MenuItem>
            </Select>
            {errors.relation && <span>{errors.relation.message}</span>}
          </FormControl>

          <DialogActions>
            <Button type="submit">Submit</Button>
            <Button onClick={()=> setOpen(false)}>Cancel</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
