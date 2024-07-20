## Description

This api is setup for a journaling app with users, entries and days as data elements.

## Setup

#### Running locally

- Clone/download repo from https://github.com/Tuistmessiah/active-sloth-api

- Install dependencies `npm install`

- Setup `DATABASE` and `DATABASE_PASSWORD` in your `.env` or `.env.local` file.

- Run the server.ts file `npm run dev` (uses `nodemon` and will read the environment variables from the `.env.local` file).

#### Running for prod

- build with `npm run build` and `npm run start` (TBD).

## Deployment

Each deployment structure has it's own configuration. For this one, render.com was used. Environment variables can easily be defined in the service, so `.env` is ignored. A whitelisted IP can be set with `TEMP_FRONTEND_IP_ACCESS` for us to consume the API.

## Versioning

Current v1.X - Node, Express, Mongoose MVC app for API of Journaling, Stats Tracker & Goal Setter features of the Active Sloth service.
