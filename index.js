import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Low, JSONFile } from "lowdb";
const PORT = process.env.PORT || 5000;

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import books_router from "./router/books.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Books API",
      version: "v1.0",
      description: "A nodejs CRUD app for books resource",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./router/*.js"],
};

const specs = swaggerJsDoc(options);
const db = new Low(new JSONFile("file.json"));

const app = express();

app.db = db;
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/books", books_router);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
