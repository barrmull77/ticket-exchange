import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TaskDetails from '.'; // Adjust the import path accordingly
import { MemoryRouter } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import { Provider } from 'react-redux';
import { store } from '../../store';
import TasksJSON from '../../dummyData/tasks.json';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../../store/features/taskSlice';
import authReducer from '../../store/features/authSlice';

const renderWithRedux = (component: any, preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      // Add your reducers here
      task: taskReducer,
      auth: authReducer
    },
    preloadedState,
  });

  return render(<Provider store={store}>{component}</Provider>);
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ taskId: 1 }),
}));

describe('TaskDetails Component', () => {

  it('renders task details', async () => {
  
    const mockState = {
      task: { selectedTask: TasksJSON[0]}, 
      auth: { userProfile: { id: '1'} }
    };

    // Mock the useParams hook

    await act(async () => {
      renderWithRedux(
        <MemoryRouter>
          <TaskDetails />
        </MemoryRouter>,
        mockState
      );
    });
    // Assertions for loaded state and task details
  
      await expect(screen.getByText('Create a responsive landing page')).toBeInTheDocument();
      await expect(screen.getByText('Finance Company')).toBeInTheDocument();
    
  });


});
