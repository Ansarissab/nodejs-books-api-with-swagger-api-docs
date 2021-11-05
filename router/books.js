import express from "express";
const router = express.Router();
import { nanoid } from "nanoid";
const id_length = 8;

// GET all books
router.get("/", (req, res) => {
  const books = req.app.db.get("books");
  res.status(200).send({ books });
});

// GET a book with id
router.get("/:id", (req, res) => {
  const book = req.app.db.get("books").find({ id: req.params.id });

  if (!book)
    res.status(404).send({ error: "Couldn't find Book with this id." });

  res.status(200).send({ book });
});

// POST create a book
router.post("/", (req, res) => {
  try {
    const book = {
      id: nanoid(id_length),
      ...req.body,
    };
    req.app.db.get("books").push(book).write();

    res.status(201).send({ message: "Book created successfully.", book });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

// UPDATE | PUT update the book with id and
router.put("/:id", (req, res) => {
  try {
    const book = req.app.db
      .get("books")
      .find({ id: req.params.id })
      .assign(req.body)
      .write();

    if (!book)
      res.status(404).send({ error: "Couldn't find Book with this id." });

    res.status(200).send({ book });
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

// DELETE delete the book with id
router.delete("/:id", (req, res) => {
  const book = req.app.db.get("books").remove({ id: req.params.id }).write();

  if (!book)
    res.status(404).send({ error: "Couldn't find Book with this id." });

  res.status(204).send({ message: "Book deleted successfully." });
});

export default router;
