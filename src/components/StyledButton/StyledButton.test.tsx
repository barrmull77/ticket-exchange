import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StyledButton from '.'; // Replace with the correct path to your component

describe('StyledButton', () => {
  it('renders a button with the correct text and type', () => {
    const buttonText = 'Submit';
    render(<StyledButton text={buttonText} type="submit" />);

    // Check if the button renders with the provided text
    expect(screen.getByText(buttonText)).toBeInTheDocument();

    // Check if the button has the correct type set
    const button = screen.getByText(buttonText).closest('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls the provided onClick function when clicked', () => {
    const onClickMock = jest.fn();
    const buttonText = 'Click me';
    const buttonType = 'submit';
    render(<StyledButton text={buttonText} onClick={onClickMock} type={buttonType} />);

    // Simulate a button click
    fireEvent.click(screen.getByText(buttonText));

    // Check if the onClick function was called when the button is clicked
    expect(onClickMock).toHaveBeenCalled();
  });
});
