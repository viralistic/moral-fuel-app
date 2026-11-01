import { act, render, screen } from '@testing-library/react-native';

import { LaunchScreen } from '@/features/launch/launch-screen';

import { nlStrings } from '@/test-utils/test-store';

jest.mock('@/state/app-state', () => ({
  useStrings: () => jest.requireActual<typeof import('@/i18n/strings')>('@/i18n/strings').stringsFor('nl'),
}));

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('LaunchScreen', () => {
  it('shows the logo, a labelled progress bar and the tagline', async () => {
    await render(<LaunchScreen ready={false} onDone={jest.fn()} />);
    expect(screen.getByLabelText('Moral Fuel')).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: nlStrings.brand.loading })).toBeTruthy();
    expect(screen.getByText(nlStrings.brand.loaderTagline)).toBeTruthy();
  });

  it('waits for the app to be ready before handing over', async () => {
    const onDone = jest.fn();
    const view = await render(<LaunchScreen ready={false} onDone={onDone} />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(onDone).not.toHaveBeenCalled();

    await view.rerender(<LaunchScreen ready onDone={onDone} />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
