# Plantilla para servicio en TypeScript

<img src="https://img.shields.io/badge/Version-0.0.1-yellow" /> <img src="https://img.shields.io/badge/TypeScript-3.9.6-blue" /> <img src="https://img.shields.io/badge/Webpack-4.43.0-blue" /> <img src="https://img.shields.io/badge/Jest-26.1.0-green" /> <img src="https://img.shields.io/badge/openApi-3.0.1-green" />

## Índice

-   [Descripción](#description)
-   [Revisión del repositorio](#repository-overview)
    -   [Variables de entorno](#environment-variables)
    -   [Arquitectura](#architecture)
        -   [Adapters](#architecture-adapters)
            -   [dataSources](#architecture-adapters-datasources)
            -   [transportLayer](#architecture-adapters-transportlayer)
        -   [Ports](#architecture-ports)
            -   [Interactors](#architecture-ports-interactors)
            -   [Repositories](#architecture-ports-repositories)
        -   [Core](#architecture-core)
        -   [Utils](#architecture-utils)
-   [Listado de comandos](#commands)
    -   [Cambiando la versión de Node](#commands-switch-node)
    -   [Proceso de instalación de módulos](#commands-installation)
    -   [Creación del archivo `manifest`](#commands-manifest)
    -   [Ejecución de los tests](#commands-test)
    -   [Ejecución en modo desarrollo](#commands-dev-mode)
    -   [Compilación de la aplicación](#commands-pro-mode)
    -   [Despliegue](#commands-deployment)
        -   [Manualment](#commands-deployment-manually)
        -   [Automáticamente](#commands-deployment-manually)
-   [Documentación de la API REST](#apidoc)
-   [TODO list](#todo-list)

## <a id="description"></a>Descripción

Este repositorio está enfocado a proporcionar una plantilla para construir aplicaciones de backend, servicios o microservicios basados en TypeScript.

Algunas claves acerca de este repositorio son:

-   `Webpack` para transpilar y construir el bundle del código TypeScript.
-   `dotenv` para las variables de entorno.
-   `Swagger` para la documentación API REST.
-   `Jest` para testing unitario, así como `supertest` para los tests de integración de la API.
-   `ESLint` y `Prettier` para la revisión y formateo del código.
-   `Husky` para los GIT hooks.
-   `Docker` como gesto de imágenes de contenedores.

Además este repositorio está definido para trabajar con `Node 12.18.2 LTS`.

Si estás utilizando diferentes versione de Node en tu sistem, simplemente ejecuta `nvm use` y Node cambiará a la versión defindia en el archivo `.nvmrc`.

## <a id="repository-overview"></a>Revisión del repositorio

### <a id="environment-variables"></a>Variables de entorno

Debido a que hemos seleccionado `dotenv` como gestor de variables de entorno, en la raíz del proyecto habrá un direcotrio llamado [`env`](https://github.com/guidesmiths/microservice-typescript-boilerplate/env). En este directorio tendrás que definir un mínimo de tres archivos de entorno:

-   `.env` para producción.
-   `.env.dev` para desarrollo.
-   `.env.test` para testing.

Puedes eliminar algunos de estos archivos o añadir otros dependiendo de las necesidades de tu aplicación. Solamente ten en cuenta que necesitará actualizar o definir la configuración de Webpack en base al entorno en el que vas a estar trabajando.

Los diferentes scripts creados para ejecutar la aplicación en cada entorno están preparados para cargar la configuración correspondiente y aplicarla al código.

Para usar el código con el objetivo de producción, Webpack está configurado para escribir la información de las variables de entorno en el bundle final, así que no necesitarás pensar sobre si proporcionar o no las variables de entorno en las imágenes de la aplicación.

Los campos base que debes incluir en estos archivos de configuración son los siguientes:

```
NODE_ENV="production" | "development" | "test"

# Conjunto de puertos que mejor se adapten a la aplicación.
SERVER_PORT=4000 # 4004 para testing.

MANIFEST_URI="/__/manifest"
APIDOC_URI="/__/apidoc"
# Las URIs para endpoints adicionales irán a partir de aquí.

# El resto de las variables de entorno irán aquí.
```

### <a id="architecture"></a>Arquitectura

Este repositorio está implementado siguiendo la Arquitectura Hexagonal, con la siguiente estructura de directorios:

```
src/
 +- adapters/
 |   +- dataSources/
 |   +- transportLayer/
 +- core/
 +- ports/
 |   +- interactors/
 |   +- repositories/
 +- utils (esta sección no pertenece propiamente a la Arquitectura Hexagonal)
```

#### <a id="architecture-adapters"></a>Adapters

En esta capa implementaremos las herramientas necesarias que estén altamente acoplada a una tecnología en especial.

La estrategia a seguir para esta capa es tener en mente que si durante el proceso de desarrollo o debido a refactorizaciones futuras, algún elemento de esta capa debe ser reemplazado por otro que proporcione las mismas funcionalidades, nuestra aplicación no debe verse afectada y si esto sucediera eventualmente, los efectos sobre nuestra aplicación serían relativamente insignificantes.

Para alcanzar este objetivo, esta capa se divide en dos secciones diferentes: `dataSources` y `transportLayer`.

-   <a id="architecture-adapters-datasources"></a>`dataSources`

    Esta sección contiene todos los elementos enfocados en proporcionar a la aplciación todas sus fuciones de persistencia y recuperación de datos. Algunos ejemplos de qué podría estar ubicado en esta sección serían los ORM, conexiones realizadas por nuestra aplicación hacia otras APIs, etc.

    Cada herramienta utilizada en esta sección debe estar contenido en su directorio específico. Deberemos proporcionar un nombre lo más descriptivo posible en base a la función que dicha herramienta desempeña en nuestra aplicación y no el nombre de la propia herramienta. Por ejemplo, si vamos a estar usando Sequelize, TypeORM, Mongoose, etc., el directorion que contendrá dicha herramienta debería llamarse `orm`. De este modo, las partes de la aplicación que usen estas herramientas las importarán siguiendo el nombre de la funcionalidad y no el de la herramienta en cuestión.

    En caso de necesitar repactorizar porque se requiere reemplazar la herramienta como por ejemplo, si estamos usando MySQL y de ahora en adelante hemos decidido que vamos a movernos a MongoDB, además de reemplazar la configuración del ORM, tendremos que asegurarnos de que la nueva implementación expone los mismo métodos que teníamos implementados hasta ahora para MySQL, con el objeto de no afectar a las capas internas de nuestro código.

    Además de esto, en esta capa debemos implementar aquellas funciones de mapeado que sean necesarias para "parsear" los resultados que hemos obtenido de una fuente de datos, hacia las capas interiores de nuestras aplicación y viceversa. Esto significa que cuando nuestra aplicación necesite persistir información en el origen de datos, deberemos estructurar adecuadamente los datos que vamos a enviar para que coincidan con el destino de los mismos.

    Cuando reemplazamos cualquier tipo de herramienta utilizada en esta capa, las funciones de mapeado asociadas a la misma también deben ser refactorizadas para actualizarlas al correcto "parseo" de los campos empleados por dicha tecnología.

    Para concluir, **ningún método definido en esta sección nunca invocará métodos definidos en otras capas de la aplicación**. No obstante, los métodos definidos en esta capa siempre podrá ser invocados por los método definido en la capa `ports`.

    Resumen:

    -   Específica para el uso de tecnologías y herramientas de acceso y persistencia de datos.
    -   Envolver cada tecnología o herramienta en su propio directorio específico.
    -   Nombrar cada directorio con el nombre de la funcionalidad que porporciona a la aplicación y no al nombre de la herramienta que contiene.
    -   Crear funciones de mapeo para que hagan las veces de interfaces entre las fuentes de datos y las capas internas de la aplicación.
    -   No implementar nunca lógica de negocio en esta sección.
    -   No invocar nunca métodos de otras capas desde esta sección.

-   <a id="architecture-adapters-transportlayer"></a>`transportLayer`

    Esta sección contienen el código necesario para dotar a nuestra aplicación de conectividad desde el exterior, es decir, para que otros elementos se conecten a ella.

    Cada herramienta utilizada en esta sección debe estar contenido en su directorio específico. Deberemos proporcionar un nombre lo más descriptivo posible en base a la función que dicha herramienta desempeña en nuestra aplicación y no el nombre de la propia herramienta. Por ejemplo, si estamos trabajando con [Express](https://expressjs.com/), [Fastify](https://www.fastify.io/), [Strapi](https://strapi.io/), etc., el directorio que contendrá esta herramienta debería llamarse `server`. De esta manera tenemos nuestro código desacoplado de una tecnología en concreto y sólo tenemos un nombre de funcionalidad.

    En caso de necesitar repactorizar porque se requiere reemplazar la herramienta como por ejemplo, si estamos usando Express y de ahora en adelante hemos decidido que vamos a movernos a Fastify, además de reemplazar la configuración del servidor, tendremos que asegurarnos de que la nueva implementación expone los mismo enpoints que teníamos implementados hasta ahora para Express, con el objeto de no afectar a la estructura de comunicaciones con nuestra aplicación.

    Pueden darse casos muy excepcionales donde la tecnología empleada y la funcionalidad proporcionada a la aplicación tengan el mismo nombre, como por ejemplo GraphQL. No es una herramienta tipo server porque trabaja con un server. Por otro lado su nombre coincide con la funcionalidad que proporciona. En este tipo de casos excepcionales, podemos meter la herramienta dentro de un directorio que coincida en nombre con ésta.

    Debido a que esta sección recibirá todas las peticiones de comunicación con nuestra aplicación, el código que definamos aquí deberá poder contactar con una parte de la capa `ports`, dedo que en esta sección nunca debemo implementar lógica de negocio. Un ejemplo de esta situación sería la autenticación de usuarios. Este tipo de operaciones estará reservada para métodos definidos en la capa `ports` de manera que en esta sección sólo usaríamos dicha funcionalidad, pero no la implementaríamos aquí.

    Con objeto de documentar nuestra API REST, dado que esta funcionalidad está altamente vinculada con la tecnología o herramienta de conectividad que hayamos seleccionado (por ejemplo si usamos Swagger/OpenAPI), si dicha documentación precisa de algún tipo de configuración y/o definición, ésta será colocada dentro del directorio `apiDocumentation`, definida en esta sección.

    Resumen:

    -   Solamente tecnologías o herramientas para la conextividad exterior de la aplicación.
    -   Wrap every technology into its specific folder.
    -   Envolver cada tecnología o herramienta en su propio directorio específico.
    -   Nombrar cada directorio con el nombre de la funcionalidad que porporciona a la aplicación y no al nombre de la herramienta que contiene.
    -   No implementar nunca lógica de negocio en esta sección.
    -   Invocar únicamente en esta sección, métodos definidos en la capa `ports`.

#### <a id="architecture-ports"></a>Ports

En esta capa implementaremos la mayor parte de la lógica de negocio de nuestra aplicación.

Para alcanzar este objetivo, esta capa se divide en dos secciones diferentes: `interactors` y `repositories`.

-   <a id="architecture-ports-interactors"></a>`interactors`

    Esta sección implementa aquellos elementos necesarios para poder ejecutar la lógica de negocio definida en la capa `core`, a través del uso directo de lo método en ella definidos.

    Algunas veces nos damos cuenta de que no es necesario implementar determinada lógica en la capa `core` ya que este código puede quedar perfectamente definido en un `interactor`. Esto está bien, se puede hacer. Siempre y cuando tengamos la absoluta certeza de que esta pieza de código no pertenece al `core`, podemos dejarla en esta sección. No obstante, ten siempre en mente que si algo es esencial para tu aplicación, esto es que si ese código en concreto la aplicación no es el mismo producto, debes mover dicho código a la capa `core`.

    Una propiedad adicional que tiene la sección `interactors` es que sus métodos pueden acceder a la sección `repositories` de esta misma capa, para gestionar información desde y hacia las fuentes de datos.

    Cuando definimos código en esta sección, tenemos que agruparlo en función a la funcionalidad que presta a la aplicación. Por ejemplo, todas las operaciones destinada a trabajar con usuarios, estarán localizadas dentro del directorio `users`.

    Resumen:

    -   Implementa lógica de negocio para ejecutar las funcionalidades definidas en la capa `core`.
    -   No pasa nada si implementamos lógica de negocio en esta sección, siempre y cuando ésta no pertenezca al 100% a la capa `core` (pero hazlo con precaución).
    -   Este código puede acceder a los recuros de la sección `repositories`.
    -   Agrupar el código por funcionalidad.

-   <a id="architecture-ports-repositories"></a>`repositories`

    Esta sección usará las interfaces así como las estructuras de datos definidas en la capa `core` pra crear las entidades que usaremos aquí.

    Además, el principal objetivo de esta sección es acceder a los métodos definidos en la sección `dataSources` de la capa `adapters`. Por esta razón, necesitamos tener aquí una copia de los nombres de los métodos que allí definidos, para poder invocarlos desde la capa `ports`.

    En esta sección implementaremos única y exclusivamente, la lógica de negocio necesaria para poder interactuar con la sección `dataSources` de la capa `adapters`.

    Cuando definimos código en esta sección, tenemos que agruparlo en función a la entidad a la que representa. Por ejemplo, todas las operaciones y entidades destinada a trabajar con usuarios, estarán localizadas dentro del directorio `users`.

    El código implementado en esta sección puede ser invocado por los `interactors` y de maneras extremadamente excepcional, desde la capa `core` si fuese necesario (cosa que no se recomienda en absoluto).

    Por último, los repositorios no necesitarán implementar funciones de mapeado o "parsers" en sus definiciones. Si tienes la necesidad de implementarlos a este nivel, seguramente deberías revisar su diseño y pensarlo de nuevo.

    Resumen:

    -   Implementamos las entidades que se usan en la capa `ports`, basadas en la estructura de datos definida en la capa `core`.
    -   Conecta directamente con el código definido a nivel de `adapters/dataSources`.
    -   Debe contener una copia de los métodos de gestión de datos expuestos a nivel de `adapters/dataSources`.
    -   Agrupar el código en base a las entidades que representan.
    -   No implementar funciones de mapeado o "parsers".
    -   No implementar lógica de negogio.

    **Advertencia sobre el concepto de `repository`**

    Es habitual que entendamos un repositorio como un elemento que además de definir una estructura de datos, también proporciona conectividad con la fuente de datos y es capaz de persistir y recuperar información.

    Este punto de vista está bien pero para este esquema de Arquitectura Hexagonal no es del todo exacto dado que podríamos llegar a tener un alto grado de acoplamiento entre el modelo de datos de nuestra apliación, el de la fuente de datos y con la tecnología o herramienta que estuviéramos usando. Esta situación nos impide modificar nuestra herramienta de gestión de datos sin que conlleve una refactorización profunda de la lógica de negocio de la aplicación.

    Por otro lado, el concepto de repositorio planteado en esta sección se centra en definir la lógica de negocio que implemente las propiedades más fundamentales como son la estructura y gestión de los datos. Así podemos aislar la tecnología empleada para el acceso a los datos. De esta manera, si modificamos la fuente de datos, nuestra aplicación no debería verse afectada más allá de readaptar el nivel `adapters/dataSources`.

#### <a id="architecture-core"></a>Core

A esta capa también se la conoce como `entities` o `domain` en otras arquitecturas semejantes a la hexagonal.

Esta capa tiene dos funciones principales:

-   Definir la estructura de datos propia de la aplicación (principalmente interfaces cuando estamos trabajando con TypeScript).

    Algunos ejemplos sobre esto podría ser la estructura de datos que un usuario, un producto o un carrito de la compra va a tener en nuestra aplicación. Dichas estructuras serán definirán cómo se moverá la información a través de la aplicación.

    Obviamente estas definiciones deben estar accesibles para los elementos que se encuentran dentro de la capa `ports`, los cuales las necesitan para poder crear y estructurar entidades funcionales.

-   Implementar aquella lógica de negocio altamente enlazada con el uso de la aplicación.

    Una regla rápida para saber si un código pertenece a la capa `core` es preguntarnos _"¿mi aplicación es la misma si saco este código del core?"_ Si la respuesta es **NO**, entonces ese código debe estar localizado dentro de la capa `core`.

    Por ejemplo, un código que debería estar en la capa `core` podría ser el que se encarga de crear `hashes` y/o los procesos de encriptación de datos. Otro ejemplo podría ser la generación de tokens. Estos elementos que son fundamentales en nuestra aplicación pertenecen a esta capa de negocio.

#### <a id="architecture-utils"></a>Utils

A pesar de que **esta sección no pertenece a la Arquitectura Hexagonal en absoluto**, en algunas ocasiones utilizamos herramientas que son transversales a todas las capas. Estamos hablando, por ejemplo, de herramientas de depuración y registro de operaciones o `loging`. Éstas son utilizadas en diferentes partes y niveles de nuestra aplicación para observar el comportamiento de nuestra aplicación así como la presencia de posibles errores.

En estos casos, podemos mover la configuración e implementación de estas herramientas a un directorio auxiliar.

En cualquier caso y como norma general, cada herramienta deberá está contenida en su propio directorio y además, si esta herramienta va a desempeñar una función específica en nuestra aplicación, usaremos el nombre de dicha funcionalidad para nombrar el directorio donde alojaremos la herramienta.

## <a id="commands"></a>Listado de comandos

### <a id="commands-switch-node"></a>Cambiando la versión de Node

```sh
nvm use
```

### <a id="commands-installation"></a>Proceso de instalación de módulos

```sh
npm i
```

### <a id="commands-manifes"></a>Creación del archivo `manifest`

Esta funcionalidad está enfocada a proporcionar información acerca de la aplicación, servicio o microservicio, cuando desplegamos nuestra aplicación mediante un contenedor de Docker, o en cualquier otra situación de ejecución.

Una vez hemos instalado los módulos de nuestro código (`npm i`), podemos ejecutar el comando `npm run manifest` con el que crearemos el archivo `manifest.json` en la raíz de nuestro proyecto. La estructura de dicho archivo es la siguiente:

```json
{
    "name": "nombre del proyecto que conincide con esta etiqueta dentro del archivo package.json",
    "version": "versión del proyecto que conincide con esta etiqueta dentro del archivo package.json",
    "timestamp": "marca temporal de creación del archivo, en formato ISO, esto es AAAA-MM-DDTHH:MM:SS.sssZ",
    "scm": {
        "remote": "ruta remota del repositorio que coincide con la propiedad remote.origin.url de la configuración GIT del proyecto",
        "branch": "rama de GIT en la que estábamos cuando se creó el archivo",
        "commit": "identificador del último commit de GIT cuando el archivo fue creado"
    }
}
```

De este modo, cuando hacemos la petición al endpoint `/__/manifest` de nuestro servicio, recibiremos esta información que es interesante por dos motivos: si recibimos los datos podemos asber que nuestra aplicación está funcionando y además, obtenemos información sobre la misma.

A nivel de crear código para producción, no debemos preocuparnos de generar este `manifest` antes de compilar la aplicación, ya que este comando está incluído en el script `build:pro`. Así podemos tener la certeza de que cuando creamos el bundle de nuestra aplicación, la información más actualizada sobre la misma estará disponible.

### <a id="commands-tests"></a>Ejecución de los tests

**Archivos necesarios:**

-   `env/.env.test`

```sh
# Tests unitarios y de integración.
npm test
# Covertura de tests.
npm run test:coverage
```

### <a id="commands-dev-mode"></a>Ejecución en modo desarrollo

**Archivos necesarios:**

-   `env/.env.dev`

```sh
npm run build:dev
```

### <a id="commands-pro-mode"></a>Compilación de la aplicación

Este proceso incluye la creación del archivo `manifest` así como la compilación de TypeScript y la generación del bundle.

**Archivos necesarios:**

-   `env/.env`

```sh
npm run build:pro
```

Una vez el proceso esté completado, el código empaquetado estará disponible en el directorio `dist`, para generar la imagen de Docker.

Revisa la definición del archivo `Dockerfile` para tener más información acerca de la imagen para el despliegue.

### <a id="commands-deployment"></a>Despliegue

Para desplegar nuestra aplicación usando Docker, necesitamos tener en mente que el proyecto debe ser compilado para _producción_ antes de ejecutar el `Dockerfile`.

#### <a id="commands-deployment-manually"></a>Manualment

Si vamos a desplegar nuestra aplicación manualmente, deberemos seguir los siguientes pasos:

```sh
# Situándonos en la raíz del proyecto.
$ npm run build:pro
$ docker build -f docker/Dockerfile -t <image_repository_name>/<image_name>:<image_version> .
$ docker push # Comando opcional si quieres subir tu imagen al Docker Registry (necesitarás haberte autenticado previamente).
$ docker run --name <container_name> -p <host_port>:<container_port> <image_repository_name>/<image_name>:<image_version>
```

Donde:

-   `image_repository_name` es el nombre del repositorio en el Docker Registry o en el tuyo propio, donde la imagen va a estar ubicada.
-   `image_name` nombre de la aplicación para que pueda ser localizada y descargada.
-   `image_version` es la versión de la imagen. Si no proporcionas ninguna versión, recuerda que Docker Registry le asignará automáticamente la versión `latest`.

#### <a id="commands-deployment-manually"></a>Automáticamente

Cuando usamos algún tipo de sistema CD/CI como por ejemplo CircleCI, debemos tener una configuración que nos asegure que primero se compilará la aplicación, colocando el bundle resultante dentro del directorio `dist` y después, ejecutamos el `Dockerfile`.

## <a id="apidoc"></a>Documentación de la API REST

`http://<service_url>:<service_port>/<api_doc_uri>`

Todos los elementos de esta URL deben estar definidos en las variables de entorno. Echa un vistazo a la sección [**variables de entorno**](#environment-variables).

## <a id="todo-list"></a>TODO list

-   Incluir [Log4JS](https://www.npmjs.com/package/log4js).
-   Incluir [Hygen](https://www.hygen.io/).
-   Incluir [GraphQL](https://graphql.org/).
-   Implementar herramientas de `event bus` para proporcionar funcionalidad de microservicio.
