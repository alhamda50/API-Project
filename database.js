const books = [
  {
    ISBN: "1234Book",
    title: "Tesla!!!",
    pubDate: "2021-08-05",
    language: "en",
    author: [1,2],
    publications: [1],
    category: ["tech" , "space" , "education"]
  }
]

const author = [
  {
    id: 1,
    name: "Aradhana",
    books: ["1234Book", "secretBook" , "5678Book"]
  },
  {
    id: 2,
    name: "Elon Musk",
    books: ["1234Book"]
  }
]

const publication = [
  {
    id: 1,
    name: "writex",
    books: ["1234Book"]
  },
  {
    id: 2,
    name: "writex2",
    books: []
  }
]

module.exports = {books , author , publication};
