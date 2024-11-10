export default {
  name: process.env.HOSTNAME,
  rest: {
    port: 8080,
  },
  esl: {
    freeswitch: {
      port: 8021,
      host: '127.0.0.1',
      password: '12345',
    },
    server: {
      port: 8081,
      host: '127.0.0.1',
    },
  },
};
