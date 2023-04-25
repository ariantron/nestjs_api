
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ariantron/nestjs_api">
    <img src="https://camo.githubusercontent.com/5f54c0817521724a2deae8dedf0c280a589fd0aa9bffd7f19fa6254bb52e996a/68747470733a2f2f6e6573746a732e636f6d2f696d672f6c6f676f2d736d616c6c2e737667" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Users Web Service (NestJS)</h3>

  <p align="center">
    A simple rest api project implemented with TypeScript programming language, Node.js/NestJS framework, MongoDB database and RabbitMQ message broker. 
    <br />
    <a href="https://github.com/ariantron/nestjs_api/wiki"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ariantron/nestjs_api">View Demo</a>
    ·
    <a href="https://github.com/ariantron/issues">Report Bug</a>
    ·
    <a href="https://github.com/ariantron/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
This project was a REST application that included four APIs, each of these APIs is implemented in the project as follows:

Create User:
This API is called with the post method, by sending fields related to user creation, including first name, last name, email, avatar, user information is stored in the MongoDB database. In addition, a message is sent to the user's email and a new RabbitMQ event is created.

Get User:
In this API, which is called with the Get method, the user id parameter is received from the URL, and its information is received from the website https://reqres.in and sent in the form of json.

Get User Avatar:
In this API, which is called with the Get method, the user id parameter is received from the URL, in the first call the image is downloaded and stored in the system, then the photo information including userId and base64-encoded image is stored in the images collection in the database and the link The avatar image is sent from the website https://reqres.in. In subsequent calls, the base64-encoded image received from the database is sent.

Delete user Avatar:
In this API, which is called with the Delete method, the user id parameter is received from the URL, and the file related to the user's avatar image and its record are deleted in the database, and this is announced in the API response.

The end to end (e-2-e) tests are in the test folder, and the unit tests are written in the app.controller.spec and user.controller.spec.ts files at the address's "src/modules/user" and "src/modules/app" respectively.

The project's private information is stored in the .env file, whose template is .env.example. The project database is provided through the MongoDB Atlas cloud service, the RabbitMQ service through cloudamqp.com and the email SMTP server from the mailtrap.io website. The postman collection file named "postman_collection.json" is placed in the project.


### Built With

* [![TypeScript][TypeScript]][TypeScript-url]
* [![Nest][NestJS]][Nest-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![RabbitMQ][RabbitMQ]][RabbitMQ-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* npm
```sh
$ npm install npm@latest -g
```

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the GPL-3.0 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Arian Tron - [@ariantron](https://github.com/ariantron) - ariantron@yahoo.com

Project Link: [https://github.com/ariantron/nestjs_api](https://github.com/ariantron/nestjs_api)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ariantron/nestjs_api.svg?style=for-the-badge
[contributors-url]: https://github.com/ariantron/nestjs_api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ariantron/nestjs_api.svg?style=for-the-badge
[forks-url]: https://github.com/ariantron/nestjs_api/network/members
[stars-shield]: https://img.shields.io/github/stars/ariantron/nestjs_api.svg?style=for-the-badge
[stars-url]: https://github.com/ariantron/nestjs_api/stargazers
[issues-shield]: https://img.shields.io/github/issues/ariantron/nestjs_api.svg?style=for-the-badge
[issues-url]: https://github.com/ariantron/nestjs_api/issues
[license-shield]: https://img.shields.io/github/license/ariantron/nestjs_api.svg?style=for-the-badge
[license-url]: https://github.com/ariantron/nestjs_api/blob/master/LICENSE.txt
[NestJS]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[Nest-url]: https://nestjs.com
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com
[RabbitMQ]: https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white
[RabbitMQ-url]: https://www.rabbitmq.com/
