<a href="https://www.gotoiot.com/">
    <img src="doc/gotoiot-logo.png" alt="logo" title="Goto IoT" align="right" width="60" height="60" />
</a>

# Web App Full Stack Base

_Ayudaría mucho si apoyaras este proyecto con una ⭐ en Github!_

Este proyecto es una aplicación web fullstack que se ejecuta sobre el ecosistema `Docker`. Está compuesta por un compilador de `TypeScript` que te permite utilizar este superset de JavaScript para poder programar un `cliente web`. También tiene un servicio en `NodeJS` que te permite ejecutar código en backend y al mismo tiempo disponibilizar el código del cliente web para interactar con el servicio. Además tiene una `base de datos` MySQL que puede interactuar con el backend para guardar y consultar datos, y de manera adicional trae un `administrador` de base de datos para poder administrar la base en caso que lo necesites.

La aplicación IoT de base que viene con este proyecto se encarga de crear una tabla llamada `Devices` en la base de datos, y la idea es que vos puedas desarrollar el código de backend y frontend que te permita controlar desde el navegador el estado de los devices de un hogar inteligente - _como pueden ser luces, TVs, ventiladores, persianas, enchufes y otros_ - y almacenar los estados de cada uno en la base de datos.

Realizando estas tareas vas a a tener una aplicación fullstack IoT del mundo real que utiliza tecnologías actuales en la que un backend es capaz de interactuar con una DB para cumplir con las peticiones de control que se le mandan desde el cliente web.

En esta imagen podés ver una posible implementación del cliente web que controla los artefactos del hogar.

![architecture](doc/webapp-example-1.png)

## Comenzando 🚀

Esta sección es una guía con los pasos escenciales para que puedas poner en marcha la aplicación.

<details><summary><b>Mira los pasos necesarios</b></summary><br>

### Instalar las dependencias

Para correr este proyecto es necesario que instales `Docker` y `Docker Compose`.

