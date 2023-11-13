import React, { useEffect, useState } from 'react';
import { Box, Badge, Button, Card, CardActionArea, CardContent, Chip, CircularProgress, Grid, Link, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import theme from '../../themes/BMThemes';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import Quickfilters from '../Quickfilters'

const StyledTaskCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    minWidth: 200,
    height: '15rem',
    width: '100%',
    flex: 1,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '8px',
    boxShadow: 'none',
    textAlign: 'left',
    marginBottom: '.8rem',
    [theme.breakpoints.up('sm')]: {
        marginBottom: '1rem',
        height: '12.5rem',
    },
    [theme.breakpoints.up('md')]: {
        height: '16rem',
    },
    [theme.breakpoints.up('lg')]: {
        marginBottom: '1.2rem',
        height: '14.5rem',
    }
}));

const StyledLink = styled(Link)(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
    },

}));

const StyledTaskButton = styled(Button)(({ theme }) => ({
    background: theme.palette.primary.main,
    color: '#fff',
    lineHeight: 1,
    borderRadius: '1rem'
}));

const TaskList: React.FC<ITaskList> = ({ ...props }) => {
    const [isDesktop, setIsDesktop] = useState<boolean>(false);
    const tasksIsLoading = useSelector((state: RootState) => state.task.isLoading);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth > theme.breakpoints.values.lg
                ? setIsDesktop(true) : setIsDesktop(false)
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());

        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        };
    }, []);

    return (
        <Box>
            {tasksIsLoading && (
                <CircularProgress size='4rem' sx={{ marginTop: '12rem'}}/>
            )}
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>

                {!tasksIsLoading && props.taskList && props.taskList.length > 0 && props.taskList.map(item => {
                    const deadline = dayjs(item.deadline).format('DD.MM.YYYY')
                    return (
                        <Grid item md={6} xs={12} key={item.id}>
                            <StyledLink  underline="none"
                            onClick={
                                () => navigate(`/taskdetails/${item.id}`, {state: { isOwner: location.pathname === '/mytasks' ? true : false}})
                            }>
                            <StyledTaskCard>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, wordBreak: 'break-word' }}>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}} >
                                        <Typography variant="h3" color="text.secondary" gutterBottom>
                                            {item.title}
                                        </Typography>
                                        <Chip sx={{ background: theme.palette.grey[300], height: '20px', marginLeft: '.5rem', marginRight: '.5rem' }} label={item.status} />
                                    </Box>


                                    <Typography variant="body1">
                                        {isDesktop ? item.description.split(' ').slice(0, 22).join(' ')
                                            : item.description.split(' ').slice(0, 12).join(' ')}...
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '5rem', justifyContent: 'space-between', marginTop: 'auto', width: '100%' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            Deadline: {deadline}
                                        </Typography>

                                        {item.skills && (
                                            <Box>
                                                {item.skills.map((item: ISkill) => (
                                                    item.name ? <Chip sx={{ background: theme.palette.grey[300], height: '20px', marginRight: '.5rem' }} label={item.name} key={item.id} /> : null
                                                ))}
                                            </Box>
                                        )}

                                        {location.pathname === '/mytasks' ? (
                                            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {item.billable ? (
                                                    <Typography sx={{ fontWeight: '600', fontSize: '1rem', color: theme.palette.primary.main }}>
                                                        Billable
                                                    </Typography>
                                                ) : (
                                                    <Typography sx={{ fontWeight: '600', fontSize: '1rem', color: theme.palette.common.black }}>
                                                        Non-Billable
                                                    </Typography>
                                                )}
                                                {item.requests && <Typography variant="body2" sx={{ marginLeft: 'auto', marginRight: '1rem', color: theme.palette.primary.main }}>{item.requests?.length} Requests</Typography>}

                                                <StyledTaskButton
                                                    variant="contained"
                                                    size="small"
                                                    // onClick={
                                                    //     () => navigate(`/taskdetails/${item.id}`, {state: { isOwner: true}})
                                                    // }
                                                    >
                                                    View
                                                </StyledTaskButton>
                                            </Box>

                                        ) : (
                                            <StyledTaskButton
                                                sx={{ marginRight: 'auto' }}
                                                variant="contained"
                                                size="small"
                                                // onClick={
                                                //     () => navigate(`/taskdetails/${item.id}`, {state: { isOwner: false}})
                                                // }
                                                >
                                                View more
                                            </StyledTaskButton>
                                        )}

                                    </Box>
                                </CardContent>
                            </StyledTaskCard>
                            </StyledLink>
                        </Grid>
                    )
                })}
                {!tasksIsLoading && props.taskList && props.taskList.length === 0 &&  (
                    <Typography variant="body1" sx={{ textAlign: 'left', marginLeft: '2rem' }}>
                        {window.location.href.includes('?') ? 'Unfortunately we couldnt find any results to match your criteria, please try resetting the filters'
                            : 'Currently there are no tasks available '}
                    </Typography>
                )}
            </Grid>
        </Box>
    )
}

export default TaskList;
