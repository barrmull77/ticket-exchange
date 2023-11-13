import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AppBar, Box, Container, Drawer, Divider, Button, IconButton, Toolbar, } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import LaunchBooksIcon from '@mui/icons-material/LibraryBooks';
import theme from '../../themes/BMThemes';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const StyledAppHeader = styled(AppBar)<AppBarProps>(({ theme }) => ({
    boxShadow: 'none',
    backgroundColor: theme.palette.background.default,
    borderBottom: `3px solid ${theme.palette.primary.main}`
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',

    [theme.breakpoints.up('lg')]: {
        margin: '0 auto',
        minHeight: '72px',
        width: '1140px',
    },
}));

const StyledDesktopBox = styled(Box)(({ theme }) => ({
    display: 'none',
    justifyContent: 'space-between',
    marginLeft: 'auto',

}));

const StyledCompanyLogo = styled('img')(({ theme }) => ({
    width: '54px',
    [theme.breakpoints.up('lg')]: {
        width: '66px'
    },
}));

const StyledTitleBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: '.15rem',
    [theme.breakpoints.up('lg')]: {
        flexDirection: 'row',
        alignItems: 'center'
    },
}));

const StyledAppTitle = styled("span")(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: '1.4rem',
    fontWeight: '600',
    lineHeight: '1',
    textDecoration: 'none',

    [theme.breakpoints.up('lg')]: {
        fontSize: '2.6rem'
    }
}));

const StyledNavButtons = styled(Button)(({ theme }) => ({
    fontWeight: 600,
    "& .MuiButton-startIcon": {
        marginLeft: 6,
        marginRight: 6,
    }
}));

interface AppBarProps {
    open?: boolean;
    drawerOpen?: () => void;
}

const Header = ({ open, drawerOpen }: AppBarProps) => {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    const toggleDrawer = (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setOpenDrawer(open);
        };

    const handlePageNav = (path: string) => {
        setOpenDrawer(false);
        navigate(path);
    }

    useEffect(() => {
        dayjs.extend(relativeTime);
        const setResponsiveness = () => {
            return window.innerWidth < theme.breakpoints.values.lg
                ? setIsMobile(true) : setIsMobile(false)
        };

        setResponsiveness();

        window.addEventListener("resize", () => setResponsiveness());

        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        };
    }, []);



    return (
        <StyledAppHeader elevation={0}>
            <StyledToolbar>
                {isMobile && (
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <IconButton edge="start" onClick={toggleDrawer(!open)}>
                            <MenuIcon data-testid="menu-icon" sx={{ fontSize: { xs: '2rem', sm: '2.2rem' }, color: theme.palette.text.primary }} />
                        </IconButton>
                        <Drawer
                            anchor={'left'}
                            open={openDrawer}
                            variant="temporary"
                            onClose={toggleDrawer(false)}
                        >
                            <Button
                                onClick={toggleDrawer(false)}
                                component="div"
                                sx={{ display: 'flex', height: '62px' }}
                            >
                                <IconButton sx={{ mb: 2, margin: 'auto' }}>
                                    <CloseIcon data-testid="close-icon" sx={{ fontSize: '36px' }} />
                                </IconButton>
                                <Link to="/home" style={{ textDecoration: 'none'}}>
                                    <StyledTitleBox>
                                        {/* <Box sx={{margin: '0.2rem 1.5rem 0px 0px'}}>
                                            <img width="66" src="" />
                                        </Box> */}
                                        <StyledAppTitle>TicketExchange</StyledAppTitle>
                                    </StyledTitleBox>
                                </Link>
                            </Button>
                            <Divider sx={{ marginBottom: '10px' }} />
                            <Container sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '160px',
                                justifyContent: 'space-around',
                                alignItems: 'flex-start',
                            }}>

                                    <StyledNavButtons
                                        variant="text"
                                        color="primary"
                                        id="switch-button"
                                        sx={{ fontWeight: '600' }}
                                        onClick={() => handlePageNav('/mytasks')}
                                        startIcon={<LaunchBooksIcon />}
                                    >
                                        My Tasks
                                    </StyledNavButtons>

                                    <StyledNavButtons
                                        variant="text"
                                        color="primary"
                                        id="switch-button"
                                        sx={{ fontWeight: '600' }}
                                        onClick={() => handlePageNav('/alltasks')}
                                        startIcon={<FormatListBulleted />}
                                    >
                                        All Tasks
                                    </StyledNavButtons>


                                <StyledNavButtons
                                    variant="text"
                                    color="primary"
                                    id="create-task-button"
                                    sx={{ fontWeight: '600' }}
                                    onClick={() => handlePageNav('/createtask')}
                                    startIcon={<AddIcon />}
                                >
                                    Create Task
                                </StyledNavButtons>
                            </Container>
                        </Drawer>
                    </Box>
                )}
                <Link to="/home" style={{ textDecoration: 'none'}}>
                    <StyledTitleBox>
                        {/* <Box sx={{margin: '0.2rem 1.5rem 0px 0px'}}>
                            <img width="66" src="" />
                        </Box> */}
                        <StyledAppTitle>TicketExchange</StyledAppTitle>
                    </StyledTitleBox>
                </Link>
                {!isMobile && (
                    <StyledDesktopBox
                        component="div"
                        sx={{
                            display: { xs: 'none', lg: 'flex' },
                            justifyContent: 'space-between',
                            marginLeft: 'auto' }}
                    >

                            <StyledNavButtons
                                variant="text"
                                color="primary"
                                id="switch-button-desktop"
                                sx={{ fontWeight: '600' }}
                                onClick={() => handlePageNav('/mytasks')}
                                startIcon={<LaunchBooksIcon />}
                            >
                                My Tasks
                            </StyledNavButtons>

                            <StyledNavButtons
                                variant="text"
                                color="primary"
                                id="switch-button-desktop"
                                sx={{ fontWeight: '600' }}
                                onClick={() => handlePageNav('/alltasks')}
                                startIcon={<FormatListBulleted />}
                            >
                                All Tasks
                            </StyledNavButtons>

                        <StyledNavButtons
                            variant="text"
                            color="primary"
                            id="create-task-button-desktop"
                            onClick={() => handlePageNav('/createtask')}
                            sx={{ fontWeight: '600', marginRight: '1.5rem' }}
                            startIcon={<AddIcon />}
                        >
                            Create Task
                        </StyledNavButtons>
                    </StyledDesktopBox>
                )}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                {/* Todo - add notifications feature -  <Notifications /> */}    
                {/* Todo - create profile page and replace profile icon */
                   /* <IconButton sx={{
                        marginLeft: {
                            xs: 'auto',
                            lg: 'initial'
                        }
                    }} color="primary">
                        <PersonIcon sx={{
                            fontSize: '2.1rem'
                        }} />
                    </IconButton> */}
                </Box>
            </StyledToolbar>
        </StyledAppHeader>
    )
}

export default Header;
