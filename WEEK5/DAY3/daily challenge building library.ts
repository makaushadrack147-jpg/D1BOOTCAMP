// 1. Book interface
interface Book {
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    genre?: string; // Optional property
}

// 2. Library class
class Library {
    private books: Book[] = [];

    // Add a book to the library
    public addBook(book: Book): void {
        this.books.push(book);
    }

    // Get book details using ISBN
    public getBookDetails(isbn: string): Book | undefined {
        return this.books.find(book => book.isbn === isbn);
    }
}

// 3. DigitalLibrary class
class DigitalLibrary extends Library {
    readonly website: string;

    constructor(website: string) {
        super();
        this.website = website;
    }

    // Return a list of all book titles
    public listBooks(): string[] {
        // We cannot directly access private "books",
        // so we use getBookDetails through the ISBNs we know.
        // Instead, we'll maintain titles separately.
        return this.titles;
    }

    private titles: string[] = [];

    public override addBook(book: Book): void {
        super.addBook(book);
        this.titles.push(book.title);
    }
}

// Create a DigitalLibrary instance
const digitalLibrary = new DigitalLibrary(
    "https://www.mydigitallibrary.com"
);

// Add books
digitalLibrary.addBook({
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    publishedYear: 1925,
    genre: "Classic"
});

digitalLibrary.addBook({
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    publishedYear: 1949,
    genre: "Dystopian"
});

digitalLibrary.addBook({
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780547928227",
    publishedYear: 1937,
    genre: "Fantasy"
});

// Print website
console.log("Library Website:", digitalLibrary.website);

// Get and print book details
console.log(
    "Book Details:",
    digitalLibrary.getBookDetails("9780743273565")
);

console.log(
    "Book Details:",
    digitalLibrary.getBookDetails("9780451524935")
);

// Print all book titles
console.log("All Book Titles:", digitalLibrary.listBooks());