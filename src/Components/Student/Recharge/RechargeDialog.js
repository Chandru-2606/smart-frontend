import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const RechargeDialog = ({ open, setOpen, onSubmit }) => {
  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      rechargeType: 'talktime'
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    setOpen(false)
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Recharge</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt:1 }}>
            <FormControl fullWidth>
              <InputLabel id="recharge-type-label">Recharge Type</InputLabel>
              <Select
                labelId="recharge-type-label"
                id="rechargeType"
                label="Recharge Type"
                {...register("rechargeType")}
                defaultValue="talktime"
              >
                <MenuItem value="talktime">Talktime</MenuItem>
                <MenuItem value="monthly">Monthly Subscription</MenuItem>
                <MenuItem value="yearly">Yearly Subscription</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Amount"
              fullWidth
              {...register("amount", { required: "Amount is required" })}
              error={!!errors.amount}
              helperText={errors.amount ? errors.amount.message : ""}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" variant="contained">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RechargeDialog;
