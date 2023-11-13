import React, { useState, useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form'
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    FormHelperText
} from '@mui/material';
import CancelIcon from "@mui/icons-material/Cancel";
import theme from '../../themes/BMThemes';
import { StyledSelectFormControl } from './Styles/FormStyles';

interface IFormTagTextFieldProps {
    label: string;
    name: string;
    validationRules: IFormValidation;
    items: ISkill[]
}

function FormTagSelect({ name, label, items, validationRules} : IFormTagTextFieldProps) {
    const {
        control,
        register,
        formState: { errors },
        getValues,
        setValue,
        clearErrors,
        trigger,
    } = useFormContext();

    // ToDo remove any type
    const [skillTags, setSkillTags] = useState<any[]>([]);

    const handleChange = (value: any) => {
        setSkillTags(value);
    };

    const handleSkillTagDelete = async (event: any, value: ISkill
    ) => {
        const newtags = skillTags.filter((val: ISkill) => val.name !== value.name);
        setSkillTags(newtags);
        setValue('skills', newtags);
        await trigger("skills");
    }

    useEffect(() => {
        setValue('skills', skillTags);
    }, [skillTags])

    useEffect(() => {
        // Populate tag select if values exist
        const initSkillVal = getValues('skills');

        if (initSkillVal.length > 0) {
            setSkillTags(initSkillVal);
        }
    }, [])

    return (
        <StyledSelectFormControl
            size="small"
            sx={{
            textAlign: 'left',
            marginBottom: '1.8rem',
        }}>
            <Controller
                name={name}
                control={control}
                rules={{ validate: (val: any) => val.length !== 0 }}
                render={({ field: { name, value, onChange } }) => (
                    <>
                        <InputLabel id="form-select-tag" error={!!errors[name]}>{label}</InputLabel>
                        <Select
                            name={name}
                            value={skillTags}
                            onChange={(value) => {
                                handleChange(value.target.value);
                                onChange(value.target.value);
                            }}
                            autoWidth
                            multiple
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
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value: any, index: number) => (
                                        <Chip
                                            key={index}
                                            label={value.name}
                                            clickable
                                            deleteIcon={
                                                <CancelIcon
                                                    onMouseDown={(event) => event.stopPropagation()}
                                                />
                                            }
                                            onDelete={(event) => handleSkillTagDelete(event, value)}/>
                                    ))}
                                </Box>
                            )}
                        >
                            {items && items.map((item: any, index: number) => (
                                <MenuItem value={item} key={index}>{item.name}</MenuItem>
                            ))}
                        </Select>
                        {!!errors[name] && <FormHelperText error>{validationRules.required}</FormHelperText>}
                    </>
                )}
            />
        </StyledSelectFormControl>
    );
}

export default FormTagSelect;
