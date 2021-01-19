document.addEventListener("DOMContentLoaded", function () {
  fetchBooks();
});
// get books
function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then((resp) => resp.json())
    .then((books) => {
      books.forEach((book) => {
        rendersBook(book);
      });
    });
}
// dom minipulation rendering a book
function rendersBook(book) {
  const li = document.createElement("li");
  const list = document.getElementById("list");
  li.textContent = book.title;
  li.addEventListener("click", () => showBook(book));
  list.appendChild(li);
}
// event for showing book that was clicked
function showBook(book) {
  const showPanel = document.getElementById("show-panel");
  showPanel.innerHTML = "";
  const img = document.createElement("img");
  const title = document.createElement("h5");
  const subtitle = document.createElement("h5");
  const author = document.createElement("h5");
  const desc = document.createElement("p");
  const ul = document.createElement("ul");
  const likeBtn = document.createElement("button");
  img.src = book.img_url;
  title.textContent = book.title;
  subtitle.textContent = book.subtitle;
  author.textContent = book.author;
  desc.textContent = book.description;
  book.users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.username;
    ul.appendChild(li);
  });
  if (userLiked(book)) {
    likeBtn.innerText = "UNLIKE";
  } else {
    likeBtn.innerText = "LIKE";
  }
  likeBtn.addEventListener("click", () => likeBook(book, likeBtn));
  showPanel.append(img, title, subtitle, author, desc, ul, likeBtn);
}
// check if user has liked the book already
function userLiked(book) {
  // debugger
  return book.users.find(({ username }) => username === "pouros");
}
// event for liking a book
function likeBook(book, likeBtn) {
  if (likeBtn.innerText === "LIKE") {
    likeBtn.innerText = "UNLIKE";
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        users: [...book.users, { id: 1, username: "pouros" }],
      }),
    })
      .then((resp) => resp.json())
      .then((book) => showBook(book));
  } else {
    likeBtn.innerText = "LIKE";
    let index = book.users.indexOf({ id: "1", username: "pouros" });
    book.users.splice(book.users.length + index, 1);
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ users: book.users }),
    })
      .then((resp) => resp.json())
      .then((book) => showBook(book));
  }
}
