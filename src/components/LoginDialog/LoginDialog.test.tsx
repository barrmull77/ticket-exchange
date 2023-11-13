import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginDialog from '.';

describe('LoginDialog Component', () => {
  it('renders LoginDialog component with initial state', async () => {
    const mockHandleLogin = jest.fn();

    render(<LoginDialog handleLogin={mockHandleLogin} />);

    const findText = async (text: string) => {
      return await screen.findByText(text);
    };

    expect(await findText('Welcome to TicketExchange')).toBeInTheDocument();
    
    expect(await findText('Please login with your Microsoft account')).toBeInTheDocument();


    fireEvent.click(await findText('Login with Microsoft account'));

    expect(mockHandleLogin).toHaveBeenCalled();
  });

});
