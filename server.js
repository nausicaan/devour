const express = require('express');
const app = express();

// Redirect HTTP to HTTPS,
// app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));
// app.use(express.static('../private'));
// This serves static files from the specified directory
app.use(express.static('../devour', {
	etag: true, // Just being explicit about the default.
	lastModified: true,  // Just being explicit about the default.
	setHeaders: (res, path) => {
	  const hashRegExp = new RegExp('\\.[0-9a-f]{8}\\.');

	  if (path.endsWith('.html')) {
		 // All of the project's HTML files end in .html
		 res.setHeader('Cache-Control', 'no-cache');
	  	} else if (path.endsWith('.jpg')) {
		// All of the project's HTML files end in .html
		res.setHeader('Cache-Control', 'max-age=31536000');
	 	} else if (hashRegExp.test(path)) {
		 // If the RegExp matched, then we have a versioned URL.
		 res.setHeader('Cache-Control', 'max-age=31536000');
	  	}
	},
}));

const server = app.listen(8081, () => {

	const host = server.address().address;
	const port = server.address().port;

	console.log('App listening at http://%s:%s', host, port);
});