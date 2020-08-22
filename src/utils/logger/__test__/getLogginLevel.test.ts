import { getLogginLevel } from '../index';

describe('[UTILS] - Getting the loggin level', () => {
    test('for "production" environment, the logging must be "info" (30)', () => {
        expect(getLogginLevel('production')).toBe(30);
    });
    test('for "development" environment, the logging must be "trace" (10)', () => {
        expect(getLogginLevel('development')).toBe(10);
    });
    test('for "test" environment, the logging must be "off" (100)', () => {
        expect(getLogginLevel('test')).toBe(100);
    });
    test('for "unknown" environment, the logging must be "warn" (40)', () => {
        expect(getLogginLevel()).toBe(40);
    });
});
