import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../themes/BMThemes';

const StyledSubmitButton = styled(Button)(({theme}) =>({
    background: theme.palette.primary.main,
    color: '#fff',
    lineHeight: 1,
    fontSize: '1.1rem',
    borderRadius: '1rem',
    marginBottom: '1rem',
    paddingLeft: '1.2rem',
    paddingRight: '1.2rem',
    paddingTop: '.5rem',
    paddingBottom: '.5rem',

}));

interface IStyledButtonProps {
    text: string
    type: "button" | "submit" | "reset" | undefined
    onClick?: () => void
}

function StyledButton({text, type, onClick}: IStyledButtonProps) {
    return (
        <StyledSubmitButton variant="contained" type={type} onClick={onClick} sx={{marginTop: '2rem'}}>
            {text}
        </StyledSubmitButton>
    );
}

export default StyledButton;
