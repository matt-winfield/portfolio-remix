import { useLocalStorage } from 'react-use';
import { ClientOnly } from 'remix-utils';
import { Button } from '#app/components/ui/button.tsx';

export default function Analytics() {
    const [plausibleIgnore, setPlausibleIgnore, removePlausibleIgnore] =
        useLocalStorage('plausible-ignore', 'false');

    return (
        <ClientOnly>
            {() => (
                <div className="container text-2xl">
                    <h1 className="text-center text-5xl">
                        Control analytics settings
                    </h1>
                    <div className="my-5 flex flex-col items-center justify-center">
                        <div>
                            In order to improve the site, we use
                            privacy-friendly analytics. You can choose to
                            opt-out of this.
                        </div>
                        <div>
                            You currently{' '}
                            {plausibleIgnore === 'true' ? (
                                <span className="text-foreground-danger">
                                    do not
                                </span>
                            ) : (
                                <span className="text-green-600">do</span>
                            )}{' '}
                            have analytics enabled.
                        </div>
                        <Button
                            className="my-2"
                            onClick={() => {
                                if (plausibleIgnore === 'true') {
                                    removePlausibleIgnore();
                                } else {
                                    setPlausibleIgnore('true');
                                }
                            }}
                        >
                            {plausibleIgnore === 'true' ? 'Enable' : 'Disable'}{' '}
                            analytics
                        </Button>
                    </div>
                </div>
            )}
        </ClientOnly>
    );
}
