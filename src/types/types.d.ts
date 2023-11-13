
interface ISkill {
    '@id': string,
    id?: string,
    name?: string,
    taskCount?: number,
    selected?: boolean
}

interface ISkillList {
    content: Array<ISkill>
}

interface ITask {
    id?: number
    title: string
    description: string
    deadline: string
    ticketId: string
    skills: ISkill[]
    billable?: boolean
    requests?: IRequest[]
    project?: IProject
    estimatedTime?: string | number
    status?: string
    owner?: IUser
}

interface IRequest {
    '@id': string,
    user: IUser
}

interface ITaskList {
    taskListTitle: string
    taskList: Array<ITaskItem> | null
    skillList?: ISkill[] | null
}

interface ITaskForm {
    title?: string
    ticketId?: string
    skills?: ISkill[]
    deadline?: string
    description?: string
    estimatedTime?: string | number
    billable?: boolean
    // Todo remove any type
    project?: string | any
    status?: string
    owner?: IUser | string
}

interface IFormValidation {
    required?: string
    minLength?: IMinLengthValidation
    pattern?: any
}

interface IMinLengthValidation {
    value: number
    message: string
}
interface IProject {
    '@id'?: string,
    code: string
    createdAt: string
    id: number
    name: string
}

interface IFormSelectProps {
    label: string;
    name: string;
    items: IFormSelectItem[];
    validationRules: IFormValidation;
}

interface IFormSelectItem {
    value: string,
    name: string,
    '@id'?: any
}

interface IUser {
    id: number
    name?: string
    title?: string
    email?: string
    active?: boolean
}
