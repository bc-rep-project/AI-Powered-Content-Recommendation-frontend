import '@testing-library/jest-dom';
import { server } from './__tests__/mocks/server';

declare const beforeAll: Function;
declare const afterEach: Function;
declare const afterAll: Function;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close()); 