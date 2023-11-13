import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import theme from '../../themes/BMThemes';
import { StyledTextfield } from './Styles/FormStyles';

interface IFormTextFieldProps {
    label: string;
    name: string;
    rows?: string | number | undefined;
    validationRules: IFormValidation;
    type?: string
}

function FormTextfield({name, label, rows, validationRules, type } : IFormTextFieldProps) {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            rules={validationRules}
            render={({ field: { name, value, onChange } }) => (
                <StyledTextfield
                    name={name}
                    value={value}
                    onChange={onChange}
                    label={label}
                    variant="outlined"
                    size="small"
                    type={type}
                    inputProps={ type === 'number' ? {
                        min: '1',
                    } : {}}
                    multiline={rows ? true : false}
                    rows={rows ? rows : undefined}
                    error={!!errors[name]}
                    helperText={errors[name] ? (errors[name]?.message as unknown as string) : ''}
                    sx={{
                        marginBottom: '1.8rem',
                    }}
                />
            )}
        />
    );
}

export default FormTextfield;
