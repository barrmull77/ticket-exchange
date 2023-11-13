import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';
import Header from '.';

describe('Header Component', () => {
  it('renders Header component with mobile view', async () => {
    jest.mock('react-router-dom', () => ({
      useLocation: () => ({ pathname: '/home' }),
      useNavigate: () => jest.fn(),
    }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header open={false} drawerOpen={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    const findElementByText = async (element: any) => {
      return await screen.findByText(element);
    };

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();

    // Check if 'Bench Marketplace' title is present
    expect(await findElementByText('TicketExchange')).toBeInTheDocument();


    // Click on the Menu icon
    fireEvent.click(screen.getByTestId('menu-icon'));

    // Check if the 'Close' icon appears after clicking the Menu icon
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();

    // Check if 'My Tasks', 'All Tasks', and 'Create Task' buttons appear after clicking the Menu icon
    expect(await findElementByText('My Tasks')).toBeInTheDocument();
    expect(await findElementByText('All Tasks')).toBeInTheDocument();
    expect(await findElementByText('Create Task')).toBeInTheDocument();
  });

});
