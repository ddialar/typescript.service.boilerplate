import { Server } from 'http';
import { OK } from 'http-status-codes';
import manifest from '@manifest';
import { runServer } from './server';
import axios from 'axios';

const ENVIRONMENT_COPY = { ...process.env };
const { SERVER_HOST, SERVER_PORT, MANIFEST_URI } = process.env;
const host = SERVER_HOST.concat(':', SERVER_PORT);

describe('[ADAPTERS] - Express server', () => {
    let server: Server;

    beforeAll(() => {
        server = runServer(parseInt(SERVER_PORT, 10));
    });

    afterAll(() => {
        server.close();
        process.env = { ...ENVIRONMENT_COPY };
    });

    describe(`[GET] ${MANIFEST_URI} endpoint`, () => {
        const manifestUrl = host.concat(MANIFEST_URI);
        test('must return the current manifest content successfully', async (done) => {
            let obtainedError = null;

            try {
                const result = await axios.get(manifestUrl);
                const { data, status } = result;

                expect(data).not.toBeUndefined();
                expect(data).not.toBeNull();
                expect(data).not.toEqual({});

                expect(status).toBe(OK);

                expect(data).toHaveProperty('name');
                expect(data.name).toBe(manifest.name);
                expect(data).toHaveProperty('version');
                expect(data.version).toBe(manifest.version);
                expect(data).toHaveProperty('timestamp');
                expect(data.timestamp).toBe(manifest.timestamp);
                expect(data).toHaveProperty('scm');
                expect(data.scm).toHaveProperty('remote');
                expect(data.scm.remote).toBe(manifest.scm.remote);
                expect(data.scm).toHaveProperty('branch');
                expect(data.scm.branch).toBe(manifest.scm.branch);
                expect(data.scm).toHaveProperty('commit');
                expect(data.scm.commit).toBe(manifest.scm.commit);
            } catch (error) {
                obtainedError = { ...error };
                expect(obtainedError).toBeNull();
            } finally {
                done();
            }
        });
    });
});
