import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, RootState, } from '../../store';
import { Box, Container, Grid, CircularProgress, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import TaskList from '../../components/TaskList';
import { getSkills, getDummySkills } from '../../api/api'
import Quickfilters from '../../components/Quickfilters'
import SkillsArray from '../../dummyData/skills.json';

const AllTasksPage = () => {
    const {isLoading, tasks} = useSelector((state: RootState) => state.task);
    const isDemoApp = useSelector((state: RootState) => state.auth.isDemoApp);
    const skills = useSelector((state: RootState) => state.skills.skills);
    const [skillList, setSkillList] = useState<ISkill[] | null>(null);
    const [taskList, setTaskList] = useState<ITask[] | null>(null);
    const dispatch = useAppDispatch();
    const location = useLocation();

    const fetchSkills = async () => {
        if (isDemoApp) {
            setSkillList(SkillsArray)
        } else {
            let skillsArray = [];
            const skills = await getSkills();
            skillsArray = skills['hydra:member'];
            setSkillList(skillsArray)
        }        
    }

    useEffect(() => {
        if (tasks !== null) {
            setTaskList(tasks);
        }
    }, [tasks]);


    useEffect(() => {
        fetchSkills();
    }, []);

    return (
        <Container sx={{ marginTop: '5rem'}}>
            {skillList === null ? (<CircularProgress size='4rem' sx={{ marginTop: '12rem'}}/>) :
                (
                    <>
                        <Box>
                            <Typography variant="h2" sx={{ textAlign: 'left', margin: { xs: '2rem 0', md: '2.5rem 0' } }}>
                                List of all tasks
                            </Typography>
                        </Box>
                        { location.pathname === '/alltasks' && (
                            <Box sx={{ marginBottom: '3rem' }}>
                                <Quickfilters skillList={skillList}/>
                            </Box>
                        )}
                        {isLoading && taskList !== null ?
                            <CircularProgress size='4rem' sx={{ marginTop: '12rem'}}/> :
                            <TaskList taskListTitle='List of all tasks' taskList={taskList} skillList={skillList}/>
                        }
                    </>
                )}
        </Container>
    )
};

export default AllTasksPage
