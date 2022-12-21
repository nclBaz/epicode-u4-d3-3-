// ******************************************* BOOKS RELATED ENDPOINTS ***********************************

/* ********************************************** BOOKS CRUD ENDPOINTS ***********************************

1. CREATE --> POST http://localhost:3001/books/ (+body)
2. READ --> GET http://localhost:3001/books/ (+ optional query params)
3. READ (single book) --> GET http://localhost:3001/books/:bookId
4. UPDATE (single book) --> PUT http://localhost:3001/books/:bookId (+ body)
5. DELETE (single book) --> DELETE http://localhost:3001/books/:bookId

*/

import express from "express"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import fs from "fs"

const booksRouter = express.Router()

const booksJSONPath = join(dirname(fileURLToPath(import.meta.url)), "books.json")

const getBooks = () => JSON.parse(fs.readFileSync(booksJSONPath))
const writeBooks = booksArray => fs.writeFileSync(booksJSONPath, JSON.stringify(booksArray))

booksRouter.post("/", (req, res) => {
  const newBook = { ...req.body, createdAt: new Date(), id: uniqid() }

  const booksArray = getBooks()

  booksArray.push(newBook)

  writeBooks(booksArray)

  res.status(201).send({ id: newBook.id })
})

booksRouter.get("/", (req, res) => {
  console.log(req.query)
  const booksArray = getBooks()
  if (req.query && req.query.category) {
    const filteredBooks = booksArray.filter(book => book.category === req.query.category)
    res.send(filteredBooks)
  } else {
    res.send(booksArray)
  }
})

booksRouter.get("/:bookId", (req, res) => {
  const books = getBooks()
  const book = books.find(book => book.id === req.params.bookId)
  res.send(book)
})

booksRouter.put("/:bookId", (req, res) => {
  const books = getBooks()

  const index = books.findIndex(book => book.id === req.params.bookId)
  const oldBook = books[index]

  const updatedBook = { ...oldBook, ...req.body, updatedAt: new Date() }

  books[index] = updatedBook

  writeBooks(books)
  res.send(updatedBook)
})

booksRouter.delete("/:bookId", (req, res) => {
  const books = getBooks()

  const remainingBooks = books.filter(book => book.id !== req.params.bookId)

  writeBooks(remainingBooks)

  res.status(204).send()
})

export default booksRouter
