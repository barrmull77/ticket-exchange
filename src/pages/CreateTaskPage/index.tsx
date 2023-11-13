import React from 'react';
import { Container } from '@mui/material';
import TaskFrom from '../../components/TaskForm'

export const CreateTaskpage = () => {
    return (
        <Container sx={{ marginTop: '5rem'}}>

            <TaskFrom />
        </Container>
    );
}

export default CreateTaskpage;
