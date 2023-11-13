import React, { ReactChildren, ReactElement, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import theme from '../../themes/BMThemes';
import { StyledFormContainer } from './Styles/FormStyles';
import { Typography } from '@mui/material';

interface IFormWrapperProps {
    title?: string;
    children: ReactNode | ReactNode[];
    handleFormSubmit: <T>(T: any) => void;
}

function FormWrapper({title, children, handleFormSubmit} : IFormWrapperProps) {
    const {
        handleSubmit,
    } = useFormContext();

    return (
        <StyledFormContainer>
            {title && (
                <Typography variant='h2' sx={{textAlign: 'left', margin: { xs: '2rem 0', md: '2.5rem 0'}}}>
                    {title}
                </Typography>
            )}
            <form onSubmit={handleFormSubmit} >
                {children}
            </form>
        </StyledFormContainer>
    );
}

export default FormWrapper;
