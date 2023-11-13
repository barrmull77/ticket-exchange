import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '.';

describe('HeroSection Component', () => {
  it('renders HeroSection component with initial state', async () => {

    render(<HeroSection />);

    expect(screen.getByTestId('herosection-text')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Create Task' })).toHaveAttribute('href', '/createtask')
    
  });

});
