import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingNav from '../LandingNav'; 


const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

describe('LandingNav Component', () => {

  it('renders the landing page buttons with correct texts and navigates on click', async () => {
    render(
      <MemoryRouter>
        <LandingNav />
      </MemoryRouter>
    );

    const viewTasksButton = screen.getByText('View and create your own Tasks');
    expect(viewTasksButton).toBeInTheDocument();
    await fireEvent.click(viewTasksButton);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/mytasks');

    const browseTasksButton = screen.getByText('Browse and apply for tasks');
    expect(browseTasksButton).toBeInTheDocument();
    await fireEvent.click(browseTasksButton);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/alltasks');
  });

  it('navigates to the correct path when buttons are clicked', async () => {
    render(
      <MemoryRouter>
        <LandingNav />
      </MemoryRouter>
    );

    const viewTasksButton = screen.getByText('View and create your own Tasks');
    await fireEvent.click(viewTasksButton);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/mytasks');

    const browseTasksButton = screen.getByText('Browse and apply for tasks');
    await fireEvent.click(browseTasksButton);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/alltasks');
  });
});
