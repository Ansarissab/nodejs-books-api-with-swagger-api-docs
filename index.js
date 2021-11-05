const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const lowdb = require("lowdb");
const PORT = process.env.PORT || 5000;

const books_router = require("./router/books");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = lowdb(adapter);
db.defaults({ books: [] }).write();
const app = express();

app.db = db;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/books", books_router);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
