# TypeScript Service Boilerplate

<img src="https://img.shields.io/badge/Version-0.1.0-yellow" /> <img src="https://img.shields.io/badge/TypeScript-3.9.6-blue" /> <img src="https://img.shields.io/badge/Webpack-4.43.0-blue" /> <img src="https://img.shields.io/badge/Jest-26.1.0-green" /> <img src="https://img.shields.io/badge/openApi-3.0.1-green" />

[🇪🇸 Version](https://github.com/ddialar/typescript.service.boilerplate/blob/master/docs/README_SPA.md)

## Index

-   [Description](#description)
-   [Repository overview](#repository-overview)
    -   [Environment variables](#environment-variables)
    -   [Architecture](#architecture)
        -   [Adapters](#architecture-adapters)
            -   [dataSources](#architecture-adapters-datasources)
            -   [transportLayer](#architecture-adapters-transportlayer)
        -   [Ports](#architecture-ports)
            -   [Interactors](#architecture-ports-interactors)
            -   [Repositories](#architecture-ports-repositories)
        -   [Core](#architecture-core)
        -   [Utils](#architecture-utils)
-   [Commands guide](#commands)
    -   [Switch Node version](#commands-switch-node)
    -   [Installation process](#commands-installation)
    -   [Create manifest](#commands-manifest)
    -   [Run tests](#commands-test)
    -   [Run development mode](#commands-dev-mode)
    -   [Build application](#commands-pro-mode)
    -   [Deployment](#commands-deployment)
        -   [Manually](#commands-deployment-manually)
        -   [Automatically](#commands-deployment-manually)
-   [API documentation](#apidoc)
-   [TODO list](#todo-list)

## <a id="description"></a>Description

This repository is aimed to provide you a boilerplate in order to build backend applications, services or microservices based on TypeScript.

Some keys about this repository are next:

-   `Webpack` for transpiling and bundling the TypeScript code.
-   `dotenv` for environment variables.
-   `Swagger` for API REST documentation.
-   `Jest` for unit testing, as well as `supertest` API enpoints integration tests.
-   `ESLint` and `Prettier` for code linting and formating.
-   `Husky` for GIT hooks.
-   `Docker` for container image management.

Therefore this repository is defined to work with `Node 12.18.2 LTS`.

If you are running differente versions of Node in your system, just run `nvm use` and it will be switched to the version defined in the `.nvmrc` file.

## <a id="repository-overview"></a>Repository overview

### <a id="environment-variables"></a>Environment variables

Due to we have selected `dotenv` as environmet variables handler, in the root of hte project will be a folder named [`env`](https://github.com/guidesmiths/microservice-typescript-boilerplate/env). In this folder you have to define a minimum of three differente environment files:

-   `.env` for production.
-   `.env.dev` for development.
-   `.env.test` for testing.

Feel free to remove some of them or include additional ones depending on your application needs. Just keep in mind that you will have to update and set the Webpack configuration based on the environment you are going to be working.

The different scripts created for running the application in every environment, are prepared to load the configuration and apply it to the code.

For production purpouses, Webpack is already configuered in order to record that information into the final bundled file so we don't need to think about providing environment configurations to the application image.

The most basic fields we must include on these fields are next:

```
NODE_ENV="production" | "development" | "test"

# Set the port number that best matches for your environment.
SERVER_PORT=4000 # 4004 for testing.

MANIFEST_URI="/__/manifest"
APIDOC_URI="/__/apidoc"
# Additional endpoint URIs here.

# Rest of the environment variables here.
```

### <a id="architecture"></a>Architecture

This repository is implemented following the Hexagonal Architecture, with this folder structure:

```
src/
 +- adapters/
 |   +- dataSources/
 |   +- transportLayer/
 +- core/
 +- ports/
 |   +- interactors/
 |   +- repositories/
 +- utils (this section doesn't belongs to the Hexagonal Architecture at all)
```

#### <a id="architecture-adapters"></a>Adapters

On this layer we implement the needed tools strongly coupled for any kind of technology.

The strategy to follow for this layer is to keep in mind that if during the development process or for future refactors, some element in this layer must be replaced by another one that provides the same results, our application can not be affected and event if it happens, the effects in our application are really shallow.

To reach that goal, this layer is divided in two different sections: `dataSources` and `transportLayer`.

-   <a id="architecture-adapters-datasources"></a>`dataSources`

    This section contains the whole elements focused on provide a successful application data persistance and retrieving. Some examples of what must be located on this section are ORMs, connections stablished by our application to other APIs, etc.

    Every tool used in this section must be contained into its specific folder. We must try to provide a descriptive name to this folder based on the function that the tool provides to the application and not the own tool name. For instance, whether we are working with Sequelize, TypeORM, Mongoose, etc., the folder that will contain this tool implementation should be named as `orm`. This way, the application parts that use these tools will call them following the functionality name and not a specific tecnology one.

    In case of needing a refactor that requires a technology replace, for instance, we have been using MySQL and from now on forward we have decided to move to MongoDB, futhermore to replace the ORM configuration, we have to ensure that we expose the same methods that we already had implemented for MySQL in order to not affect the inner part of the application.

    Besides that, in this layer we must implement the needed mapping functions in order to parse the data results obtained from the data source for the inner parts of the application and viceversa, it means, when the application have to persiste information, the data structure generated by the application must be adapted to the data source structure.

    When we replace any technology used in this layer, its bound mappers must also be refactored in order to update the specific technology mapped fields.

    Finally, **no one method defined into this section will never invoke methods located in other layers**. However, code defined into this layer can be always invoked by the `ports` layer elements.

    Summary:

    -   Specific data access technologies.
    -   Wrap every technology into its specific folder.
    -   Name every technology folder based on the functionality it provides to the application not in the technology name.
    -   Create mappers in order to work as interfaces between data sources and the application inner parts.
    -   Never implement business logic on this section.
    -   No invoke other layers methods from this section.

-   <a id="architecture-adapters-transportlayer"></a>`transportLayer`

    This section contains the needed code to provide connectivity with our code from outside.

    Every tool used in this section must be contained into its specific folder. We must try to provide a descriptive name to this folder based on the function that the tool provides to the application. For instance, whether we are working with [Express](https://expressjs.com/), [Fastify](https://www.fastify.io/), [Strapi](https://strapi.io/), etc., the folder that will contain this tool implementation should be named as `server`. This way we have our code decoupled from a specific technology and we only have a funcionality name.

    In case of needing a refactor that requires a technology replace, for instance, we have been using Express and from now on forward we have decided to move to Fastify, futhermore to replace the server configuration, we have to ensure that we expose the same endpoints that we had implemented for Express in order to not affect the communication structure with the application.

    It could be exceptions where the techonology and the functionality provided to the application have the same name, such as GraphQL. It's not a server because GraphQL works with a server tecnology. In the other hand, its name matches with the funtionality provided. In these sort of rare cases, we can wrap them into a folder named as the tool.

    Due to this section will receive all the communication requests with our application, the code defined here must contact with a part of the `ports` layer implementation, due to that in this section we musn't implement never business logic. An example of that situation could be the users authentication. This kind of operations will be reserved for method defined into the `ports` layer. In this section we will only use them.

    For API REST documentation purposes, due to this feature is strongly bound with the connectivity technology that we have selected (for instance when we use Swagger/OpenAPI), if that documentation requires any sort of configuration and/or definition, it will be placed into a `apiDocumentation` folder located into this section.

    Summary:

    -   Specific application external connectivity technologies.
    -   Wrap every technology into its specific folder.
    -   Name every technology folder based on the functionality it provides to the application not in the technology name.
    -   Never implement business logic on this section.
    -   Invoke only `ports` layer methods from this section.

#### <a id="architecture-ports"></a>Ports

On this layer we implement the most part of our code business logic.

To reach that goal, this layer is divided in two different sections:

-   <a id="architecture-ports-interactors"></a>`interactors`

    This section implements the needed elements in order to execute the business logic defined in the `core` layer, via direct use of methods defined there.

    Some times you will realize that it is not needed to implement certain logic in the `core` layer and this code can be perfectly addressed on an `interactor`. That is fine. If you are sure that this piece of code doesn't 100% belong to the `core`, you can keep it at this secction. However, keep always in mind if something is essential for your application, I mean the application without this code is not the same product, you must move that code to the `core` layer.

    One additional property of `interactors` is that this layer methods can access the `repositories` section in this same layer, in order to handle data to and from data sources.

    When we create code in this section, we have to bunch it by feature reference. For instance, the whole operations aimed to work with users, we will place them into the `users` folder.

    Summary:

    -   Implement logic in order to run `core` layer features.
    -   Don't worry about implmement logic here whether it doen's match 100% in the `core` layer (but be careful).
    -   This code can access to the `repositories` section resources.
    -   Bunch the code by feature.

-   <a id="architecture-ports-repositories"></a>`repositories`

    This section will use the application interfaces and data structures defined into the `core` layer in order to create the entities that we will use here.

    Besides, the main target of this section is to access to the methods defined in the `dataSources` section of `adapters` layer. Due to that, we need to have here a copy of the methods names defined there, in order to be invoked by other elements of the `ports` layer.

    In this section we must implement only and exclusivelly, the needed business logic to interact with the `dataSources` section into the `adapters` layer.

    When we create code in this section, we have to bunch it by entity reference. For instance, the whole operations and entities bound with users, we will place them into the `users` folder.

    The code implemented on this section can be invoked by the `interactors` and for really exceptional cases, by the `core` layer whether it is needed (not recomended at all).

    Repositories won't need mappers or parsers on they definitions. Whether you need to implement them at this level, you surely would have to think again your design.

    Summary:

    -   Implement entities to be used in the `ports` layer, based on data structures defined in the `core` one.
    -   It connects directly with the code defined at `adapters/dataSources` level.
    -   It must contain a copy of the data managements methods exposed at `adapters/dataSources` level.
    -   Wrap the code by entities reference into specific folders.
    -   Don't implement mappers or parsers.
    -   Don't implement business logic.

    **Caveat about the `repository` concept**

    We can be used to understand a `repository` as an element that therefore defining a data structure, it also provides the conectivity with the data source and it is able to persist and retrieving data.

    That point of view is correct but for this Hexagonal Architecture schema, it doesn't match at all. That is because we have a strong coupling between our application data model, the data source one and the technology used for reaching it. This fact avoids us to move the data source technology without a hard refactor of the business logic.

    In the other hand, the concept `repository` covered in this section is focused on to define the application business logic that implements the most basic properties like data structure and management. This way we can isolate the used data source technology. Now we can modify our application data source and our code musn't be affected beyond to readapt the `adapters/dataSources` level.

#### <a id="architecture-core"></a>Core

This layer is also known as `entities` or `domain` in different architecture approaches.

Tthis layer has two main goals:

-   To define application own data structures (mainly interfaces if we are using TypeScript).

    Some examples about it could be the data structure that an user, a product or a buying chart are going to have into the application. Those structures will define how the information is going to be moving through the application.

    Obviously, these definitions must be accessible for the elements into the `ports` layer which need then in order to create and structuring functional entities.

-   To implement specific business logic strongly linked to the application use.

    A quick rule to know if a pice of code belongs to the `core` layer is to ask ourself _"my application is the same if I extract this code from the core?"_ If the answer is **NO**, then this code must be placed into the `core` layer.

    For instance, a code that should be place into the `core` layer would be the hashing and/or encryption processes. Another example could be the tokens generation. These elements are essential in your application and belong to its business logic.

#### <a id="architecture-utils"></a>Utils

Despite of **this section doesn't belongs to the Hexagonal Architecture at all**, some times we use tools that are cross-cutting to the whole layers. We are talking about debbug and loging tools, for instance. These ones are used in different levels of the application in order to track its behaviour as well as possible errors.

In these cases, we can move the configuration and implementation of them to an axiliar folder.

Anyway as overall rule, every tool must be contained into its specific folder and in addition, if that tool is going to play a specific function in the application, use that function name for the folder one.

## <a id="commands"></a>Commands guide

### <a id="commands-switch-node"></a>Switch Node version

```sh
nvm use
```

### <a id="commands-installation"></a>Modules instalation process

```sh
npm i
```

### <a id="commands-manifes"></a>Create `manifest`

This feature is focused on provide us information about the application, service or microservice when we deploy our application via Docker container, or in any other running situation.

Once we have intalled all the modules (`npm i`), we can run this command `npm run manifest` which will create the `manifest.json` file in the root of our project. The structure of this files is next:

```json
{
    "name": "project name that matches with this key in the package.json file",
    "version": "project version that matches with this key in the package.json file",
    "timestamp": "file creation timestamp in ISO format, it means AAAA-MM-DDTHH:MM:SS.sssZ",
    "scm": {
        "remote": "repository remote path that matches with the remote.origin.url key in the project's GIT configuration",
        "branch": "GIT branch seleted when the file was created",
        "commit": "head GIT commit ID when the file was created"
    }
}
```

This way when we request to the endpoint `/__/manifest` of our service, we will receive that information that it's interesting for two reasons: if we receive that data we know that our service is up and in addition, we get information about what the service contains.

For production purposes don't worry about to create the manifest file before to bundle the code because this command is included in the `build:pro` script. So you can sure that when you create the bundle, the most up-to-date information about the service will be available in it.

### <a id="commands-tests"></a>Run tests

**Required files:**

-   `env/.env.test`

```sh
# Unit and integration tests.
npm test
# Coverage.
npm run test:coverage
```

### <a id="commands-dev-mode"></a>Run development mode

**Required files:**

-   `env/.env.dev`

```sh
npm run build:dev
```

### <a id="commands-pro-mode"></a>Build application

This process includes the manifest creation as well as the TypeScript code transpilation and bundling.

**Required files:**

-   `env/.env`

```sh
npm run build:pro
```

Once this process is completed, the bundled code is avilable to be included into the Docker image, from the `dist` folder.

See the `Dockerfile` definition for further details about the deployable image.

### <a id="commands-deployment"></a>Deployment

In order to deploy the application using Docker, you have to keep in mind that the project must be compiled for _production_ before to run the `Dockerfile`.

#### <a id="commands-deployment-manually"></a>Manually

This way, if you are going to deploy it manually, follow the next steps:

```sh
# From the projects root.
$ npm run build:pro
$ docker build -f docker/Dockerfile -t <image_repository_name>/<image_name>:<image_version> .
$ docker push # Optional to upload your image to the Docker Registry (you will need to be authenticated previously).
$ docker run --name <container_name> -p <host_port>:<container_port> <image_repository_name>/<image_name>:<image_version>
```

Where:

-   `image_repository_name` is the repository name in the Docker Registry or your own one, where the image is going to be located.
-   `image_name` by your application users will find and download it.
-   `image_version` of your image. If you don't provide it and you are using Docker Registry, remember that the Docker Registry will assign it as `latest` by default.

#### <a id="commands-deployment-manually"></a>Automatically

When you are using any kind of CD/CI system such as CircleCI, you have to ensure configure it in order to compile the application first, place the bundled code into the `dist` folder and finally, run the `Dockerfile`.

## <a id="apidoc"></a>API REST documentation

`http://<service_url>:<service_port>/<api_doc_uri>`

The whole elements on this URL must be defined in the environment variables. Take a look to the [**environment variables**](#environment-variables) section.

## <a id="todo-list"></a>TODO list

-   Include [Log4JS](https://www.npmjs.com/package/log4js).
-   Include [Hygen](https://www.hygen.io/).
-   Include [GraphQL](https://graphql.org/).
-   Implement event bus tools to provide microservice functionality.
