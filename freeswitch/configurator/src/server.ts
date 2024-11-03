import RestApp from './rest';

const rest = new RestApp();

const shutdown = () => {
  console.log();
  rest.stop();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

rest.start();
