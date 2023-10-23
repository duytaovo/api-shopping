require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const cors = require("cors");
const { sequelize } = require("./models");
const { rootRouter } = require("./routes");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

app.use(express.static(path.join(__dirname, "./public")));
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use("/api/v1", rootRouter);

server.listen(process.env.PORT, async () => {
  try {
    // await sequelize.authenticate();
    await sequelize.sync({ force: true });
    // await sequelize.sync({ alert: true });
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (err) {
    console.log(`Oops. Something went wrong: ${err}`);
  }
});

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: " Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Shopping",
        email: "voduytao3@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5032",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
