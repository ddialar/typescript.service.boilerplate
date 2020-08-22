import { runServer } from '@adapters';

const { SERVER_PORT } = process.env;

runServer(parseInt(SERVER_PORT, 10));

// Docker process control.
// Quit on ctrl-c when running docker in terminal.
process.on('SIGINT', () => process.exit());

// Quit properly on docker stop.
process.on('SIGTERM', () => process.exit());
