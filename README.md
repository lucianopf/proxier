# Proxier

This service was created to avoid struggling with CORS policies from 3rd party services.
It uses Express and Zeit Now to make it possible to serve in multiple regions and scale to 10 instances in just a couple miliseconds.;

## About

This project doesn't have any restrictions of methods nor headers, just feel free to use as you will.

### As a Service

Its as easy as append `/http://www.mocky.io/v2/5be22bc13000006100d9acdf` to `https://proxier.now.sh`

Example: GET `https://proxier.now.sh/http://www.mocky.io/v2/5be22bc13000006100d9acdf`

### On Premise

The only thing needed here is to:

1. `yarn` or `npm install`
2. `./node_modules/.bin/now login`
3. Type your email, and verify it.
4. Since proxier.now.sh is already taken you'll need to head over `now.json` and change the alias to your desired URL.
5. `yarn deploy` or `npm run deploy`.

Feel free to enjoy your service with the same instructions as the `As a Service` but with your alias 