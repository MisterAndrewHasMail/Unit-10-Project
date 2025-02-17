
const API_URL = 'http://localhost:5000/api'

export const api = (path, method = 'GET', body = null, credentials = null) => {
	const url = `${API_URL}${path}` // Construct full URL by appending path to API base URL

	const options = {
		method: method, // HTTP method (default is GET)
		headers: {} // Initialize headers object
	}

	// Include request body for POST, PUT, PATCH methods
	if (body) {
		options.body = JSON.stringify(body) // Convert body to JSON string
		options.headers['Content-Type'] = 'application/json; charset=utf-8' // Set content type header
	}

	// Include credentials for basic authentication
	if (credentials) {
		const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`) // Encode credentials to Base64
		options.headers.Authorization = `Basic ${encodedCredentials}` // Set Authorization header
	}

	return fetch(url, options) // Perform fetch request and return the Promise
}
