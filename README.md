# Add Book to Goodreads

Chrome extension that detects books on web pages and provides quick access to add them to your Goodreads shelves.

The extension automatically extracts book information (ISBN/ASIN) from the current page, fetches book details from Goodreads, and displays the title and author in a popup. From there, you can easily add the book to your Goodreads shelves without leaving the page. It works on book-related pages across the web, including Amazon, Google Books, publisher sites, and many others.

## Installation and Usage

### Chrome Web Store

https://chrome.google.com/webstore/detail/add-book-to-goodreads/kecmjklilofklihnefffjgafcbjmbbbl

### Side load

1. Clone the repository to a local directory
2. Get a Goodreads API key from https://www.goodreads.com/api/keys
3. Set the Goodreads API key at `_GOODREADS_API_KEY`
4. Load the unpacked extension into Google Chrome. See https://developer.chrome.com/extensions/getstarted#manifest

#### Goodreads API Key

The extension uses a Goodreads API Key to fetch book details. You can obtain a free API Key at https://www.goodreads.com/api/keys

## How It Works

This extension extracts ISBN or ASIN numbers from the current page and fetches book details from the Goodreads API. It displays the book's title and author, and allows you to add it to a Goodreads shelf using the "Add to My Books" widget (http://www.goodreads.com/api/atmb_widget). The extension prioritizes ISBN-10, then ISBN-13, and finally ASIN when multiple book identification numbers are found on a page. Since the extension works across all websites to detect book information, it requires broad permissions including "Your data on all websites" and "Your tabs and browsing activity". 

This extension is an upgraded version of the original `Add to Goodreads` extension.
