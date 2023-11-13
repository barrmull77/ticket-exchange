import React, { useRef } from 'react';
import { Box, Button } from '@mui/material';

interface IFormUploadButton {
    text: string
}

function FormUploadButton({text} : IFormUploadButton) {
    const fileInput = useRef<HTMLInputElement | null>(null);

    return (
        <Box sx={{
            marginBottom: '1.8rem',
        }}>
            <Button
                variant="contained"
                color="primary"
                onClick={()=> {
                    if (fileInput.current) {
                        fileInput.current.click();
                    }
                }}
            >
                {text}
            </Button>

            <input
                ref={fileInput}
                type="file"
                style={{ display: 'none' }}
            />
        </Box>
    );
}

export default FormUploadButton;
