import { Box, Container, Grid, CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAppDispatch, RootState } from '../../store';
import React, {useEffect, useState, useRef } from 'react';
import HeroSection from '../../components/HeroSection'
import TaskList from '../../components/TaskList';
import { fetchMyTasks, fetchAppliedTasks, fetchMyDummyTasks, fetchDummyAppliedTasks } from '../../store/features/taskSlice';

const MyTasksPage = () => {
    const [myTasksList, setMyTasksList] = useState<ITask[] | null>(null);
    const [appliedTasksList, setAppliedTasksList] = useState<ITask[] | null>(null);
    const user = useSelector((state: RootState) => state.auth.userProfile);
    const { appliedTasks, myTasks } = useSelector((state: RootState) => state.task);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if (myTasks !== null) {
            setMyTasksList(myTasks);
        }

        if (appliedTasks !== null) {
            const filteredAcceptedAppliedTasks = appliedTasks.filter((task: any) => {
                const acceptedTasks = task.requests.find((request: any) => {
                    return request.user.id === Number(user.id) && request.status === 'Accepted'
                })
                return acceptedTasks;
            })

            setAppliedTasksList(filteredAcceptedAppliedTasks);
        }
    }, [appliedTasks, myTasks])

    useEffect(() => {
        // dispatch(fetchMyTasks(user.id));
        // dispatch(fetchAppliedTasks(user.id));
        dispatch(fetchMyDummyTasks(user.id));
        dispatch(fetchDummyAppliedTasks(user.id));
    }, []);

    return (
        <Container sx={{ marginTop: '5rem'}}>
            {appliedTasksList === null && myTasksList === null ? (
                <CircularProgress size='4rem' sx={{ marginTop: '12rem'}}/>
            ) : (
                <>
                    <HeroSection />
                    <Box>
                        <Typography variant="h2" sx={{ textAlign: 'left', margin: { xs: '2rem 0', md: '2.5rem 0' } }}>
                            Tasks I created
                        </Typography>
                    </Box>
                    {myTasksList && <TaskList taskListTitle='Tasks I created' taskList={myTasksList} />}
                    <Box>
                        <Typography variant="h2" sx={{ textAlign: 'left', margin: { xs: '2rem 0', md: '2.5rem 0' } }}>
                            Tasks I work on
                        </Typography>
                    </Box>
                    {appliedTasksList && <TaskList taskListTitle='Tasks I work on' taskList={appliedTasksList} />}
                </>
            )}
        </Container>
    )
};

export default MyTasksPage
