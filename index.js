require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//Database
const database = require("./database/database");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//initialize
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
).then(() => console.log("connection Established"));
/*
Route           /
Description     Get all the BOOKS
Access          Public
Parameter       NONE
Methods         Get
*/

booky.get("/" ,async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route           /is
Description     Get all the BOOKS based on ISBN
Access          Public
Parameter       isbn
Methods         Get
*/

booky.get("/is/:isbn", async(req,res) => {
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

  //null !0 = 1, !1=0
  if(!getSpecificBook) {
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

booky.get("/c/:category" , async(req,res) =>{
  const getSpecificBook = await BookModel.findOne({category: req.params.category});

  //null !0 = 1, !1=0
  if(!getSpecificBook) {
    return res.json({error: `No book found for the category of ${req.params.category}`});
  }

  return res.json({book: getSpecificBook});
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

booky.get("/author" ,async (req,res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
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

 booky.get("/publications" ,async (req,res) => {
   const getAllPublications = await PublicationModel.find();
   return res.json(getAllPublications);
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

 booky.post("/book/new", async(req,res) => {
   const { newBook } = req.body;
   const addNewBook = BookModel.create(newBook);
   return res.json({
     books: addNewBook,
      message: "Book was added!!!"
    });
 });

 /*
 Route           /book/new
 Description     Add new Author
 Access          Public
 Parameter       NONE
 Methods         post
 */
 booky.post("/author/new" ,async(req,res) => {
   const { newAuthor } = req.body;
   const addNewAuthor = AuthorModel.create(newAuthor);
   return res.json({
     Author: addNewAuthor,
     message: "Author was added"
   });
 });

 /*
 Route           /publication/new
 Description     Add new publication
 Access          Public
 Parameter       NONE
 Methods         post
 */
 booky.post("/publication/new" ,(req,res) => {
   const { newPublication } = req.body;
   const addNewPublication = PublicationModel.create(newPublication);
   return res.json({
     Publication: addNewPublication,
     message: "Publication was Added"
   });
 });

 /*
 Route           /book/update
 Description     Update/Add new publication
  Access          Public
 Parameter       isbn
 Methods         put
 */

booky.put("/book/update/:isbn" ,async(req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({
    books: updatedBook
  });
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
Route           /book/author/update
Description     Update/Add new author
 Access          Public
Parameter       isbn
Methods         put
*/

booky.put("/book/author/update/:isbn", async(req,res) => {
  //Update Book Database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        authors: req.params.newAuthor
      }
    },
    {
      new: true
    }
  );

//Update Author Database
const updatedAuthor = await AuthorModel.findOneAndUpdate(
  {
    id: req.body.newAuthor
  },
  {
    $addToSet:  {
      books: req.params.isbn
    }
  }
);
return res.json(
  {
    books: updatedBook,
    authors: updatedAuthor,
    message: "Added new author"
  }
)
});


/*
Route           /book/delete
Description     delete a book
 Access          Public
Parameter       isbn
Methods         delete
*/
booky.delete("/book/delete/:isbn", async(req,res) => {
  /*Whichever book that doesnot match with the isbn,
  just send it to an updatedBookDatabase array
  and rest will be filtered out*/
  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );
  return res.json({
    books: updatedBookDatabase
  });
});



/*
Route           /book/delete/author
Description     delete an author
 Access          Public
Parameter       isbn
Methods         delete
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
