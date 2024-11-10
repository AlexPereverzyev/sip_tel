# FreeSWITCH Configurator

Configuration Web hooks for `mod_xml_curl`:

## Dev Stack

- Node.js 20
- TypeScript 5.6.2
- Visual Studio Code
- ESLint
- Prettier

## Usage

```
npm install
npm start
```

## Notes

- the application logs all XML configuration requests from FreeSWITCH
- if target user extension is `8888`, it generates dialpan that incudes ESL connection
- the ESL connection enables call processing by ESL server within the same application
- in all other cases, it responds with 404, forcing FreeSWITCH to seek configuration in filesystem

## ESL REST API

- curl localhost:8080/esl
