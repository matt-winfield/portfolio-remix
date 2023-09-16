import '#app/utils/env.server.ts';
import 'dotenv/config';
import './db-setup.ts';
// we need these to be imported first 👆

import { server } from '#tests/mocks/index.ts';
import { installGlobals } from '@remix-run/node';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi, type SpyInstance } from 'vitest';
import './custom-matchers.ts';

installGlobals();

afterEach(() => server.resetHandlers());
afterEach(() => cleanup());

export let consoleError: SpyInstance<Parameters<(typeof console)['error']>>;

beforeEach(() => {
    const originalConsoleError = console.error;
    consoleError = vi.spyOn(console, 'error');
    consoleError.mockImplementation(
        (...args: Parameters<typeof console.error>) => {
            originalConsoleError(...args);
            throw new Error(
                'Console error was called. Call consoleError.mockImplementation(() => {}) if this is expected.',
            );
        },
    );
});
