document.addEventListener('DOMContentLoaded', function() {
    const bookList = document.getElementById('bookList');
    
    fetch('books.json')
        .then(response => response.json())
        .then(data => displayBooks(data))
        .catch(error => console.error('Error fetching books:', error));

    function displayBooks(books) {
        bookList.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Genre: ${book.genre}</p>
                <p>Cost: $${book.cost}</p>
            `;
            bookList.appendChild(bookItem);
        });
    }
});

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase();
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            const filteredBooks = data.filter(book => 
                book.title.toLowerCase().includes(query) || 
                book.author.toLowerCase().includes(query)
            );
            displayBooks(filteredBooks);
        });
});

const sortSelect = document.getElementById('sortSelect');

sortSelect.addEventListener('change', function() {
    const sortBy = sortSelect.value;
    fetch('books.json')
        .then(response => response.json())
        .then(data => {
            const sortedBooks = data.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
            });
            displayBooks(sortedBooks);
        });
});

const filterButton = document.getElementById('filterButton');

filterButton.addEventListener('click', function() {
    const genre = prompt('Enter genre to filter by:');
    if (genre) {
        fetch('books.json')
            .then(response => response.json())
            .then(data => {
                const filteredBooks = data.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
                displayBooks(filteredBooks);
            });
    }
});


const booksPerPage = 10;
let currentPage = 1;

function displayBooks(books) {
    bookList.innerHTML = '';
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginatedBooks = books.slice(start, end);

    paginatedBooks.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Genre: ${book.genre}</p>
            <p>Cost: $${book.cost}</p>
        `;
        bookList.appendChild(bookItem);
    });

    setupPagination(books);
}

function setupPagination(books) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const pageCount = Math.ceil(books.length / booksPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', function() {
            currentPage = i;
            displayBooks(books);
        });
        pagination.appendChild(button);
    }
}

fetch('books.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => displayBooks(data))
    .catch(error => {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to load books. Please try again later.';
        document.body.appendChild(errorMessage);
        console.error('Error fetching books:', error);
    });

