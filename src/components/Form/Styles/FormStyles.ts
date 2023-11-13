import theme from '../../../themes/BMThemes'
import { styled } from '@mui/material/styles';
import { Box, Button, TextField, FormControl } from '@mui/material';

const focusFieldStyling = {

    "& label.Mui-focused": {
        color: theme.palette.common.black,
    },

    "& .MuiInput-underline:after": {
        borderBottomColor: theme.palette.common.black,
    },

    "& .MuiFilledInput-underline:after": {
        borderBottomColor: theme.palette.common.black,
    },

    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.common.black,
        }
    }
}

export const StyledTextfield = styled(TextField)(({theme}) => (focusFieldStyling));
export const StyledSelectFormControl = styled(FormControl)(({theme}) => (focusFieldStyling));

export const StyledFormContainer = styled(Box)`
  max-width: 720px;
  margin: 0 auto;
`
