import { screen } from '@testing-library/dom';
import Reservations from '../src/pages/reservations/index';
import { renderWithProviders } from '../src/lib/utils/test-utils';
import { makeStore } from '../src/lib/store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { act } from '@testing-library/react';
import { MOCK_RESERVATIONS, MOCK_ROOMS } from './reservation-mock';

describe('Reservations', () => {
  const store = makeStore();
  const mock = new MockAdapter(axios);

  beforeEach(async () => {
    mock.reset();
    await act(async () => {
      mock.onGet('/api/reservations').reply(200, MOCK_RESERVATIONS);
      mock.onGet('/api/rooms').reply(200, MOCK_ROOMS);

      renderWithProviders(<Reservations />, { store });
    });
  });

  it('should render the reservations page with store data', async () => {
    expect(screen.getByText('Reservations')).toBeInTheDocument();
    expect(screen.getByText('Hayden')).toBeInTheDocument();
    expect(screen.getByText('Dudding')).toBeInTheDocument();
  });
});
