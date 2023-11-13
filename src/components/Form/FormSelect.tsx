import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
    Box,
    FormControl,
    InputLabel,
    TextField,
    MenuItem,
    Select,
    SelectChangeEvent,
    FormHelperText
} from '@mui/material';
import theme from '../../themes/BMThemes';
import { StyledSelectFormControl } from './Styles/FormStyles';

function FormSelect({ name, label, items, validationRules } : IFormSelectProps) {
    const {
        control,
        formState: { errors },
        getValues
    } = useFormContext();


    return (
        <StyledSelectFormControl size="small" sx={{
            textAlign: 'left',
            marginBottom: '1.8rem',
        }}>
                    <Controller
                        name={name}
                        control={control}
                        rules={{ validate: (value) => value !== '' }}
                        render={({ field: { name, value, onChange } }) => (
                            <>
                            <InputLabel id="project-select" error={!!errors[name]}>{label}</InputLabel>
                            <Select
                                name={name}
                                value={value}
                                onChange={onChange}
                                autoWidth
                                label={label}
                                error={!!errors[name]}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            "& .Mui-selected": {
                                                bgcolor: theme.palette.grey[300],
                                            },
                                            "& .Mui-selected:hover": {
                                                bgcolor: theme.palette.grey[300],
                                            },
                                        },
                                    },
                                }}
                            >
                            {items && items.map((item: IFormSelectItem, index: number) => (
                                <MenuItem value={item.value} key={index}>{item.name}</MenuItem>
                            ))}
                            </Select>
                                {!!errors[name] && <FormHelperText error>{validationRules.required}</FormHelperText>}
                            </>
                        )}
                    />
        </StyledSelectFormControl>
    );
}

export default FormSelect;
