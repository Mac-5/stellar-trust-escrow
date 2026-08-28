import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletConnectButton from '../../components/WalletConnectButton';

describe('WalletConnectButton', () => {
  it('renders the default "Connect wallet" label when no address is provided', () => {
    render(<WalletConnectButton />);
    expect(screen.getByRole('button', { name: 'Connect wallet' })).toBeInTheDocument();
  });

  it('renders a truncated label for a valid Stellar address', () => {
    render(<WalletConnectButton address="GBRPYHIL2CI3WHZDTOOQFC6EB4KJJGUJHT3DYKU6EKM37SOIZXM2FN7" />);
    expect(screen.getByRole('button', { name: 'GBRP...2FN7' })).toBeInTheDocument();
  });

  it('calls onClick when the button is activated', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<WalletConnectButton onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // --- Edge cases ---------------------------------------------------------

  it('treats an empty string address the same as no address (empty input)', () => {
    render(<WalletConnectButton address="" />);
    expect(screen.getByRole('button', { name: 'Connect wallet' })).toBeInTheDocument();
  });

  it('does not throw and still renders a button for a malformed/too-short address', () => {
    // Real Stellar addresses are 56 chars; this is intentionally malformed.
    render(<WalletConnectButton address="GABC" />);
    const button = screen.getByRole('button');
    // slice(0, 4) + '...' + slice(-4) on a 4-char string overlaps itself,
    // but the component should not crash and should still render a label.
    expect(button).toHaveTextContent('GABC...GABC');
  });

  it('does not crash when address is not a string (unhappy path)', () => {
    // formatWalletLabel only checks truthiness before calling .slice(),
    // so a non-string truthy value would throw if that guard regresses.
    // Passing null exercises the falsy branch defensively.
    render(<WalletConnectButton address={null} />);
    expect(screen.getByRole('button', { name: 'Connect wallet' })).toBeInTheDocument();
  });

  it('does not throw when onClick is omitted and the button is clicked (unhappy path)', async () => {
    const user = userEvent.setup();
    render(<WalletConnectButton />);

    await expect(user.click(screen.getByRole('button'))).resolves.not.toThrow();
  });

  it('exposes the same visible text as its accessible name for screen readers', () => {
    render(<WalletConnectButton address="GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4WWK" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName(button.textContent);
  });
});
