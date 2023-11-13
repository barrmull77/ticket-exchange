import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect } from 'react'
import { axiosCommonInstance, axiosPatchInstance} from './config'
import { logOut } from '../store/features/authSlice';
import { useAppDispatch } from '../store';

const AxiosInterceptor = ({ children } : any) => {
    const dispatch = useAppDispatch();
    useEffect(() => {

        const resInterceptor = (response: AxiosResponse) => {
            return response;
        }

        const errInterceptor = (error: AxiosError) => {
            if (error.response?.status === 401) {
                localStorage.removeItem("bmpUser");
                dispatch(logOut())
            }
        }


        const interceptor = axiosCommonInstance.interceptors.response.use(resInterceptor, errInterceptor);

        return () => axiosCommonInstance.interceptors.response.eject(interceptor);

    }, [dispatch]);
    return children;
}
export { AxiosInterceptor }
