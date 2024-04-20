![image](https://github.com/IAStudentAnalytics/backend_ISA/assets/116560510/f689f08f-9f92-45cf-b926-835fe3efd944)# Node.js Template

This repository serves as a template for building a Node.js application. It provides a structured foundation with essential features, frameworks, and tools.

## Features

- **Express.js Backend:** Utilizes Express.js for handling routes, requests, and responses.
- **MongoDB Integration:** Optional MongoDB integration for seamless data persistence.
- **RESTful API:** Follows RESTful principles for a scalable and maintainable architecture.
- **File Uploads with Multer:** Integrates Multer middleware for handling file uploads.
- **Error Handling Middleware:** Implements middleware functions for graceful error management.
- **Cloudinary Integration:** Utilizes Cloudinary for managing and serving uploaded files with ease.

## Usage

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/IAStudentAnalytics/backend_ISA.git
   cd backend_ISA
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Set up environment variables as needed, e.g., MongoDB connection details.

4. **Run the Application:**
   ```bash
  node server.js
   ```

   This command starts the development server using Nodemon for automatic reloading.

5. **Access the Application:**
   - Use [Postman](https://www.postman.com/) or any API testing tool to interact with the application.
   - Base URL: [http://localhost:9090](http://localhost:9090)

## Sample Endpoints:

**Create Compilateur:**
URL: http://localhost:9090/compilateur_run-code
Method: POST
Body: JSON 

**GET TestBlanc:**
URL: http://localhost:9090/testblanc/test
Method: GET

**GET Test by ID:**
URL: http://localhost:9090/tests/:id
Method: GET

**Update a Test by ID:**
URL: http://localhost:9090/tests/:id
Method: PUT
Body: JSON payload with updated test details

**Delete a Test by ID:**
URL: http://localhost:9090/tests/:id
Method: DELETE



Wishing you the best of luck !
