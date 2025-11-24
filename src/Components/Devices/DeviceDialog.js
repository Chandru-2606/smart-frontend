import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getSchools } from "../../Api/schools";
import { Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem, FormControl, InputLabel, Select, DialogActions, Box } from "@mui/material";

const DevicesDialog = ({
  open,
  onSubmit,
  setOpen,
  selectedCard,
  initialSchools,
  editMode
}) => {
  const [schools, setSchools] = useState(initialSchools);
  const [selectedSchool, setSelectedSchool] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!initialSchools) {
      fetchSchools();
    } else {
      setSchools(initialSchools);
    }
  }, [initialSchools]);

  useEffect(() => {
    if (editMode && selectedCard) {
      setValue("school", selectedCard?.school?._id);
      setValue("imeiNumber", selectedCard.imeiNumber);
      setValue("mobileNumber", selectedCard.mobileNumber);
      setSelectedSchool(selectedCard?.school?._id || "");
    } else {
      reset({
        imeiNumber: "",
        mobileNumber: "",
        school: null,
      });
      setSelectedSchool("");
    }
  }, [editMode, selectedCard, setValue, reset]);



  const fetchSchools = async () => {
    try {
      const response = await getSchools();
      setSchools(response.data);
    } catch (error) {

    }
  };

  const handleSchoolChange = (event) => {
    const selected = event.target.value;
    setValue("school", selected, { shouldValidate: true });
    setSelectedSchool(selected);
  };

  const handleClose = () => {
    setOpen(false);
    reset({
      imeiNumber: "",
      mobileNumber: "",
      school: null,
    });
    setSelectedSchool("");
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{editMode ? 'Edit Device' : 'Add Device'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              {...register("imeiNumber", { required: "IMEI number is required" })}
              label="IMEI Number"
              fullWidth
              error={!!errors.imeiNumber}
              helperText={errors.imeiNumber?.message}
            />
            <TextField
              {...register("mobileNumber")}
              label="Mobile Number"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="school-label">School</InputLabel>
              <Select
                labelId="school-label"
                id="school-select"
                label="School"
                value={selectedSchool}
                {...register("school", { required: "School is required" })}
                onChange={handleSchoolChange}
                error={!!errors.school}
              >
                {schools &&
                  schools.map((school) => (
                    <MenuItem value={school._id} key={school._id}>
                      {school.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DevicesDialog;