En [este artículo](https://www.gotoiot.com/pages/articles/docker_installation_linux/) publicado en nuestra web están los detalles para instalar Docker y Docker Compose en una máquina Linux. Si querés instalar ambas herramientas en una Raspberry Pi podés seguir [este artículo](https://www.gotoiot.com/pages/articles/rpi_docker_installation) de nuestra web que te muestra todos los pasos necesarios.

En caso que quieras instalar las herramientas en otra plataforma o tengas algún incoveniente, podes leer la documentación oficial de [Docker](https://docs.docker.com/get-docker/) y también la de [Docker Compose](https://docs.docker.com/compose/install/).

Continua con la descarga del código cuando tengas las dependencias instaladas y funcionando.

### Descargar el código

Para descargar el código, lo más conveniente es que realices un `fork` de este proyecto a tu cuenta personal haciendo click en [este link](https://github.com/gotoiot/app-fullstack-base/fork). Una vez que ya tengas el fork a tu cuenta, descargalo con este comando (acordate de poner tu usuario en el link):

```
git clone https://github.com/USER/app-fullstack-base.git
```

> En caso que no tengas una cuenta en Github podes clonar directamente este repo.

### Ejecutar la aplicación

Para ejecutar la aplicación tenes que correr el comando `docker-compose up` desde la raíz del proyecto. Este comando va a descargar las imágenes de Docker de node, de typescript, de la base datos y del admin de la DB, y luego ponerlas en funcionamiento.

Para acceder al cliente web ingresa a a la URL [http://localhost:8000/](http://localhost:8000/) y para acceder al admin de la DB accedé a [localhost:8001/](http://localhost:8001/).

Si pudiste acceder al cliente web y al administrador significa que la aplicación se encuentra corriendo bien.

> Si te aparece un error la primera vez que corres la app, deteńe el proceso y volvé a iniciarla. Esto es debido a que el backend espera que la DB esté creada al iniciar, y en la primera ejecución puede no alcanzar a crearse. A partir de la segunda vez el problema queda solucionado.

</details>

Continuá explorando el proyecto una vez que lo tengas funcionando.

## Configuraciones de funcionamiento 🔩

Al crearse la aplicación se ejecutan los contenedores de Docker de cada servicio, se crea la base de datos y sus tablas. A continuación podés encontrar info si querés cambiar la estructura de la DB o bien sus configuraciones de acceso.

<details><summary><b>Lee cómo configurar la aplicación</b></summary><br>

### Configuración de la DB

Como ya comprobaste, para acceder PHPMyAdmin tenés que ingresar en la URL [localhost:8001/](http://localhost:8001/). En el login del administrador, el usuario para acceder a la db es `root` y contraseña es la variable `MYSQL_ROOT_PASSWORD` del archivo `docker-compose.yml`.

Para el caso del servicio de NodeJS que se comunica con la DB fijate que en el archivo `src/backend/mysql-connector.js` están los datos de acceso para ingresar a la base.

Si quisieras cambiar la contraseña, puertos, hostname u otras configuraciones de la DB deberías primero modificar el servicio de la DB en el archivo `docker-compose.yml` y luego actualizar las configuraciones para acceder desde PHPMyAdmin y el servicio de NodeJS.

### Estructura de la DB

Al iniciar el servicio de la base de datos, si esta no está creada toma el archivo que se encuentra en `db/dumps/smart_home.sql` para crear la base de datos automáticamente.

En ese archivo está la configuración de la tabla `Devices` y otras configuraciones más. Si quisieras cambiar algunas configuraciones deberías modificar este archivo y crear nuevamente la base de datos para que se tomen en cuenta los cambios.

Tené en cuenta que la base de datos se crea con permisos de superusuario por lo que no podrías borrar el directorio con tu usuario de sistema, para eso debés hacerlo con permisos de administrador. En ese caso podés ejecutar el comando `sudo rm -r db/data` para borrar el directorio completo.

</details>

## Detalles principales 🔍

En esta sección vas a encontrar las características más relevantes del proyecto.

<details><summary><b>Mira los detalles más importantes de la aplicación</b></summary><br>
<br>

### Arquitectura de la aplicación

Como ya pudiste ver, la aplicación se ejecuta sobre el ecosistema Docker, y en esta imagen podés ver el diagrama de arquitectura.

![architecture](doc/architecture.png)

### El cliente web

El cliente web es una Single Page Application que se comunica con el servicio en NodeJS mediante JSON a través de requests HTTP. Puede consultar el estado de dispositivos en la base de datos (por medio del servicio en NodeJS) y también cambiar el estado de los mismos como tambien para poder agregar y eliminarlos. Los estilos del código están basados en **Material Design**.

### El servicio web

El servicio en **NodeJS** posee distintos endpoints para comunicarse con el cliente web mediante requests HTTP enviando **JSON** en cada transacción. Procesando estos requests es capaz de comunicarse con la base de datos para consultar y controlar el estado de los dispositivos, y devolverle una respuesta al cliente web también en formato JSON. Así mismo el servicio es capaz de servir el código del cliente web.

### La base de datos

La base de datos se comunica con el servicio de NodeJS y permite almacenar el estado de los dispositivos en la tabla **Devices**. Ejecuta un motor **MySQL versión 5.7** y permite que la comunicación con sus clientes pueda realizarse usando usuario y contraseña en texto plano. En versiones posteriores es necesario brindar claves de acceso, por este motivo la versión 5.7 es bastante utilizada para fases de desarrollo.

### El administrador de la DB

Para esta aplicación se usa **PHPMyAdmin**, que es un administrador de base de datos web muy utilizado y que podés utilizar en caso que quieras realizar operaciones con la base, como crear tablas, modificar columnas, hacer consultas y otras cosas más.

### El compilador de TypeScript

**TypeScript** es un lenguaje de programación libre y de código abierto desarrollado y mantenido por Microsoft. Es un superconjunto de JavaScript, que esencialmente añade tipos estáticos y objetos basados en clases. Para esta aplicación se usa un compilador de TypeScript basado en una imagen de [Harmish](https://hub.docker.com/r/harmish) en Dockerhub, y está configurado para monitorear en tiempo real los cambios que se realizan sobre el directorio **src/frontend/ts** y automáticamente generar código compilado a JavaScript en el directorio **src/frontend/js**. Los mensajes del compilador aparecen automáticamente en la terminal al ejecutar el comando **docker-compose up**.

### Ejecución de servicios

Los servicios de la aplicación se ejecutan sobre **contenedores de Docker**, así se pueden desplegar de igual manera en diferentes plataformas. Los detalles sobre cómo funcionan los servicios los podés ver directamente en el archivo **docker-compose.yml**.

### Organización del proyecto

En la siguiente ilustración podés ver cómo está organizado el proyecto para que tengas en claro qué cosas hay en cada lugar.

```sh
├── db                          # directorio de la DB
│   ├── data                    # estructura y datos de la DB
│   └── dumps                   # directorio de estructuras de la DB
│       └── smart_home.sql      # estructura con la base de datos "smart_home"
├── doc                         # documentacion general del proyecto
└── src                         # directorio codigo fuente
│   ├── backend                 # directorio para el backend de la aplicacion
│   │   ├── index.js            # codigo principal del backend
│   │   ├── mysql-connector.js  # codigo de conexion a la base de datos
│   │   ├── package.json        # configuracion de proyecto NodeJS
│   │   └── package-lock.json   # configuracion de proyecto NodeJS
│   └── frontend                # directorio para el frontend de la aplicacion
│       ├── js                  # codigo javascript que se compila automáticamente
│       ├── static              # donde alojan archivos de estilos, imagenes, fuentes, etc.
│       │   ├── css             # se alojan los archivos css tanto de los componentes creados como de materialize
│       │   └── js              # se aloja el archivo js para poder utilizar componmentes del framework materialize
│       ├── ts                  # donde se encuentra los codigos TS y la configuracion del mismo
│       │   ├── device.ts       # se aloja la clase Device que se va a utilizar para declarar los atributos del mismo y los tipos de dispositivos que puede haber
│       │   ├── main.ts         # codigo principal frontend
│       │   ├── tsconfig.json   # configuracion de typescript
│       │   ├── utils.ts        # se alojan funciones que se repiten en varios lugares de main para optimizar el codigo
│       └── index.html          # archivo principal del cliente HTML
├── docker-compose.yml          # archivo donde se aloja la configuracion completa
├── README.md                   # este archivo
├── CHANGELOG.md                # archivo para guardar los cambios del proyecto
├── LICENSE.md                  # licencia del proyecto
```

> No olvides ir poniendo tus cambios en el archivo `CHANGELOG.md` a medida que avanzas en el proyecto.

</details>

## Detalles de implementación 💻

En esta sección podés ver los detalles específicos de funcionamiento del código y que son los siguientes.

<details><summary><b>Mira los detalles de implementación</b></summary><br>

### Agregar un dispositivo

Para agregar un dispositivo primero debes apretar el boton: "AGREGAR DISPOSITIVO". Esto abrirar un modal con un formulario a completar. Se deben completar
TODOS los campos y luego apretar el boton "GUARDAR". Con eso ya se creara el nuevo dispositivo.

### Frontend

El front end consiste de 3 archivos principales:

- Index.html: Este archivo contiene el codigo HTML de la SPA.
- styles.css: Este contiene los estilos que utilizan los componentes HTML.
- main.ts: Este archivo contiene toda la capa logica del frontend.

En main.ts se declara una clase para interactuar con los dispoistivos. Esto se hace atraves de los siguientes metodos:

#### Métodos:

- getDevices():Realiza una solicitud GET al servidor para obtener la lista de dispositivos desde la base de datos.
  Manipula la respuesta para mostrar la lista de dispositivos en la interfaz de usuario.
  Asocia listeners a los botones de cada dispositivo (checkbox, botón de eliminación y botón de edición).

- addDevice(): Obtiene valores de campos de formulario para un nuevo dispositivo. Realiza una solicitud POST al servidor para agregar un nuevo dispositivo.
  Actualiza la lista de dispositivos después de la operación.

- deleteDevice(id: string):Realiza una solicitud DELETE al servidor para eliminar el dispositivo con el ID proporcionado.
  Actualiza la lista de dispositivos después de la operación.

- changeState(id: string): Realiza una solicitud GET para obtener información sobre el dispositivo con el ID proporcionado.
  Cambia el estado del dispositivo y realiza una solicitud PUT al servidor para actualizar el estado.
  Actualiza la lista de dispositivos después de la operación.

- loadModalValues(id: string):Realiza una solicitud GET para obtener información sobre el dispositivo con el ID proporcionado.
  Carga los valores del dispositivo en un formulario modal para su edición.

- editDevice(id: string): Realiza una solicitud GET para obtener información sobre el dispositivo con el ID proporcionado.
  Obtiene los valores editados del formulario modal y realiza una solicitud PUT al servidor para actualizar la información del dispositivo.
  Actualiza la lista de dispositivos después de la operación.

- handleEvent(object: Event): Maneja eventos de clic en varios elementos de la interfaz, como botones de guardar, eliminar, cambiar estado, editar y confirmar edición.

#### Uso:

1. Interfaz de Usuario:

- Lista dispositivos con información básica.
- Permite agregar nuevos dispositivos.
- Permite eliminar dispositivos.
- Permite cambiar el estado de los dispositivos (encendido/apagado).
- Permite editar información de dispositivos.

2. Materialize CSS:

- Utiliza los componentes de Materialize CSS para interfaz y modales

3. Event Listeners:

- Asocia eventos a varios elementos de la interfaz para manejar acciones del usuario.

Cabe destacar que este código espera que haya un servidor que responda a las solicitudes HTTP para realizar operaciones CRUD en la base de datos de dispositivos. Asegúrate de configurar correctamente el servidor y la base de datos para que la aplicación funcione correctamente.

### Backend

This Node.js application serves as a simple API for managing devices. It utilizes the Express framework for handling HTTP requests, CORS for cross-origin resource sharing, and a MySQL database for storing device information.

#### Middleware Setup:

- CORS Configuration: Cross-Origin Resource Sharing is configured to allow requests from any origin (\*) and set a success status of 200.
- JSON Body Parsing: The application is set up to parse incoming JSON data in request bodies.
- Static File Serving: It serves static files from the /home/node/app/static/ directory.

#### Middleware for Request Validation:

- A middleware named validateDeviceFields is implemented to ensure that the required fields for a device are present in the request body (name, description, state, and type).
  If any field is missing, a 400 Bad Request response is sent; otherwise, the request proceeds to the next middleware or route handler.

#### Endpoints

- GET /devices: Retrieve information about all devices from the database.
- GET /devices/:id: Retrieve information about a specific device by its ID from the database.
- POST /device: Add a new device to the database. The request body must contain name, description, state, and type. The validateDeviceFields middleware ensures the completeness of the information.
- PUT /device/:id: Update an existing device in the database by its ID. Similar to the POST request, it requires a complete set of device information in the request body.
- DELETE /device/:id: Delete a device from the database by its ID.

#### DB Interaction

- The application interacts with a MySQL database using the mysql-connector module.
- SQL queries are used to perform CRUD operations on the "Devices" table.

<details><summary><b>Ver los endpoints disponibles</b></summary><br>

1. Obtener todos los dispositivos.

- Endpoint: GET /devices
- Método: GET
- Headers:
  - Content-Type: application/json
- Request Body:
  - No se espera un cuerpo en la solicitud.
- Response Code: 200
- Ejemplo de Respuesta:

```json
{
  "devices": [
    {
      "id": 1,
      "status": 0,
      "description": "Kitchen light",
      "name": "light 1",
      "type": 3
    },
    {
      "id": 2,
      "status": 0,
      "description": "AC Kitchen",
      "name": "AC 1",
      "type": 1
    }
  ]
}
```

2. Obtener información de un dispositivo por ID.

- Endpoint: GET /devices/:id
- Método: GET
- Headers:
  - Content-Type: application/json
- Request Body:
  - No se espera un cuerpo en la solicitud.
- Response Code: 200
- Ejemplo de Respuesta:

```json
{
  "devices": [
    {
      "id": 2,
      "status": 0,
      "description": "AC Kitchen",
      "name": "AC 1",
      "type": 1
    }
  ]
}
```

3. Agregar un nuevo dispositivo

- Endpoint: POST /device
- Método: POST
- Headers:
  - Content-Type: application/json
- Request Body:
  ```json
  {
    "name": "New Device",
    "description": "Description of the new device",
    "state": true,
    "type": 2
  }
  ```
- Response Code: 200 si el dispositivo se agrega correctamente, 409 si hay un conflicto.
- Ejemplo de Respuesta Exitosa:

```json
{
  "message": "Device added successfully"
}
```

- Ejemplo de Respuesta Error:

```json
{
  "error": "Device with the same name already exists"
}
```

4. Actualizar información de un dispositivo por ID

- Endpoint: PUT /device/:id
- Método: PUT
- Headers:
  - Content-Type: application/json
- Request Body:
  ```json
  {
    "name": "Updated Device",
    "description": "Updated description",
    "state": false,
    "type": 1
  }
  ```
- Response Code: 200 si el dispositivo se agrega correctamente, 409 si hay un conflicto.
- Ejemplo de Respuesta Exitosa:

```json
{
  "message": "Device updated successfully"
}
```

- Ejemplo de Respuesta Error:

```json
{
  "error": "Device not found"
}
```

4. Eliminar dispositivo por ID

- Endpoint: DELETE /device/:id
- Método: DELETE
- Headers:
  - Content-Type: application/json
- Request Body:
  - No se espera un cuerpo en la solicitud.
- Response Code: 200 si el dispositivo se agrega correctamente, 404 si no se encuentra ,409 si hay un conflicto.
- Ejemplo de Respuesta Exitosa:

```json
{
  "message": "Device updated successfully"
}
```

- Ejemplo de Respuesta Error:

```json
{
  "error": "Device not found"
}
```

</details>

</details>

## Tecnologías utilizadas 🛠️

En esta sección podés ver las tecnologías más importantes utilizadas.

<details><summary><b>Mira la lista completa de tecnologías</b></summary><br>

- [Docker](https://www.docker.com/) - Ecosistema que permite la ejecución de contenedores de software.
- [Docker Compose](https://docs.docker.com/compose/) - Herramienta que permite administrar múltiples contenedores de Docker.
- [Node JS](https://nodejs.org/es/) - Motor de ejecución de código JavaScript en backend.
- [MySQL](https://www.mysql.com/) - Base de datos para consultar y almacenar datos.
- [PHPMyAdmin](https://www.phpmyadmin.net/) - Administrador web de base de datos.
- [Material Design](https://material.io/design) - Bibliotecas de estilo responsive para aplicaciones web.
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript tipado y con clases.

</details>

## Contribuir 🖇️

Si estás interesado en el proyecto y te gustaría sumar fuerzas para que siga creciendo y mejorando, podés abrir un hilo de discusión para charlar tus propuestas en [este link](https://github.com/gotoiot/app-fullstack-base/issues/new). Así mismo podés leer el archivo [Contribuir.md](https://github.com/gotoiot/gotoiot-doc/wiki/Contribuir) de nuestra Wiki donde están bien explicados los pasos para que puedas enviarnos pull requests.

## Sobre Goto IoT 📖

Goto IoT es una plataforma que publica material y proyectos de código abierto bien documentados junto a una comunidad libre que colabora y promueve el conocimiento sobre IoT entre sus miembros. Acá podés ver los links más importantes:

- **[Sitio web](https://www.gotoiot.com/):** Donde se publican los artículos y proyectos sobre IoT.
- **[Github de Goto IoT:](https://github.com/gotoiot)** Donde están alojados los proyectos para descargar y utilizar.
- **[Comunidad de Goto IoT:](https://groups.google.com/g/gotoiot)** Donde los miembros de la comunidad intercambian información e ideas, realizan consultas, solucionan problemas y comparten novedades.
- **[Twitter de Goto IoT:](https://twitter.com/gotoiot)** Donde se publican las novedades del sitio y temas relacionados con IoT.
- **[Wiki de Goto IoT:](https://github.com/gotoiot/doc/wiki)** Donde hay información de desarrollo complementaria para ampliar el contexto.

## Muestas de agradecimiento 🎁

Si te gustó este proyecto y quisieras apoyarlo, cualquiera de estas acciones estaría más que bien para nosotros:

- Apoyar este proyecto con una ⭐ en Github para llegar a más personas.
- Sumarte a [nuestra comunidad](https://groups.google.com/g/gotoiot) abierta y dejar un feedback sobre qué te pareció el proyecto.
- [Seguirnos en twitter](https://github.com/gotoiot/doc/wiki) y dejar algún comentario o like.
- Compartir este proyecto con otras personas.

## Autores 👥

Las colaboraciones principales fueron realizadas por:

- **[Agustin Bassi](https://github.com/agustinBassi)**: Ideación, puesta en marcha y mantenimiento del proyecto.
- **[Ernesto Giggliotti](https://github.com/ernesto-g)**: Creación inicial del frontend, elección de Material Design.
- **[Brian Ducca](https://github.com/brianducca)**: Ayuda para conectar el backend a la base de datos, puesta a punto de imagen de Docker.

También podés mirar todas las personas que han participado en la [lista completa de contribuyentes](https://github.com/###/contributors).

## Licencia 📄

Este proyecto está bajo Licencia ([MIT](https://choosealicense.com/licenses/mit/)). Podés ver el archivo [LICENSE.md](LICENSE.md) para más detalles sobre el uso de este material.

---

**Copyright © Goto IoT 2021** ⌨️ [**Website**](https://www.gotoiot.com) ⌨️ [**Group**](https://groups.google.com/g/gotoiot) ⌨️ [**Github**](https://www.github.com/gotoiot) ⌨️ [**Twitter**](https://www.twitter.com/gotoiot) ⌨️ [**Wiki**](https://github.com/gotoiot/doc/wiki)
