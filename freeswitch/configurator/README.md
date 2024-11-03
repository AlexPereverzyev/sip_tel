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
- if target user extension is `0000`, it generates dialpan with distinct greeting
- in all other cases, it responds with 404, forcing FreeSWITCH to seek configuration in filesystem
