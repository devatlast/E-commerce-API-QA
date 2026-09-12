E-Commerce Backend API

A RESTful e-commerce backend API built with Node.js, Express.js, and PostgreSQL. The project provides user authentication, role-based authorization, product management, shopping cart functionality, and order processing.

The API was developed as a backend portfolio project with a focus on REST API development, authentication, database relationships, API testing, and automated testing workflows.

🚀 Features

* User registration and login
* JWT-based authentication
* Role-based authorization
* User profile retrieval
* Admin-only user management
* Product management
* Shopping cart functionality
* Order creation and management
* Automatic cart clearing after order creation
* PostgreSQL relational database
* Protected API routes
* Unauthorized-access handling
* API testing with Postman and Bruno
* API testing with Playwright
* Bash/cURL endpoint testing
* Docker and Docker Compose support
* GitHub Actions CI workflow

🛠️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT
* pg
* Playwright
* Postman
* Bruno
* cURL / Bash
* Docker
* GitHub Actions

📁 Project Structure

e-commerce-api/
│
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
│
├── middleware/
│   └── auth.js
│
├── tests/
│   └── playwright/
│       ├── admin/
│       ├── user/
│       └── unauthorized/
│
├── scripts/
│   └── API testing scripts
│
├── db.js
├── server.js
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md

Folder names may vary depending on the current version of the project.

🔐 Authentication

Authentication is handled using JSON Web Tokens (JWT).

Users can register and log in to receive an authentication token.

Protected endpoints require the token in the request header:

Authorization: Bearer YOUR_TOKEN

The API also supports role-based access control.

User

Regular users can:

* View their profile
* Manage their cart
* View available products
* Create orders
* Access their authorized resources

Admin

Administrators have additional privileges, including:

* Viewing all users
* Managing products
* Accessing admin-protected endpoints

📌 API Endpoints

Authentication

Method	Endpoint	Description	Authentication
POST	/auth/register	Create a new account	Public
POST	/auth/login	Log in and receive JWT	Public

Users

Method	Endpoint	Description	Authentication
GET	/users/me	Get logged-in user’s profile	User
GET	/users	Get all users	Admin

Products

Method	Endpoint	Description	Authentication
GET	/products	Get all products	Public
GET	/products/:id	Get a product by ID	Public
POST	/products	Create a product	Admin
PUT	/products/:id	Update a product	Admin
DELETE	/products/:id	Delete a product	Admin

Cart

Method	Endpoint	Description	Authentication
GET	/cart	Get current user’s cart	User
POST	/cart	Add item to cart	User
PUT	/cart/:id	Update cart item	User
DELETE	/cart/:id	Remove cart item	User

Orders

Method	Endpoint	Description	Authentication
POST	/orders	Create an order	User
GET	/orders	Get user’s orders	User
GET	/orders/:id	Get a specific order	User
PUT	/orders/:id/status	Update order status	Admin

Endpoint names should be adjusted if your current route files use slightly different paths.

🗄️ Database

The application uses PostgreSQL as its relational database.

The database contains relationships between users, products, carts, orders, and order items.

A simplified structure looks like:

Users
 │
 ├── Cart
 │     └── Cart Items
 │           └── Products
 │
 └── Orders
       └── Order Items
             └── Products

This allows the API to demonstrate real relational database operations such as:

* Foreign keys
* JOINs
* INSERT
* UPDATE
* DELETE
* Filtering
* Relational queries

⚙️ Installation

1. Clone the repository

git clone YOUR_REPOSITORY_URL
cd e-commerce-api

2. Install dependencies

npm install

3. Create environment variables

Create a .env file in the project root:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret

Do not commit your .env file to GitHub.

4. Start the server

For development:

npm run dev

Or:

node server.js

The API should be available at:

http://localhost:3000

🐳 Running With Docker

The project can also be run using Docker and Docker Compose.

Build and start the containers:

docker compose up --build

To run in the background:

docker compose up -d --build

Stop the containers:

docker compose down

🧪 API Testing

The API was tested using multiple tools to verify both successful requests and failure scenarios.

Postman

Postman was used for:

* Registration
* Login
* JWT authentication
* User endpoints
* Admin endpoints
* Product CRUD
* Cart operations
* Order creation
* Unauthorized requests

Bruno

Bruno was used to maintain API request collections and test endpoints locally.

cURL / Bash

Endpoints were also tested from the terminal using cURL and Bash scripts.

Example:

curl http://localhost:3000/products

Authenticated request:

curl http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"

Playwright

Playwright is used for automated API testing.

The tests cover areas such as:

tests/
└── playwright/

This allows authenticated user, admin, and unauthorized-access scenarios to be tested separately.

Run the Playwright tests with:

npx playwright test

🔄 CI/CD

GitHub Actions is configured to automatically run project checks/tests when changes are pushed to the repository.

This helps ensure that changes to the API do not introduce regressions.

🔒 Security

The project implements several basic backend security practices:
* JWT authentication
* Protected routes
* Role-based authorization
* Environment variables for secrets
* Unauthorized-access handling
* Input validation/error handling

This project is intended for learning and portfolio purposes and would require additional security hardening before being used in a production e-commerce environment.

📚 What I Practiced

This project helped me gain practical experience with:

* Building REST APIs with Express
* Designing PostgreSQL relationships
* Writing SQL queries
* Working with foreign keys
* JWT authentication
* Role-based access control
* Password hashing
* Middleware
* Error handling
* CRUD operations
* Shopping cart logic
* Order processing
* API testing
* Automated API testing
* Bash/cURL
* Docker
* Git/GitHub
* GitHub Actions

🎯 Project Goals

The main goal of this project was to build a realistic backend application rather than a simple CRUD API.

The project combines authentication, authorization, relational database operations, business logic, API testing, and automated testing into one application.

👨‍💻 Author

Emmanuel

Backend/API Developer & QA-focused Developer

Technologies

JavaScript
Node.js
Express.js
PostgreSQL
JWT
Playwright
Postman
Bruno
Docker
GitHub Actions
Bash
cURL

📄 License

This project is available for educational and portfolio purposes