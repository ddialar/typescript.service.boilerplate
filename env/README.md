# Environment configuration

In oreder to work with this project, you are going to need to define tree differente environment files:

-   `.env` for production/deployment code.
-   `.env.dev` for development tasks.
-   `.env.test` for testing tasks.

The basic content of these files must be like the next examples:

```
# .env file
NODE_ENV="production"

SERVER_PORT=4000
```

```
# .env.dev file
NODE_ENV="development"

SERVER_PORT=4000
```

```
# .env.test file
NODE_ENV="testing"

SERVER_PORT=4004
```
