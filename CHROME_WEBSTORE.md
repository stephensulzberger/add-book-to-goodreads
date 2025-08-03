# Chrome Web Store Listing

This file contains the description and metadata for the Chrome Web Store listing.

## App Name
Add Book to Goodreads

## Short Description (Single Purpose Description)

Detects books on web pages and provides quick access to add them to your Goodreads shelves.

## Detailed Description

This is a Chrome extension that detects books on web pages and provides quick access to add them to your Goodreads shelves. It works on book-related pages across the web, including Amazon, Google Books, publisher sites, and many others.

Since the extension works across all websites to detect book information, it requires broad permissions including "Your data on all websites" and "Your tabs and browsing activity".

Code available at: https://github.com/stephensulzberger/add-book-to-goodreads

## ActiveTab Justification 

Requires the activeTab permission in order to search the current page for a valid ISBN or ASIN

## Scription Justification

This extension detects book IDs (ISBN/ASIN) on web pages to help add books to Goodreads shelves. It requires broad access to:

1. Universal Detection: Works across all sites where books are displayed (Amazon, Google Books, publisher sites, etc.).
2. Content Analysis: Scans pages for ISBN-10, ISBN-13, and ASIN numbers.
3. Dynamic Support: Reads fully rendered pages to detect dynamically loaded content.

Data Usage:

- Only reads page content to extract book IDs.
- No personal data collected, stored, or shared.
- Book IDs sent only to Goodreads API for details.
- No browsing history or personal info retained.

The extension operates locally and only communicates with Goodreads’ public API to display book info.

## Host Permission Justification

The extension is not limited to a single book site, so it needs permission to access all sites.

## Remote Code Justification

This extension loads the "Add to My Books" widget (http://www.goodreads.com/api/atmb_widget) using an iFrame, which subsequently loads HTML, CSS and Javascript.