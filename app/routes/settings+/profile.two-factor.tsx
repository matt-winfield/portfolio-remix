import { Icon } from '#app/components/ui/icon.tsx';
import { type VerificationTypes } from '#app/routes/_auth+/verify.tsx';
import { Outlet } from '@remix-run/react';

export const handle = {
    breadcrumb: <Icon name="lock-closed">2FA</Icon>,
};

export const twoFAVerificationType = '2fa' satisfies VerificationTypes;

export default function TwoFactorRoute() {
    return <Outlet />;
}
