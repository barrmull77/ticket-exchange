import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import theme from '../../themes/BMThemes';
import { StyledTextfield } from './Styles/FormStyles'
import { TextField, FormControl } from '@mui/material';

interface IFormDatePickerProps {
    label: string;
    name: string;
    validationRules: IFormValidation;
}

function FormDatePicker({ name, label, validationRules } : IFormDatePickerProps) {
    const {
        control,
        register,
        formState: { errors },
        getValues,
        setError,
        clearErrors
    } = useFormContext();

    const handleDateChange = (newValue: Dayjs) => {
        if (newValue) {
            clearErrors(name)
            const formattedValue = dayjs(newValue).format();
            const currentTime =  dayjs().format();
            if (formattedValue < currentTime) {
                return setError( name, { type: 'custom', message: 'Deadline must not be in the past' });
            }

            return formattedValue;
        }
    };

    useEffect(() => {
        const initDeadlineValue = getValues('deadline');
        if (initDeadlineValue) {
            handleDateChange(initDeadlineValue);
        }
    },[])

    return (
        <FormControl sx={{marginBottom: '1.6rem'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name={name}
                    control={control}
                    rules={validationRules}
                    render={({ field: { name, value, onChange } }) => (
                        <DesktopDatePicker
                            label={label}
                            inputFormat="DD.MM.YYYY"
                            value={value}
                            onChange={(value) => {
                                onChange(handleDateChange(value));
                            }}
                            disablePast
                            renderInput={(params) =>
                                <StyledTextfield
                                    name={name}
                                    value={value}
                                    {...params}
                                    error={!!errors[name]}
                                    helperText={errors[name] ? (errors[name]?.message as unknown as string) : ''}
                                    size="small"
                                />}
                        />
                    )}
                />
            </LocalizationProvider>

        </FormControl>
    );
}

export default FormDatePicker;
