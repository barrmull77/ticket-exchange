import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TasksJSON from '../../dummyData/tasks.json';
import SkillsJSON from '../../dummyData/skills.json';
import TaskList from '.';

// Mock the react-redux useSelector hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

const mockStore = configureStore();

describe('TaskList Component', () => {

  it('renders task details when not loading', async () => {

    const mockTaskList = TasksJSON;

    const store = mockStore({
      task: {
        isLoading: false,
      },
    });
    // Todo - fix type issue with taskList
    
    // await render(
    //   <Provider store={store}>
    //     <MemoryRouter>
    //       <Routes>
    //         <Route path="/" element={<TaskList taskList={mockTaskList} />} />
    //       </Routes>
    //     </MemoryRouter>
    //   </Provider>
    // );

    // // Assertions for loaded state and task details
    // expect(screen.getByText(TasksJSON[0].title)).toBeInTheDocument();
    // expect(screen.getByText(TasksJSON[1].title)).toBeInTheDocument();
  });
});
