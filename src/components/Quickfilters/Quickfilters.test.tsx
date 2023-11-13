import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store';
import Quickfilters from '.';
import theme from '../../themes/BMThemes';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
  useLocation: () => ({
    search: '?status=New&billable=true', // Mock location data as needed
  }),
}));

describe('Quickfilters Component', () => {
  it('renders the quick filters with initial data', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Quickfilters skillList={[{ name: 'Example' }]} />
        </MemoryRouter>
      </Provider>
    );

    const getUrlParam = (param: string) => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(param);
    };

    const skillFilterChip = await screen.findByText('Example');
    expect(skillFilterChip).toBeInTheDocument();


    await fireEvent.click(skillFilterChip);
    await waitFor(() => {
         expect(getUrlParam('Skill')).toBe('Example');
    });
  });

});
