import { useEffect, useState, useRef } from 'react';
import {  useForm, FormProvider } from 'react-hook-form'
import { Box, CircularProgress, Typography, Grid } from '@mui/material';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useAppDispatch, RootState } from '../../store';
import { getProjects, getSkills, createTasks, editTasks, setSkills, addProject } from '../../api/api';
import { fetchTasks } from '../../store/features/taskSlice';
import { fetchSkills, fetchDummySkills } from '../../store/features/skillsSlice';
import { fetchProjects } from '../../store/features/projectsSlice';
import FormWrapper from '../Form/FormWrapper';
import FormTextfield from '../Form/FormTextfield';
import FormTagSelect from '../Form/FormTagSelect';
import FormTagTextField from '../Form/FormTagTextField';
import FormDatePicker from '../Form/FormDatePicker'
import FormSelect from '../Form/FormSelect'
import FormCheckbox from '../Form/FormCheckbox'
import StyledButton from '../StyledButton';
import { useLocation, useNavigate } from 'react-router-dom';

interface ILocationEditTaskState {
    task: ITask
}

function TaskForm() {
    const state = useSelector((state: RootState) => state);
    const user = useSelector((state: RootState) => state.auth.userProfile);
    const isDemoApp = useSelector((state: RootState) => state.auth.isDemoApp);
    const skills = useSelector((state: RootState) => state.skills.skills);
    const projects = useSelector((state: RootState) => state.projects.projects);
    const [projectList, setProjectList] = useState<IFormSelectItem[] | null>(null);
    const [skillList, setSkillList] = useState<ISkill[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [taskId, setTaskId] = useState<number | null>(null);
    const dataFetchedRef = useRef(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const formMethods = useForm<ITaskForm>({
        defaultValues: {
            title: '',
            ticketId: '',
            skills: [],
            deadline: '',
            description: '',
            estimatedTime: '',
            billable: true,
            project: '',
        }
    });

    const validationRules = {
        title: {
            required: 'Please enter a title',
            minLength: {
                value: 10,
                message: "The title must have at least 10 characters"
            },
            maxLength: {
                value: 70,
                message: "The title must not have more than 70 characters"
            }
        },
        link: {
            // required: 'Please enter a link',
            pattern: {
                value: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
                message: "invalid URL"
            }
        },
        skills: {
            required: 'Please enter at least one skill'
        },
        project: {
            required: 'Please select a project'
        },
        description: {
            required: 'Please enter a description',
            minLength: {
                value: 100,
                message: "Please use at least 100 characters for the description"
            }
        },
        deadline: {
            required: 'Please enter a deadline'
        },
        estimatedTime: {
            required: 'Please enter an estimated time'
        }
    }

    const parseSkills = (skillsValues : any) => {
        let filteredSkills: any[] = [];
        let newSkills: any[] = [];
        let parsedSkills: any[] = [];

        skillsValues.map((skill : any) => {
            if (Object.keys(skill).includes('inputValue')) {
                const newValue = skills.filter((obj: any) => obj.name === skill.inputValue);
                newSkills.push(newValue[0]);
                return
            }

            if (typeof skill === 'string' ) {
                const newValue = skills.filter((obj: any) => obj.name === skill);
                newSkills.push(newValue[0]);
                return
            }

            filteredSkills.push(skill);
            return
        });
        [ ...newSkills, ...filteredSkills].map(item => {

            if (item && item['@id'] !== undefined) {
                return parsedSkills.push(item['@id'].toString())
            }
        })

        return parsedSkills;
    }

    const parseProject = (projectValue: any) => {
        if (Object.keys(projectValue).includes('value')) {
            return projectValue.value
        }
        if (Object.keys(projectValue).includes('inputValue') || typeof projectValue === 'string') {

            const filterVal = typeof projectValue !== 'string' ? projectValue.inputValue : projectValue;
            const projectObj = projectList && projectList.filter((obj: any) => obj.name === filterVal );
            if (projectObj && projectObj[0]) {
                return projectObj[0]['@id']
            }

            return
        }
    }

    const onSubmit = async (data: ITaskForm) => {
        setIsLoading(true);
        let skills: ISkill[] = [];
        data.skills = parseSkills(data.skills);
        data.project = parseProject(data.project);

        if (typeof data.estimatedTime === 'string') {
            data.estimatedTime = parseInt(data.estimatedTime);
        }
        setIsLoading(false);
        setSuccess(true);

        if (isDemoApp) {
            console.log('Submitted task data:', data);
        } else {
            if (taskId !== null) {
                delete data.owner;
                data.project = data?.project;

                await editTasks(taskId, data).then((res: any) => {
                    if (res.status === 200) {
                        setIsLoading(false);
                        dispatch(fetchTasks());
                        setSuccess(true);
                        return
                    }
                }).catch(err => {
                    setIsLoading(false);
                    setError(true);
                })
            } else {
                data.status = 'new';
                data['owner'] = `/api/users/${user.id}`;

                await createTasks(data).then((res: any) => {
                    if (res.status === 201) {
                        setIsLoading(false);
                        dispatch(fetchTasks());
                        setSuccess(true);
                        return
                    }
                }).catch(err => {
                    setIsLoading(false);
                    setError(true);
                })
            }
        }
    }

    const getProjectList = () => {
        let projectItems: any[] = [];
        if (isDemoApp) {
            projectItems = [
                {
                    name: 'Clothing company',
                    value: '1'
                },
                {
                    name: 'Finance company',
                    value: '2'
                },
                {
                    name: 'TV streaming',
                    value: '3'
                }
            ]
        } else {
            return getProjects().then(res => {

                res['hydra:member'].map((item: any) => {
                    projectItems.push({ name: item.name, value: item['@id'] })
                })
            
            })
        }
        return setProjectList(projectItems);
    }

    const getSkillList = async () => {
        // await dispatch(fetchSkills())
        // await dispatch(fetchDummySkills())
        if (isDemoApp) {
            const skillItems = [
                {
                    "@id": "1",
                    "id": "1",
                    "name": "PHP",
                    "taskCount": 0,
                    "selected": false
                },
                {
                    "@id": "2",
                    "id": "2",
                    "name": "Javascript",
                    "taskCount": 0,
                    "selected": false
                },
                {
                    "@id": "3",
                    "id": "3",
                    "name": "React",
                    "taskCount": 0,
                    "selected": false
                }
            ]
            return setSkillList(skillItems);
        } else {
            await dispatch(fetchSkills())
            await dispatch(fetchDummySkills())
        }
        
    }

    const getData = async () => {
        
        if (projectList === null) {
            await getProjectList();
        }

        if (skillList === null) {
            await getSkillList();
        }
    }

    useEffect(() => {
        if (location.state) {
            const { task } = location.state as ILocationEditTaskState;

            if (task) {
                if (task.id) {
                    setTaskId(task.id);
                }
                let estimatedTime: string | number | undefined = task.estimatedTime;

                if (typeof estimatedTime === 'string' && estimatedTime !== 'undefined') {
                    estimatedTime = parseInt(estimatedTime);
                }

                formMethods.reset({
                    title: task.title || '',
                    ticketId: task.ticketId || '',
                    deadline: task.deadline || '',
                    description: task.description || '',
                    estimatedTime: estimatedTime || '',
                    billable: task.billable,
                    skills: task.skills || [],
                    project: task.project?.name || ''
                });
            }
        }
    }, [location.state]);

    useEffect(() => {
        if (success) {
            navigate('/mytasks')
        }
    }, [success])

    useEffect(() => {
        
        if (projects !== null && projects.length > 0) {
            setProjectList(projects)
        }
    }, [projects])

    useEffect(() => {
        if (skills !== null && skills.length > 0) {
            setSkillList(skills)
        }
    }, [skills])

    useEffect(() => {
        
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        setIsLoading(true);
        getData().then(res => {
            setIsLoading(false);
        })
    }, [])

    return (
        <>
            {isLoading && (<CircularProgress size='4rem' sx={{ marginTop: '12rem' }} />)}
            {success && (
                <Box sx={{ marginTop: '4rem' }}>
                    <Typography variant='h2' sx={{ marginBottom: '1.2rem' }}>
                        Your Task has been submitted!
                    </Typography>
                </Box>
            )}
            {error && (
                <Box sx={{ marginTop: '4rem' }}>
                    <Typography variant='h2'>
                        Unfortunately there was an error when creating your task
                    </Typography>
                    <Link to='/createTask' style={{ textDecoration: 'none' }}>
                        <Typography variant='h5' color='primary' onClick={() => {
                            formMethods.reset();
                            setError(false)
                        }}>
                            Please try again
                        </Typography>
                    </Link>
                </Box>
            )}
            {projectList && skillList && !isLoading && !success && !error && (
                <FormProvider {...formMethods}>
                    <FormWrapper
                        title='Create a task'
                        handleFormSubmit={formMethods.handleSubmit(onSubmit)}
                    >
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                            <Grid item md={6} xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <FormTextfield name="title" label="Title" validationRules={validationRules.title} />
                                <FormTextfield name="ticketId" label="Jira Link" validationRules={validationRules.link} />
                                <FormTagTextField name="skills" label="Skills" multiple={true} items={skillList} validationRules={validationRules.skills} setData={data => setSkills(data)} dataUpdate={() => dispatch(fetchSkills())} />
                                <FormTextfield name="estimatedTime" type={'number'} label="Estimated Time in hours" validationRules={validationRules.estimatedTime} />
                            </Grid>
                            <Grid item md={6} xs={12} sx={{ display: 'flex', flexDirection: 'column', }}>
                                <FormDatePicker name="deadline" label="Deadline" validationRules={validationRules.deadline} />
                                <FormTagTextField name="project" label="Client" multiple={false} items={projectList} validationRules={validationRules.project} setData={data => addProject(data)} dataUpdate={() => dispatch(fetchProjects())} />
                                <FormTextfield name="description" label="Details" rows={7} validationRules={validationRules.description} />
                                <FormCheckbox name="billable" label="Billable?" />
                            </Grid>
                        </Grid>
                        <StyledButton text="Submit" type="submit" />
                    </FormWrapper>
                </FormProvider>
            )}
        </>

    );
}

export default TaskForm;
