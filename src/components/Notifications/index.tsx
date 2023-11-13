import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { Box, Divider, Button, IconButton, MenuItem, Typography, Badge, Paper, MenuList } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { fetchNotifications } from '../../store/features/notificationsSlice';
import { markNotificationAsRead, acceptRequest, getRequest } from '../../api/api';
import { RootState } from '../../store';
import { fetchMyTasks, fetchAppliedTasks, fetchTasks, fetchTask, fetchDummyTasks } from '../../store/features/taskSlice';
import theme from '../../themes/BMThemes';
import dayjs from 'dayjs';
import MessageDialog from '../MessageDialog';

const StyledTaskButton = styled(Button)(({ theme }) => ({
    background: theme.palette.primary.main,
    color: '#fff',
    lineHeight: 1,
    borderRadius: '1rem'
}));

interface IAcceptMessageDetails {
    notificationId: string | number
    requestId?: string | number | null
    details: string | JSX.Element
    status: string
}

const Notifications = () => {
    const user = useSelector((state: RootState) => state.auth.userProfile);
    const notifications = useSelector((state: RootState) => state.notifications.notifications);
    const [notificationsShowing, setNotificationsShowing] = useState<boolean>(false);
    const [acceptDialogOpen, setAcceptDialogOpen] = useState<boolean>(false);
    const [acceptMessageDetails, setAcceptMessageDetails] = useState<null | IAcceptMessageDetails>(null);
    const [messageType, setMessageType] = useState<null | string>(null);
    const [notificationCounter, setNotificationCounter] = useState(4);
    const [notificationsList, setNotificationsList] = useState([]);
    const [requestNotifications, setRequestNotifications] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const location = useLocation();

    const showNotifications = () => {
        if (notificationsList.length > 0) {
            setNotificationsShowing(notificationsShowing => !notificationsShowing)
        }
    }

    const handleShow = (notificationId: string, notificationLink: string, notificationType: string) => {
        const notificationFormattedId = notificationId.replace('/api/notifications/', '');
        const selectedNotification = requestNotifications.find(notification => notification['@id'] === notificationId);

        if (notificationType === 'Accepted') {
            const taskId = selectedNotification.request.task['@id'].replace('/api/tasks/', '');
            const dialogMessageStr = <>Awesome! your offer to help on <a href={`/taskdetails/${selectedNotification.request.task.id}`}>{selectedNotification.title}</a>&nbsp;
                 was accepted by {selectedNotification.request.taskOwner}, please get in contact via Teams or E-Mail to specify the work needed</>;

            setAcceptMessageDetails({
                notificationId: notificationFormattedId,
                details: dialogMessageStr,
                status: notificationType
            });
            setAcceptDialogOpen(true);
        }

        if (notificationType === 'Requested') {
            const taskId = selectedNotification.request.task['@id'].replace('/api/tasks/', '');
            let dialogMessageStr = <></>;
            let messageStatus = '';

            if (selectedNotification.request && selectedNotification.request.status !== 'In Progress') {
                dialogMessageStr = <>{selectedNotification.request.user.name} has offered to help with the task:
                    <a href={`/taskdetails/${taskId}`}>{selectedNotification.request.task.title}</a>,
                    Please click accept below to accept their offer then please get in contact
                    via Teams or E-Mail to specify the work needed. Once the task is done,
                    please come back to <a href={`/taskdetails/${selectedNotification.request.task.id}`}>{selectedNotification.request.task.title}</a>&nbsp;
                    and Mark it as Done!</>;

                messageStatus = notificationType

            } else {
                dialogMessageStr = <>{selectedNotification.request.user.name} has offered to help with the task:
                    <a href={`/taskdetails/${taskId}`}>{selectedNotification.request.task.title}</a>,
                    but you have already accepted an applicant. Click Ok to dismiss notification</>;

                messageStatus = selectedNotification.request.status
            }

            setAcceptMessageDetails({
                notificationId: notificationFormattedId,
                requestId: selectedNotification.request.id,
                details: dialogMessageStr,
                status: messageStatus
            });
            setAcceptDialogOpen(true);

        }

        if (notificationType === 'Completed' || notificationType === 'In Progress') {
            const taskId = selectedNotification.link.replace('/api/tasks/', '');
            const dialogMessageStr = <>Thanks for applying for <a href={`/taskdetails/${taskId}`}>{selectedNotification.title}</a>&nbsp;
                but it appears somebody else is already working on the task or it was marked as done by the Task creator.
                Please check the <a href='/alltasks'>All tasks Page</a> for more tasks where help is needed!</>;

            setAcceptMessageDetails({
                notificationId: notificationFormattedId,
                details: dialogMessageStr,
                status: notificationType
            });
            setAcceptDialogOpen(true);
        }

        if (notificationType === 'Done') {
            const taskId = selectedNotification.link.replace('/api/tasks/', '');
            const dialogMessageStr = <>The task: <a href={`/taskdetails/${taskId}`}>{selectedNotification.title}</a> has been marked as done by the task creator. Thank you for your help!</>
            setAcceptMessageDetails({
                notificationId: notificationFormattedId,
                details: dialogMessageStr,
                status: notificationType
            });
            setAcceptDialogOpen(true);
        }

    }

    const resetTasks = () => {
        const locationPathname = location.pathname

        if (locationPathname.includes('taskdetails')) {
            const taskId = locationPathname.replace('/taskdetails/', '');
            dispatch(fetchTask(taskId));
            return
        }

        if (locationPathname === '/mytasks') {
            dispatch(fetchMyTasks(user.id));
            dispatch(fetchAppliedTasks(user.id));
            return
        }

        if (locationPathname === '/alltasks') {
            // dispatch(fetchTasks());       
            dispatch(fetchDummyTasks());
            return
        }
    }

    const handleOk = () => {
        const currentTime = dayjs();

        if (acceptMessageDetails?.status === 'Requested') {
            const data = { action: 'accept' };

            acceptRequest(acceptMessageDetails?.requestId, data).then(res => {
                setAcceptDialogOpen(false)
                markNotificationAsRead(acceptMessageDetails?.notificationId ,currentTime).then(res => {
                    dispatch(fetchNotifications(user.id));
                    resetTasks();
                });
            });

            return
        }

        if (acceptMessageDetails?.notificationId) {
            markNotificationAsRead(acceptMessageDetails?.notificationId ,currentTime).then(res => {
                setAcceptDialogOpen(false)
                dispatch(fetchNotifications(user.id));
                resetTasks();
            })

            return
        }
        resetTasks();
        setAcceptDialogOpen(false);
    }

    useEffect(() => {
        if (notifications !== null && notifications?.length > 0) {
            // Initialise all notifications
            const orderedNotifcations: any = [...notifications].reverse();
            setNotificationsList(orderedNotifcations);

            orderedNotifcations.map( async(notification: any) => {
                const requestStr = notification.link.replace('/api/requests/', '');

                if (notification.type === 'Done'  || notification.type === 'Completed' || notification.type === 'In Progress') {
                    setRequestNotifications(requestNotifications => [notification, ...requestNotifications])
                    return
                }
                // Get requests for each notification, if request is no longer available mark notificaton as read
                const requestResp = await getRequest(requestStr);
                if (requestResp) {
                    const newNotificationObj = {
                        request: requestResp,
                            ...notification
                    }
                    setRequestNotifications(requestNotifications => [newNotificationObj, ...requestNotifications])
                } else {

                    const currentTime = dayjs();
                    const notificationId = notification['@id'].replace('/api/notifications/', '');
                    markNotificationAsRead(notificationId ,currentTime).then(res => {
                        dispatch(fetchNotifications(user.id));
                    })
                }
            })
        } else {
            setNotificationsList([]);
        }
    }, [notifications]);

    // useEffect(() => {
    //     if (user?.id) {
    //         dispatch(fetchNotifications(user.id));
    //     }

    //     // Notifications are updated every 3 mins
    //     const timer = setTimeout(() => {
    //         if (user?.id) {
    //             dispatch(fetchNotifications(user.id));
    //         }
    //     }, 180000);

    //     dayjs.extend(relativeTime);

    //     return () => clearTimeout(timer);
    // }, []);

    return (
       <Box>

          <IconButton sx={{display: 'block'}} onClick={showNotifications} color="primary">
            <Badge badgeContent={notificationsList.length !== undefined ? notificationsList.length : 0} color="primary">
                <NotificationsIcon sx={{
                    fontSize: '1.2rem'
                }} />
            </Badge>
            {notificationsShowing && <Paper sx={{
                    width: 230,
                    zIndex: 2,
                    maxHeight: '25rem',
                    [theme.breakpoints.up('xl')]: {
                    position: "absolute",
                        left:'1.1rem',
                        right: "auto" ,
                        width: '17rem',
                        bottom: 'auto',
                        top: '1.5rem',
                    },
                    [theme.breakpoints.up('sm')]: {
                    position: "absolute",
                        left: "auto",
                        right: '1rem' ,
                        width: '18rem',
                        bottom: 'auto',
                        top: '1.5rem',
                    },
                    [theme.breakpoints.up('xs')]: {
                        position: 'fixed',
                        left:0,
                        right: 0 ,
                        top: '4rem',
                        bottom: 0,
                        width: '100%',
                        overflow: 'scroll'
                    },
                }}>
                            <MenuList>
                                {notificationsList.length > 0 && notificationsList.map((data: any, index: number) => {
                                    return(
                                        <>
                                          <MenuItem onClick={() => handleShow(data['@id'], data.link, data.type )} sx={{ display: 'flex', flexDirection: 'column', whiteSpace: 'normal' }} >
                                                <Typography variant="inherit" sx={{ textAlign: 'initial', alignSelf: 'flex-start' }}>
                                                    There has been been update regarding  {data.length > 30 ? data.split(' ').slice(0, 7).join(' ') + '...' : data.title}
                                                </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic', alignSelf: 'end' }}>{dayjs(data.createdAt).fromNow()}</Typography>
                                            </Box>
                                         </MenuItem>
                                        <Divider sx={{ marginBottom: '10px' }} />
                                        </>
                                    )
                                })}
                            </MenuList>
                        </Paper>}
                    </IconButton>
               <MessageDialog
                   open={acceptDialogOpen && acceptMessageDetails !== null}
                   message={acceptMessageDetails?.details}
                   confirmMessage={acceptMessageDetails?.status === 'Requested' ? 'Accept' : 'Ok'}
                   handleClose={() => setAcceptDialogOpen(false)}
                   handleOk={handleOk}
               />
        </Box>
    )
}

export default Notifications;
