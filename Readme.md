## Description

This is a simple Node API setup to connect to a Mongo database. It uses express/mongoose, uses the MVC pattern and it is written in typescript. The logic content displayed is setup for a journaling app with users, entries and days as data elements.

## Setup

To run this api in your local device, clone/download repo, install dependencies `npm install`, setup `DATABASE` and `DATABASE_PASSWORD` in your `.env` or `.env.local` file. To run locally, in dev mode, run the server.ts file `npm run dev` (uses `nodemon` and will use `.env.local` variables). To run in production, build with `npm run build` and `npm run start`.

## Deployment

Each deployment structure has it's own configuration. For this one, render.com was used. environment variables can easily be defined in the service, so `.env` is ignored. A whitelisted IP can be set with `TEMP_FRONTEND_IP_ACCESS` for to consume the API.

## Versioning

Current v1.X - Node, Express, Mongoose MVC app for API of Journaling, Stats Tracker & Goal Setter features of the Active Sloth service.
