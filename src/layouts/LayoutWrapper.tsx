import * as React from 'react';
import Box from '@mui/material/Box';

export default function LayoutWrapper() {

    return (
        <Box sx={{display: 'flex'}}>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
            </Box>
        </Box>
    );
}
