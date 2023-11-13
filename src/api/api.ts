import axios, { AxiosError, AxiosResponse } from 'axios';
import { axiosCommonInstance, axiosLoginInstance, axiosPatchInstance } from './config';
import dayjs, { Dayjs } from 'dayjs';

interface IUserProfile {
    displayName: string;
    givenName: string;
    jobTitle: string;
    mail: string;
    officeLocation: string;
    preferredLanguage: string;
    surname: string;
    userPrincipalName: string;
    id: string;
}

const authHeader = () => {
    const bmpUser = localStorage.getItem('bmpUser') || ''; 
    const user = JSON.parse(bmpUser);

    let config = {}
    if (user && user.token) {
        config = {
            headers: { Authorization: `Bearer ${user.token}` }
        };
    } else {
        return {};
    }

    return config;
}

export const loginUser = async (accessToken: string) => {
    const url = '/login'
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.post(url, config);
        return resp;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}

export const getLoginToken = async (msAccessToken: string) => {
    const url = '/login/api';

    const config = {
        headers: { Authorization: `Bearer ${msAccessToken}` }
    };

    const resp = await axiosLoginInstance.get(url,config);
    return resp;
}

export const getTasks = async (queryStr: string) => {
    const url = `/tasks${queryStr}`;
    const config = authHeader();

    try {
        const resp = await axiosCommonInstance.get(url, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error('Get tasks error',err);
    }
};

export const getDummyTasks = async (queryStr: string) => {
    const url = `/dummyData/tasks`;
    
    try {
        const resp = await axios.get(url);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error('Get tasks error',err);
    }
};

export const getTask = async (id: string | number) => {
    const url = `/tasks/${id}`;
    const config = authHeader();

    try {
        const resp = await axiosCommonInstance.get(url, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error('Get tasks error',err);
    }
};

export const makeRequest = async (data: any) => {
    const url = '/requests';
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.post(url, data, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const acceptRequest = async (id: any, data: any) => {
    const url = `/requests/${id}/status`;
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.post(url, data, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const getRequests = async () => {
    const url = '/requests';
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.get(url, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const getRequest = async (id: number | string) => {
    const url = `/requests/${id}`;
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.get(url, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const getSkills = async () => {
    const url = '/skills?pagination=false:disabled';
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.get(url, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const getDummySkills = async () => {
    const url = '/dummyData/skills';

    try {
        const resp = await axios.get(url);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const setSkills = async (skill: string) => {
    const url = '/skills';
    const config = authHeader();
    const data = {
        name: skill
    }
    try {
        const resp = await axiosCommonInstance.post(url, data, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const getProjects = async () => {
    const url = '/projects?pagination=false:disabled';
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.get(url, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const addProject = async (project: any) => {
    const url = '/projects';
    const config = authHeader();
    const data = {
        name: project
    }
    try {
        const resp = await axiosCommonInstance.post(url, data, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const createTasks = async (data: any) => {
    const url = '/tasks';
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.post(url, data, config);
        return resp;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const editTasks = async (id: number, data: any) => {
    const url = `/tasks/${id}`;
    const config = authHeader();
    try {
        const resp = await axiosPatchInstance.patch(url, data, config);
        return resp;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const setTaskDone = async (id: any, data: any) => {
    const url = `/tasks/${id}/status`;
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.post(url, data, config);
        return resp;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const deleteTask = async (id: number) => {
    const url = `/tasks/${id}`;
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.delete(url, config);
        return resp;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const getNotifications = async (id: number | string) => {
    const url = `/notifications?user.id=${id}&exists%5BreadAt%5D=false`;
    const config = authHeader();
    try {
        const resp = await axiosCommonInstance.get(url, config);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export const markNotificationAsRead = async (id: string | number, currentTime: Dayjs ) => {
    const url = `/notifications/${id}`;
    const config = authHeader();
    const data = {
        readAt: currentTime
    }
    try {
        const resp = await axiosPatchInstance.patch(url, data, config);
        return resp;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
