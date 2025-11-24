import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { useForm } from 'react-hook-form';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { getSchoolById, updateSchool } from '../../Api/schools';
import Loader from '../../Components/Loader/loader';

function Configuration() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchSchoolDetails = async () => {
            setLoading(true);
            try {
                const response = await getSchoolById(user.school);
                setValue('callTimeLimitMinutes', response.data.callTimeLimitMinutes);
            } catch (error) {
                enqueueSnackbar({ message: 'Could not fetch school details', variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchSchoolDetails();
    }, [user.school, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await updateSchool(user.school, data);
            enqueueSnackbar({ message: 'Configuration updated successfully', variant: 'success' });
        } catch (error) {
            enqueueSnackbar({ message: 'Failed to update configuration', variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <Box sx={{
                width: { md: 'calc(100% - 240px)', sm: 'calc(100% - 240px)', xs: '100%', lg: 'calc(100% - 240px)', },
                minHeight: '90vh', ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px', }, backgroundColor: "#f7f7f8", p: 3
            }}>
                <Typography variant="h4" gutterBottom>Configuration</Typography>
                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                {...register("callTimeLimitMinutes", { required: "This field is required", min: { value: 0, message: "Must be a positive number" } })}
                                label="Call Time Limit (minutes)"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!errors.callTimeLimitMinutes}
                                helperText={errors.callTimeLimitMinutes?.message}
                            />
                            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Changes</Button>
                        </form>
                    </CardContent>
                </Card>
                <Loader loading={loading} />
            </Box>
        </SnackbarProvider>
    );
}

export default Configuration;
