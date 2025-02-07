import React from 'react';
import { CircularProgress, Stack } from '@mui/material';

const Loader = () => {
    return (
        <Stack justifyContent="center" alignItems="center" sx={{ height: "200px" }}>
            <CircularProgress color="primary" />
        </Stack>
    );
};

export default Loader;
