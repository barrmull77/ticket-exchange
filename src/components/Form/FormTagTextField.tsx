import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import theme from '../../themes/BMThemes';
import { StyledTextfield } from './Styles/FormStyles';
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    TextField,
    FormHelperText
} from '@mui/material';
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import CancelIcon from "@mui/icons-material/Cancel";
import { setSkills, addProject } from '../../api/api'

interface IFormTagTextFieldProps {
    label: string
    name: string
    multiple: boolean
    validationRules: IFormValidation;
    items: any
    setData: (data: string) => any
    dataUpdate: () => any
}

const filter = createFilterOptions({
    matchFrom: "start",
    stringify: (option: any) => option.name
});

function FormTagTextField({name, label, items, multiple, validationRules, setData, dataUpdate } : IFormTagTextFieldProps) {
    const {
        control,
        register,
        formState: { errors },
        getValues,
        setValue,
    } = useFormContext();

    const checkIsNew = async (data: any) => {
        const lastValueEntered = multiple ? data[data.length - 1] : data;

        if (Object.keys(lastValueEntered).includes('inputValue')) {
            const checkIsNew = items.filter((item: any) => item.name === lastValueEntered.inputValue);
            if (checkIsNew.length === 0) {
                const returnVal =  await setData(lastValueEntered.inputValue);
                await dataUpdate()
            }
        }

        if (typeof lastValueEntered === 'string') {
            const checkIsNew = items.filter((item: any) => item.name === lastValueEntered);
            if (checkIsNew.length === 0) {
                const returnVal = await setData(lastValueEntered);
                await dataUpdate()
            }
        }
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={{ validate: (val: any) => val.length !== 0 }}
            render={({ field: { ref, onChange, ...props } }) => (
                <Autocomplete
                    multiple={multiple}
                    disableClearable
                    openOnFocus
                    freeSolo
                    {...props}
                    onChange={(e, data) => {
                        checkIsNew(data)
                        onChange(data)
                    }}
                    options={items}
                    isOptionEqualToValue={(option, value) => option.name === value}
                    sx={{
                        marginBottom: '1.8rem',
                    }}
                    getOptionLabel={(option) => {
                        // e.g value selected with enter, right from the input
                        if (typeof option === "string") {
                            return option;
                        }
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        return option.name;
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const isExisting = options.some(
                            (option) => params.inputValue === option.name
                        );
                        if (params.inputValue !== "" && !isExisting) {
                            filtered.push({
                                inputValue: params.inputValue,
                                name: `Add "${params.inputValue}" to ${name}`
                            });
                        }

                        return filtered;
                    }}
                    renderOption={(props, option) => (
                        <li {...props} style={{ padding: "4px 10px" }}>
                            {option.name }
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            error={!!errors[name]}
                            helperText={errors[name] ? (validationRules.required) : ''}
                            {...params}
                            inputRef={ref}
                            variant="outlined"
                            size="small"
                            label={label}
                        />
                    )}
                />
            )}
        />
    );
}

export default FormTagTextField;
