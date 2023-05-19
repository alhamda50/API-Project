const express = require("express");
const bodyParser = require("body-parser");
//Database
const database = require("./database");

//initialize
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

/*

Route           /
Description     Get all the BOOKS
Access          Public
Parameter       NONE
Methods         Get

*/

booky.get("/" ,(req,res) => {
  return res.json({books: database.books});
});

/*

Route           /is
Description     Get all the BOOKS based on ISBN
Access          Public
Parameter       isbn
Methods         Get

*/

booky.get("/is/:isbn", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  ) ;

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});

/*

Route           /c
Description     Get all the BOOKS based on category
Access          Public
Parameter       category
Methods         Get

*/

booky.get("/c/:category" , (req,res) =>{
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  )

  if(getSpecificBook.length === 0){
    return res.json({error: `No book for the category of ${req.params.category}`})
  }

  return res.json({books: getSpecificBook});
});

/*

Route           /lan
Description     Get all the BOOKS based on language
Access          Public
Parameter       language
Methods         Get

*/

booky.get("/lan/:language", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language.includes(req.params.language)
  )

  if(getSpecificBook.length === 0){
    return res.json({error: `No book found for the language of ${req.params.language}`})
  }

return res.json({book: getSpecificBook});
});

/*

Route           /author
Description     Get all the Authors
Access          Public
Parameter       NONE
Methods         Get

*/

booky.get("/author" , (req,res) => {
  return res.json({author: database.author});
});
/*

Route           /author/book
Description     Get all the Authors based on bookes
Access          Public
Parameter      isbn
Methods         Get

*/

booky.get("/author/book/:isbn" , (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );
  if(getSpecificAuthor.length === 0){
    return res.json({error: `no book found for the book of ${req.params.isbn}`});
  }

  return res.json({author: getSpecificAuthor});
});

/*

Route           /id
Description     Get  the Author based on id
Access          Public
Parameter      id
Methods         Get

*/
 booky.get("/id/:id", (req,res) => {
   const getSpecificAuthor = database.author.filter(
     (author) => author.id === req.params.id
   );

   if(getSpecificAuthor.length === 0){
     return res.json({error: `no author found for the id of ${req.params.id}`});
   }
   return res.json({author: getSpecificAuthor});
 });

 /*

 Route           /publication
 Description     Get  all publications
 Access          Public
 Parameter      NONE
 Methods         Get

 */

 booky.get("/publication" ,(req,res) =>{
   return res.json({publication: database.publication});
 });

 /*
 Route           /id
 Description     Get specific publication based on id
 Access          Public
 Parameter       id
 Methods         Get

 */

 booky.get("/i/:idp" ,(req,res) => {
   const getSpecificPublication = database.publication.filter(
     (publication) => publication.idp.includes(req.params.idp)
   );
   if(getSpecificPublication.length === 0) {
     return res.json({error: `No Publications of ${req.params.idp} found`});
   }
   return res.json({publication: getSpecificPublication});
 });
 /*

 Route           /publication/book
 Description     Get all the publications based on bookes
 Access          Public
 Parameter      isbn
 Methods         Get

 */

 booky.get("/publication/book/:isbn" , (req,res) => {
   const getSpecificPublication = database.publication.filter(
     (publication) => publication.books.includes(req.params.isbn)
   );
   if(getSpecificPublication.length === 0){
     return res.json({error: `no publication found for the book of ${req.params.isbn}`});
   }

   return res.json({publication: getSpecificPublication});
 });


 /*

 Route           /book/new
 Description     Add new books
 Access          Public
 Parameter       NONE
 Methods         post

 */

 booky.post("/book/new", (req,res) => {
   const newBook = req.body;
   database.books.push(newBook);
   return res.json({updatedBooks: database.books});
 });
 /*

 Route           /book/new
 Description     Add new Author
 Access          Public
 Parameter       NONE
 Methods         post

 */
 booky.post("/author/new" ,(req,res) => {
   const newAuthor = req.body;
   database.author.push(newAuthor);
   return res.json(database.author);
 });
 /*

 Route           /publication/new
 Description     Add new publication
 Access          Public
 Parameter       NONE
 Methods         post

 */
 booky.post("/publication/new" ,(req,res) => {
   const newPublication = req.body;
   database.publication.push(newPublication);
   return res.json(database.publication);
 });
 /*

 Route          /publication/update/book
 Description     Update/Add new publication
  Access          Public
 Parameter       isbn
 Methods         put

 */

 booky.put("/publication/update/book/:isbn",(req,res) => {
   //Update the publication Database
   database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
   });

   //Update the book Database
   database.books.forEach((book) => {
     if(book.ISBN === req.params.isbn) {
       book.publication = req.body.pubId;
       return;
     }
   });

   return res.json(
     {
       books: database.books,
       publications: database.publication,
       message: "Successfully updated publications"
     }
   );
});
/*

Route           /book/delete
Description     Update/Add new publication
 Access          Public
Parameter       isbn
Methods         put

*/
booky.delete("/book/delete/:isbn", (req,res) => {
  /*Whichever book that doesnot match with the isbn,
  just send it to an updatedBookDatabase array
  and rest will be filtered out*/
  const updatedBookDatabase = database.books.filter(
    (book) =>book.ISBN !== req.params.isbn)
    database.books = updatedBookDatabase;
    return res.json({books:  database.books});
});
/*

Route           /book/delete
Description     Update/Add new publication
 Access          Public
Parameter       isbn
Methods         put

*/
booky.delete("/book/delete/author/:isbn/:authorId",(req,res) => {
  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });


  //Update the author Database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });
  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!"
  });
});

booky.listen(3000,() => {
  console.log("server is up and running");
});
