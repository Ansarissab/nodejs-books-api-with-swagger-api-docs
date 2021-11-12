import express from "express";
const router = express.Router();
import { nanoid } from "nanoid";
import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();

const id_length = 8;

// GET all books
router.get("/", (req, res) => {
  const books = db.data.books;
  res.status(200).send({ books });
});

// GET a book with id
router.get("/:id", (req, res) => {
  const book = db.data.books.find((book) => book.id == req.params.id);

  if (!book)
    res.status(404).send({ error: "Couldn't find Book with this id." });
  else res.status(200).send({ book });
});

// POST create a book
router.post("/", async (req, res) => {
  try {
    const book = {
      id: nanoid(id_length),
      ...req.body,
    };
    db.data.books.push(book);
    await db.write();

    res.status(201).send({ message: "Book created successfully.", book });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

// UPDATE | PUT update the book with id and
router.put("/:id", async (req, res) => {
  try {
    const book = db.data.books.find((book) => book.id == req.params.id);

    if (!book) {
      res.status(404).send({ error: "Couldn't find Book with this id." });
    } else {
      Object.assign(book, req.body);
      await db.write();
      res.status(200).send({ book });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

// DELETE delete the book with id
router.delete("/:id", async (req, res) => {
  const book = db.data.books.find((book) => book.id == req.params.id);
  db.data.books = removeElementFromArray(db.data.books, book);

  await db.write();
  if (!book)
    res.status(404).send({ error: "Couldn't find Book with this id." });

  res.status(204).send({ message: "Book deleted successfully." });
});

const removeElementFromArray = (arr, value) => {
  return arr.filter((ele) => {
    return ele.id != value.id;
  });
};

export default router;
