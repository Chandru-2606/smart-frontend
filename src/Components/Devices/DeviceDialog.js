import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getSchools } from "../../Api/schools";
import { Dialog, DialogTitle, DialogContent, TextField,  Button,  
  MenuItem,  FormControl,  InputLabel,  Select} from "@mui/material";

const DevicesDialog = ({
  open,
  onSubmit,
  setOpen,
  selectedCard,
  initialSchools,
}) => {
  const [schools, setSchools] = useState(initialSchools);
  const [selectedSchool, setSelectedSchool] = useState("");
  const {
    control,
    getValues,
    setValue,
    register,
    handleSubmit,
    reset,
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
    if (selectedCard) {
      setValue("school", selectedCard?.school?._id);
      setValue("imeiNumber", selectedCard.imeiNumber);
      setSelectedSchool(selectedCard?.school?._id || "");
    }
  }, [selectedCard]);

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

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setSelectedSchool("");
        reset({
          imeiNumber: "",
          school: null,
        });
      }}
    >
      <DialogTitle>Add Card</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("imeiNumber", { required: "IMEI number is required" })}
            label="IMEI Number"
            fullWidth
            error={!!errors.imeiNumber}
            helperText={errors.imeiNumber?.message}
            sx={{ mt: 3 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="school-label">School</InputLabel>
            <Select
              labelId="school-label"
              id="school-select"
              label="School"
              value={selectedSchool}
              {...register("school")}
              onChange={handleSchoolChange}
            >
              {schools &&
                schools.map((school) => (
                  <MenuItem value={school._id} key={school._id}>
                    {school.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DevicesDialog;
