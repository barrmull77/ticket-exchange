import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox,FormControlLabel } from '@mui/material';
import theme from '../../themes/BMThemes';
import { StyledTextfield } from './Styles/FormStyles';

interface IFormCheckbox {
    name: string,
    label: string,
}

function FormCheckbox({name, label} : IFormCheckbox) {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { name, value, onChange } }) => (
                <FormControlLabel
                    name={name}
                    label={label}
                    value={value}
                    control={
                        <Checkbox
                            onChange={e => onChange(e.target.checked)}
                            size="small"
                            color="primary"
                            checked={value}
                        />
                    }
                />
            )}
        />
    );
}

export default FormCheckbox;
