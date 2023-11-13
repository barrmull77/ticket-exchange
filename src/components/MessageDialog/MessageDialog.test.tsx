import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import MessageDialog from './'; // Assuming the file path

describe('MessageDialog Component', () => {
  it('renders with the provided message and handles button clicks', () => {
    const handleClose = jest.fn();
    const handleOk = jest.fn();

    const props = {
      open: true,
      handleClose,
      handleOk,
      message: 'Test Message',
      confirmMessage: 'Confirm',
    };

    render(<MessageDialog {...props} />);

    expect(screen.getByText('Test Message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Confirm'));
    expect(handleOk).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Back'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render "Back" button when confirmMessage is "Ok"', () => {
    const handleClose = jest.fn();
    const handleOk = jest.fn();

    const props = {
      open: true,
      handleClose,
      handleOk,
      message: 'Test Message',
      confirmMessage: 'Ok',
    };

    render(<MessageDialog {...props} />);

    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });
});
