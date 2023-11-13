import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../../store/features/taskSlice';
import authReducer from '../../store/features/authSlice';
import projectsReducer from '../../store/features/projectsSlice';
import skillsReducer from '../../store/features/skillsSlice';
import TaskForm from '.';

// Mock the store
const mockStore = configureStore({
  reducer: {
    // Add your reducers here
    task: taskReducer,
    auth: authReducer,
    skills: skillsReducer,
    projects: projectsReducer,
  }
});

test('renders TaskForm component', async () => {
  // Mock any API calls or actions that your component might dispatch
  // You can use jest.mock to mock specific modules or functions

  // Render the component with the mocked store
   
    await render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <TaskForm />
        </MemoryRouter>
      </Provider>
    );
  

  // Now you can test your component using the testing-library/react functions
  // For example:
  
  await waitFor(() => {
    expect(screen.getByText('Submit')).toBeInTheDocument();
   // const submitButton = screen.getByText('Submit');
  });
  
  fireEvent.click(screen.getByText('Submit'));
  // todo - add further testing
});
