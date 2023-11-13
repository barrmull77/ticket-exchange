import React, { useEffect, useState, useRef } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, RootState } from '../../store';
import { styled } from '@mui/material/styles';
import { fetchTasks, fetchDummyTasks } from '../../store/features/taskSlice';
import theme from '../../themes/BMThemes';

interface IQuickFilters {
    skillList : any
}

const Quickfilters = ({ skillList } : IQuickFilters) => {
    const isMountedRef = useRef(false);
    const isParamLoadedRef = useRef<boolean>(false);
    const isDemoApp = useSelector((state: RootState) => state.auth.isDemoApp);
    const [filtersLoaded, setFiltersLoaded] = useState<boolean>(false);
    const [filterRequest, setFilterRequest] = useState<string>('');
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [urlParamsArray, setUrlParamsArray] = useState<{ name: string, type: string, selected: boolean }[]>([]);

    const updateFilterRequest = (filterArray: any) => {
        const initFilterRequestStr = 'order[createdAt]=desc';
        const filterRequestParams = new URLSearchParams();

        filterArray.map((filterItem: any, index: number) => {
            if (filterItem.type === 'billable') {
                if (filterItem.selected === true) {
                    filterRequestParams.append(filterItem.type, filterItem.name)
                }
            } else {
                const queryParamUrl = filterItem.type === 'Skill' ? 'skills.name[]' : 'status[]';
                if (filterItem.selected === true) {
                    filterRequestParams.append(queryParamUrl, filterItem.name)
                }
            }
        });
        const filterRequestStr = filterRequestParams.toString().length > 0 ? `?${filterRequestParams.toString()}` : '?order[createdAt]=desc'

        return filterRequestStr;
    }

    const updateFieldChanged = (index: any) => {
        let newArr = [...urlParamsArray];

        // Only one billable option can be set to true
        if ( index === 0 ) newArr[1].selected = false;
        if ( index === 1) newArr[0].selected = false;

        newArr[index].selected = !newArr[index].selected;
        setUrlParamsArray(newArr);
    }

    const setUrlParams = () => {
        const selectedUrlParams = urlParamsArray.filter((urlParam : any) => urlParam.selected);
        const urlParamsStr = selectedUrlParams.map((item, index) => `${item.type}=${item.name}`)
        return urlParamsStr.join('&');
    }

    const initFilters = async () => {
        // Init filter params that are not pulled from the API
        let urlParams = [
            { name: 'true', type: 'billable', selected: false },
            { name: 'false', type: 'billable', selected: false },
            { name: 'New', type: 'status', selected: false },
            { name: 'Pending', type: 'status', selected: false },
            { name: 'In Progress', type: 'status', selected: false },
            { name: 'Done', type: 'status', selected: false },
        ]
        
        const addSkillFilters = skillList.map((skill: any) => {
            const newSkillObj: any = {
                name: skill.name,
                type: 'Skill',
                selected: false
            }
            return newSkillObj;
        });

        urlParams = [...urlParams, ...addSkillFilters];

        setUrlParamsArray(urlParams);
        const initUrlParamsStr = await initUrlParams(urlParams);
        return initUrlParamsStr;
    }

    const initUrlParams = async (urlParams: any) => {
        if (location.search.length > 0 && urlParams.length > 0) {
            const initUrlStr = location.search.substring(1, location.search.length).split('&');
            const initUrlParamsArray = initUrlStr.map(item => item.split('='));
            let updateParamsArray = urlParams;
            initUrlParamsArray.forEach((element, index) => {
                const urlParamsDecoded = decodeURIComponent(element[1]);
                const selectedIndex = updateParamsArray.findIndex((param: any) => param.name === urlParamsDecoded);
                if (selectedIndex !== -1) {
                    updateParamsArray[selectedIndex].selected = true;
                }
            })
            setUrlParamsArray(updateParamsArray);
            const initParams = await updateFilterRequest(updateParamsArray);
            return initParams
        }
        return
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            const urlParamsStr = setUrlParams();

            if (urlParamsStr.length > 0) {
                window.history.replaceState({} , '', `${location.pathname}?${urlParamsStr}`)
            } else {
                window.history.replaceState({} , '', location.pathname);
            }
            const initParams = updateFilterRequest(urlParamsArray);
            setFilterRequest(initParams);
        },  200)

        return () => {
            clearTimeout(timer)
        }
    }, [urlParamsArray]);

    useEffect(() => {
        
        const initData = async () => {
            const data = await initFilters();
            isDemoApp ? dispatch(fetchDummyTasks()) : dispatch(fetchTasks(data));
        }

        if (!isMountedRef.current) {
            initData();
            isMountedRef.current = true
        }

    }, [])

    useEffect(() => {
        if (filterRequest.length > 0) {
            isDemoApp ? dispatch(fetchDummyTasks()) : dispatch(fetchTasks(filterRequest));
        }
    }, [filterRequest])

    return (
        <>
            <Typography sx={{ textAlign: 'left', marginBottom:'.5rem' }}>
                Quickfilter: Skill
            </Typography>
            <Box sx={{ textAlign: 'left', display: 'flex', marginLeft: '4rem', flexWrap: 'wrap' }}>
                {urlParamsArray.map((filterChip, index) => {
                    if (filterChip.type === 'Skill') {
                        return (
                            <Box onClick={() => updateFieldChanged(index)}>
                                <Chip
                                    key={index} sx={{ background: filterChip.selected ? theme.palette.primary.main : theme.palette.secondary.main, height: '20px', marginRight: '.5rem', marginBottom: '.5rem' }} label={filterChip.name} />
                            </Box>
                        )
                    }

                })}
            </Box>
            <Typography sx={{ textAlign: 'left', marginBottom:'.5rem', marginTop:'1.2rem' }}>
                Quickfilter: Task Status
            </Typography>
            <Box sx={{ textAlign: 'left', display: 'flex', marginLeft: '4rem' }}>
                {urlParamsArray.map((filterChip, index) => {
                    if (filterChip.type === 'status') {
                        return (
                            <Box onClick={() => updateFieldChanged(index)}>
                                <Chip
                                    key={index} sx={{ background: filterChip.selected ? theme.palette.primary.main : theme.palette.secondary.main, height: '20px', marginRight: '.5rem' }} label={filterChip.name} />
                            </Box>
                        )
                    }
                })}
            </Box>
            <Typography sx={{ textAlign: 'left', marginBottom:'.5rem', marginTop:'1.2rem' }}>
                Quickfilter: Billable?
            </Typography>
            <Box sx={{ textAlign: 'left', display: 'flex', marginLeft: '4rem' }}>
                {urlParamsArray.map((filterChip, index) => {
                    if (filterChip.type === 'billable') {
                        return (
                            <Box onClick={() => updateFieldChanged(index)}>
                                <Chip
                                    key={index} sx={{ background: filterChip.selected ? theme.palette.primary.main : theme.palette.secondary.main, height: '20px', marginRight: '.5rem' }} label={filterChip.name === 'true' ? 'Yes' : 'No'} />
                            </Box>
                        )
                    }
                })}
            </Box>
        </>
    )
}

export default Quickfilters;
