import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import { deleteTask, acceptRequest, makeRequest, setTaskDone } from '../../api/api';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchTask, fetchDummyTask, fetchTasks, fetchDummyTasks } from '../../store/features/taskSlice';
import { fetchNotifications } from '../../store/features/notificationsSlice';
import theme from '../../themes/BMThemes';
import StyledButton from '../StyledButton';
import MessageDialog from '../MessageDialog';

interface ILocationTaskDetailState {
    taskId: number
    isOwner: boolean
}

const TaskDetails = () => {
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    let isCount = 0;
    const [taskDetail, setTaskDetail] = useState<ITask | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [doneDialogOpen, setDoneDialogOpen] = useState<boolean>(false);
    const [alreadyAppliedDialogOpen, setAlreadyAppliedDialogOpen] = useState<boolean>(false);
    const { selectedTask } = useSelector((state: RootState) => state.task);
    const user = useSelector((state: RootState) => state.auth.userProfile);
    const isDemoApp = useSelector((state: RootState) => state.auth.isDemoApp);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { taskId } = useParams();
    const params = useParams()

    const formatDate = (rawDate: string) => {
        const date = new Date(rawDate);
        const formattedDate = date.toLocaleDateString("de-DE", { year: 'numeric', month: '2-digit', day: '2-digit' });

        return formattedDate ;
    }

    const handleDelete = () => {
        setDeleteDialogOpen(false);
        if (taskDetail?.id) {
            setIsLoading(true);
            deleteTask(taskDetail.id).then((res: any) => {
                if (res.status === 204) {
                    if (isDemoApp) {
                        dispatch(fetchDummyTasks()).then(() => {
                            setIsLoading(false);
                            setSuccessMessage('Your task has been deleted');
                            dispatch(fetchNotifications(user.id));
                        })
                    } else {
                        dispatch(fetchTasks()).then((res) => {
                            setIsLoading(false);
                            setSuccessMessage('Your task has been deleted');
                            dispatch(fetchNotifications(user.id));
                        })
                    }
                } else {
                    throw new Error("Delete Task did not give 204 response");
                }
            }).catch(err => {
                setIsLoading(false);
                setErrorMessage('Unfortunately there was an error, please try again');
            })
        }
    }

    const handleMarkDone = () => {
        const data = {
            action : isNew ? "completed" : "done",
        }

        if ((taskDetail?.status === 'New' || taskDetail?.status === 'Pending') && doneDialogOpen === false) {
            setDoneDialogOpen(true);
            setIsNew(true);
            return
        }
        // Todo - handle mark as done when task has not been assigned yet

        if (taskDetail?.id) {
            setIsLoading(true);
            setTaskDone(taskDetail.id, data).then((res: any) => {
                if (res.status === 204 || res.status === 200) {
                        
                        if (isDemoApp) {
                            dispatch(fetchDummyTasks()).then(() => {
                                setIsLoading(false);
                                setSuccessMessage('Your task has been marked done');
                                dispatch(fetchNotifications(user.id));
                            })
                        } else {
                            dispatch(fetchTasks()).then(() => {
                                setIsLoading(false);
                                setSuccessMessage('Your task has been marked done');
                                dispatch(fetchNotifications(user.id));
                            })
                        }
                    
                } else {
                    throw new Error("Mark as done did not return a successful status message");
                }
            }).catch(err => {
                setIsLoading(false);
                setErrorMessage(`Unfortunately there was an error`)
            })
        }
    }

    const handleApply = () => {
        let applicationData = {}
        if (taskDetail !== null) {
            applicationData = {
                user: `/api/users/${user.id}`,
                task: `/api/tasks/${taskDetail.id}`,
                description: taskDetail.description
            }
        }

        if (taskDetail?.requests?.find(request => request.user?.id === user.id)) {
            setAlreadyAppliedDialogOpen(true);
            return
        }

        setIsLoading(true);

        makeRequest(applicationData).then((res: any) => {
            if (res.status === 'Applied') {
                if (isDemoApp) {
                    dispatch(fetchDummyTasks()).then(() => {
                        setIsLoading(false);
                        setSuccessMessage('Your application has been received');
                        dispatch(fetchNotifications(user.id));
                    })
                } else {
                    dispatch(fetchTasks()).then(() => {
                        setIsLoading(false);
                        setSuccessMessage('Your application has been received');
                        dispatch(fetchNotifications(user.id));
                    })
                }
                
            } else {
                throw new Error("Your application did not return a successful status message");
            }
        }).catch(err => {
            setIsLoading(false);
            setErrorMessage('Unfortunately there was an error, please try again');
        })

    }

    const getTaskDetails = (numberTaskId: string | number) => {
        if (isDemoApp) {
            dispatch(fetchDummyTask(numberTaskId)).then(() => {
                if ( selectedTask !== null) {
                
                    const currentSelectedTask = {
                        ...selectedTask,
                        deadline: formatDate(selectedTask.deadline)
                    };
    
                
    
                    if (Number(currentSelectedTask?.id) === numberTaskId) {
                        setTaskDetail(currentSelectedTask);
                        setIsLoading(false);
                    }
                }
            })
        } else {
            dispatch(fetchTask(numberTaskId)).then(() => {
                if ( selectedTask !== null) {
                
                    const currentSelectedTask = {
                        ...selectedTask,
                        deadline: formatDate(selectedTask.deadline)
                    };
    
                
    
                    if (Number(currentSelectedTask?.id) === numberTaskId) {
                        setTaskDetail(currentSelectedTask);
                        setIsLoading(false);
                    }
                }
            })
        }
        
    }

    useEffect(() => {
        const numberTaskId = Number(taskId);
        if (taskDetail === null && numberTaskId && isLoading === true) {
            getTaskDetails(numberTaskId);
        } else {
            if (taskDetail !== null && selectedTask.status !== taskDetail.status) {
                getTaskDetails(numberTaskId);
            }
        }
    
    }, [selectedTask, taskId]);

    return (
        <Box>
            {isLoading && (
                <CircularProgress data-testid="loading-indicator" size='4rem' sx={{ marginTop: '12rem'}}/>
            )}
            {successMessage !== null && (
                <Box sx={{ marginTop: '4rem' }}>
                    <Typography variant='h2' sx={{ marginBottom: '1.2rem' }}>
                        {successMessage}
                    </Typography>
                    <Typography variant='h5' color='primary' sx={{ marginBottom: '0.8rem' }} onClick={() => {
                        setSuccessMessage(null);
                        navigate('/mytasks');
                    }}>
                        Back to My Tasks page
                    </Typography>
                </Box>
            )}
            {errorMessage !== null && (
                <Box sx={{ marginTop: '4rem' }}>
                    <Typography variant='h2'>
                        {errorMessage}
                    </Typography>
                    <Typography variant='h5' color='primary' onClick={() => {
                        setErrorMessage(null)
                    }}>
                        Please try again
                    </Typography>
                </Box>
            )}
            {!isLoading && successMessage === null && errorMessage === null && taskDetail !== null && (
                <>
                    <Box sx={{ marginBottom: '3rem' }}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ marginBottom: '3rem', marginRight: '1rem' }} gutterBottom align="left" variant="h3" color="text.secondary">
                                {taskDetail.title}
                            </Typography>
                            <Chip size='medium' sx={{ background: theme.palette.grey[300], fontSize: '18px', fontWeight: 'bold', paddingRight: '.5rem', paddingLeft: '.5rem' }} label={taskDetail.status} key={1} />
                        </Box>

                        <Typography gutterBottom align="left" variant="body1">
                            {taskDetail.description}
                        </Typography>
                    </Box>
                    <Grid container sx={{ marginBottom: '2rem' }}>
                        <Grid item md={6} xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ marginBottom: '1.2rem', textAlign: "left", display: 'flex' }}>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography style={{ display: 'inline-block' }} variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Client Name:
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography align="left" gutterBottom style={{ display: 'inline-block' }} variant="body1">
                                        {taskDetail.project?.name}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ marginBottom: '1.2rem', textAlign: "left", display: 'flex' }}>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography gutterBottom style={{ display: 'inline-block' }} variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Estimated Time:
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography gutterBottom style={{ display: 'inline-block' }} variant="body1">
                                        {taskDetail.estimatedTime} {taskDetail.estimatedTime && 'hours'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ marginBottom: '1.2rem', textAlign: "left", display: 'flex' }}>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography gutterBottom style={{ display: 'inline-block' }} variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Deadline:
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography gutterBottom style={{ display: 'inline-block' }} variant="body1">
                                        {taskDetail.deadline}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ marginBottom: '1.2rem', textAlign: "left", display: 'flex' }}>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography gutterBottom style={{ display: 'inline-block' }} variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Task Creator:
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography gutterBottom style={{ display: 'inline-block' }} variant="body1">
                                        {taskDetail.owner?.name}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ marginBottom: '1rem', textAlign: "left", display: 'flex' }}>
                                <Box>
                                    <Typography gutterBottom style={{ width: '5rem', display: 'inline-block' }} variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Billable:
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '10rem' }}>
                                    <Typography gutterBottom style={{ display: 'inline-block' }} variant="body1">
                                        {taskDetail.billable ? 'Yes' : 'No'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ marginBottom: '1rem', textAlign: "left", display: 'flex' }}>
                                <Box>
                                    <Typography gutterBottom style={{ display: 'inline-block' }} variant="body1" sx={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>
                                        Jira Link:
                                    </Typography>
                                    <Box>
                                        <Typography gutterBottom style={{ display: 'inline-block', whiteSpace: 'nowrap' }} variant="body1">
                                            <a href={taskDetail.ticketId}>{taskDetail.ticketId}</a>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ marginBottom: '1rem', textAlign: "left" }}>
                                <Box sx={{ marginBottom: '0.5rem' }}>
                                    <Typography gutterBottom variant="body1" sx={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>
                                        Skills Involved:
                                    </Typography>
                                </Box>
                                {
                                    taskDetail.skills.map( (skill, index) => {
                                        return (<Chip sx={{ background: theme.palette.grey[300], height: '20px', marginRight: '1rem', marginBottom: '1rem' }} label={skill.name} key={index} />)
                                    })
                                }
                            </Box>

                        </Grid>
                    </Grid>
                    {taskDetail.owner?.id === user.id ?
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }}}>
                            {taskDetail.status === 'New' && <StyledButton text="Delete Task" type="button" onClick={() => setDeleteDialogOpen(true)}/>}
                            <MessageDialog
                                open={deleteDialogOpen}
                                message={'Do you really want to delete this task? The applications won´t be saved and you would need to create a new one'}
                                confirmMessage={'Confirm, delete the task'}
                                handleClose={() => setDeleteDialogOpen(false)}
                                handleOk={handleDelete}
                            />
                            <StyledButton text="Edit Task" type="button" onClick={
                                () => navigate("/edittask", {state: {task: taskDetail}})
                            }/>
                            <StyledButton text="Mark as Done" type="button" onClick={handleMarkDone}/>
                            <MessageDialog
                                open={doneDialogOpen}
                                message={'You want to mark this task as done out of the normal workflow. If you mark as done now no more applications are possible for this task'}
                                confirmMessage={'Proceed, mark as Done'}
                                handleClose={() => setDoneDialogOpen(false)}
                                handleOk={handleMarkDone}
                            />
                        </Box>
                        :
                        <>
                            { taskDetail.status !== 'Completed'
                                && taskDetail.status !== 'Archived'
                                &&  taskDetail.status !== 'Done'
                                && taskDetail.status !== 'In Progress'
                                && <StyledButton text="Apply" type="button" onClick={handleApply}/>}
                                    <MessageDialog
                                        open={alreadyAppliedDialogOpen}
                                        message={'You have already applied for this task'}
                                        confirmMessage={'Ok'}
                                        handleClose={() => setAlreadyAppliedDialogOpen(false)}
                                        handleOk={() => setAlreadyAppliedDialogOpen(false)}
                                    />
                                </>
                            }
                </>
            )}
        </Box>
    )
};

export default TaskDetails
