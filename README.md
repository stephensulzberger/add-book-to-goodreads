# Add Book to Goodreads

Google Chrome extension to add a book you are viewing to your Want to Read, Currently Reading or Read shelf on Goodreads.

The extension allows you to add a book to a shelf without leaving the page you are on. It is designed to work on individual product pages, and it works for popular sites such as Amazon, Google Books and many others.

## Installation and Usage

### Chrome Web Store

https://chrome.google.com/webstore/detail/add-book-to-goodreads/kecmjklilofklihnefffjgafcbjmbbbl

### Side load

1. Clone the repository to a local directory
2. Get a Goodreads API key from https://www.goodreads.com/api/keys
3. Set the Goodreads API key at `_GOODREADS_API_KEY`
4. Load the unpacked extension into Google Chrome. See https://developer.chrome.com/extensions/getstarted#manifest

## How It Works

This extension loads the "Add to My Books" widget (http://www.goodreads.com/api/atmb_widget) using an ISBN or ASIN number scraped from the current tab. The extension is not designed for pages with multiple book identification numbers, and it will simply choose the first valid book identification number that it detects on the page. Since the extension is not limited to a specific book site, it requires the "Your data on all websites" and "Your tabs and browsing activity" permissions.

This extension is an upgraded version of the original `Add to Goodreads` extension.
