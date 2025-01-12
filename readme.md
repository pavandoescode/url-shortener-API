# URL Shortener API Documentation

## Base URL
- Base URL: `http://yourdomain.com`

## Endpoints

### Create Shortened URL
- **URL:** `/`
- **Method:** `POST`
- **Description:** Create a new shortened URL.
- **Request Body:**
    ```json
    {
      "url": "https://www.example.com",
      "alias": "customAlias", // Optional Data
      "expirationDate": "2024-12-31" // Optional Data
    }
    ```
- **Response:**
    ```json
    {
      "id": "generatedShortID"
    }
    ```

### Retrieve Detailed Analytics
- **URL:** `/analytics/:shortId`
- **Method:** `GET`
- **Description:** Retrieve detailed analytics for a specific short URL.
- **Response:**
    ```json
    {
      "totalClicks": 5,
      "analytics": [
        {
          "timestamp": "2024-01-05T08:00:00Z",
          "userAgent": "Mozilla/5.0 ...",
          "ipAddress": "127.0.0.1"
        },
        // Optional Data
      ],
      "expirationDate": "2024-12-31"
     
    }
    ```

### Redirect to Original URL
- **URL:** `/:id`
- **Method:** `GET`
- **Description:** Redirect to the original URL based on the short ID.

---

## Error Responses
- **400 Bad Request:**
    - Returned if the provided URL is invalid or an alias already exists.
    ```json
    {
      "error": "Error message here"
    }
    ```

- **404 Not Found:**
    - Returned if the specified short URL does not exist.
    ```json
    {
      "error": "URL does not exist"
    }
    ```

- **500 Internal Server Error:**
    - Returned for unexpected server errors.
    ```json
    {
      "error": "Internal Server Error"
    }
    ```
