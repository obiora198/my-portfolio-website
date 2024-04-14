import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
  return (

    <div className='w-full h-full absolute bg-white opacity-75 flex items-center justify-center z-40'>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
    </div>
  );
}