# Test App

This app is a simple Node.js app that serves several Inngest functions for locally testing in the development environment.

This app works in the following ways:

1. It has several Inngest functions (w/ and w/out steps)
2. Some functions throw errors at random to simulate failures
3. A cron function runs every 2 minutes to send fake events to your local all

## Usage

### Prerequisites

1. Set up the [`monorepo`](https://github.com/inngest/monorepo)
2. Clone this repo `git clone git@github.com:inngest/inngest-test-app.git && cd inngest-test-app`
3. Create an `.env` file with `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` from your local user

### Deploy the app

1. Install all dependencies:

```
yarn
```

2. Start the local server

```
yarn dev
```

Your functions should now have been deployed if a local dev server is running.
If not, you can manually deploy:
   - Use the local UI's "Deploy" button and enter the following URL: `http://host.docker.internal:3939/api/inngest`

   - Use a curl comment to trigger the register handshake:

     ```
     curl -X PUT http://localhost:3939/api/inngest
     ```

### Send test events

If you'd like to manually send a bunch of test events, use the `yarn send` command:

```shell
yarn send
# Send a specific number of events
yarn send 500
# Send a specific event type
yarn send 30 app/account.created
```

This can also be appended to the `yarn dev` command to create the server,
register, and send events in one go.

```shell
# Send a specific number of events
yarn dev 500

# Send a specific event type
yarn dev 1 test/examples
```
