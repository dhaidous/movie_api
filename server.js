const http = require('http'); // Import the HTTP module
const fs = require('fs'); // Import the File System module
const url = require('url'); // Import the URL module

// Create a server that listens on port 8080
const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true); // Parse the URL of the incoming request
    const path = parsedUrl.pathname; // Extract the pathname

    // Check if the URL contains the word "documentation"
    if (path.includes('documentation')) {
        fs.readFile('documentation.html', (err, data) => { // Read the 'documentation.html' file
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end('404 Not Found');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    } else {
        fs.readFile('index.html', (err, data) => { // Read the 'index.html' file
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end('404 Not Found');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    }

    // Log the request URL and timestamp
    const logEntry = `${new Date().toISOString()} - ${request.url}\n`; // Create a log entry
    fs.appendFile('log.txt', logEntry, (err) => { // Append the log entry to 'log.txt'
        if (err) {
            console.log('Error logging request:', err);
        }
    });
});

// Start the server and listen on port 8080
server.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});
