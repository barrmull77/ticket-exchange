import React from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import HomeLayout from './layout/HomeLayout';
import AllTasksPage from './pages/AllTasksPage';
import MyTasksPage from './pages/MyTasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import HomePage from './pages/HomePage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import LoginPage from './pages/LoginPage';

const AppRoutes = () => {
    const location = useLocation();
    const routeProps = (isLoggedIn: boolean) => {
        return [
            {
                element: <HomeLayout />,
                children: [
                    {
                        path: '/',
                        element: isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />,
                    },
                    {
                        path: '/login',
                        element: <LoginPage />,
                    },
                    {
                        path: '/home',
                        element: isLoggedIn ? <HomePage /> : <Navigate to="/login" />,
                    },
                    {
                        path: '/alltasks',
                        element: isLoggedIn ? <AllTasksPage /> : <Navigate to="/login" state={{ pathname: location.pathname, search: location.search }}/>,
                    },
                    {
                        path: '/mytasks',
                        element: isLoggedIn ? <MyTasksPage /> : <Navigate to="/login" />,
                    },
                    {
                        path: '/createtask',
                        element: isLoggedIn ? <CreateTaskPage /> : <Navigate to="/login" />,
                    },
                    {
                        path: '/edittask',
                        element: isLoggedIn ? <EditTaskPage /> : <Navigate to="/login" />,
                    },
                    {
                        path: '/taskdetails/:taskId',
                        element: isLoggedIn ? <TaskDetailsPage /> : <Navigate to="/login" state={{ pathname: location.pathname }}/>,
                    }
                ]
        }]
    }

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    const routes = useRoutes(routeProps(isLoggedIn));

    return routes;
};

export default AppRoutes;
