import { render, screen } from '@testing-library/react';
import useSWR from 'swr';
import { axe, toHaveNoViolations } from 'jest-axe';
import ReferralCard from '../../../components/referral/ReferralCard';

expect.extend(toHaveNoViolations);

jest.mock('swr');

describe('ReferralCard', () => {
  beforeEach(() => {
    useSWR.mockReturnValue({
      data: { referralCode: 'ABC123XY', totalReferrals: 3, pendingRewards: 1 },
      error: undefined,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gives every icon-only button an accessible name', () => {
    render(<ReferralCard />);

    expect(screen.getByRole('button', { name: /copy referral link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share referral link/i })).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<ReferralCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a loading placeholder without throwing when data is not ready', () => {
    useSWR.mockReturnValue({ data: undefined, error: undefined, isLoading: true });
    render(<ReferralCard />);
    expect(screen.queryByRole('button', { name: /copy referral link/i })).not.toBeInTheDocument();
  });

  it('falls back to an unavailable message on error, still with no accessible-name violations', async () => {
    useSWR.mockReturnValue({ data: undefined, error: new Error('boom'), isLoading: false });
    const { container } = render(<ReferralCard />);
    expect(screen.getByText(/referral code unavailable/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
