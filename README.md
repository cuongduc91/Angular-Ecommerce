# 🚀Ecommerce Website

## 🐳Docker

- Download and Install [Docker](https://www.docker.com)
- Build the docker: `docker-compose build`
- Run the containers as environment
  `docker-compose up`

## db

- As local MySQL database running on port 3300

## 🐿DBeaver

- Download and install DBeaver as GUI configuration to the MySQL database
- https://dbeaver.io
- Configuration as MYSQL_USER/MYSQL_PASSWORD in development.env file on port 3320

## Environment file

- Create the development.env file in the main folder.
- Env. Parameters: MYSQL_USER, MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD...

## backend

- As the php dockerfile folder for nodejs running on localhost:3000
- The backend is created in the help of third library [express-generator](https://www.npmjs.com/package/express-generator)

### Nodejs

- Download and install [npm](https://nodejs.org/en/) package
- Initialize the package

```
npm install
```

- Run and install nodemon: `npm i -g nodemon`
- Manually run the script without running docker-compose file: `npm start`
