# 🛒 E-Commerce Microservice Backend

This project is a scalable **E-Commerce Backend** built using a **microservices architecture**. Each service is developed with best practices in mind, including modular patterns, proper validation, authentication, and secure communication. Technologies like **Express.js**, **MongoDB**, **RabbitMQ**, and **JWT** are used throughout the system.

---

## 🧱 Architecture Overview

### ⚙️ Architectural Patterns

- Microservice Architecture
- Controller-Service-Repository Pattern
- JWT Authentication & Authorization
- Asynchronous Messaging with RabbitMQ
- API Gateway for Centralized Routing

---

## 📁 Microservices

### 1. 🛡️ Auth Service

Handles user authentication and authorization.

**Endpoints:**

- `POST /register` – Create new user
- `POST /login` – Sign in
- `POST /logout` – Sign out
- `DELETE /deleteUser` – Remove user account
- `GET /getUser` – Fetch user details

**Features:**

- Uses `JWT` for access and refresh tokens
- Password hashing with `bcrypt`

---

### 2. 📦 Product Service

Handles all product-related operations.

- Add, update, delete, list products
- Product validation using `Joi`

---

### 3. 📬 Order Service

Handles customer order management.

- Create new orders
- View order history and details

---

### 4. 🚪 API Gateway

A central gateway to route requests to services.

- Forwards:
  - `/api/auth → Auth Service`
  - `/api/products → Product Service`
  - `/api/orders → Order Service`

---

## 📬 Message Queue with RabbitMQ

RabbitMQ is used for asynchronous service communication.

- Example Events:
  - Order creation
  - User account creation or deletion

This provides decoupling between services and ensures scalability.

---

## 🧰 Tech Stack

| Technology        | Description                           |
| ----------------- | ------------------------------------- |
| **Express.js**    | Web framework                         |
| **Mongoose**      | MongoDB ODM                           |
| **JWT**           | JSON Web Tokens for authentication    |
| **bcrypt**        | Password hashing                      |
| **RabbitMQ**      | Message queue for microservice events |
| **Joi**           | Data validation                       |
| **Helmet**        | Security HTTP headers                 |
| **dotenv**        | Environment configuration             |
| **cookie-parser** | Cookie support in Express             |

---

## 🚀 Getting Started

```bash
# Clone the project
git clone https://github.com/your-username/ecommerce-microservice.git

# Navigate to the root folder
cd ecommerce-microservice

# Copy environment variables
cp .env.example .env

# Install dependencies for each service
cd auth-service && npm install
cd ../product-service && npm install
cd ../order-service && npm install
cd ../gateway && npm install

# Start each service (in different terminals)
npm start


🔐 Authentication Flow
On register or login, server returns an accessToken and a refreshToken.

accessToken is used for protected routes.

When expired, a new access token can be generated using refreshToken.

Middleware decodes the token and sets req.user = decoded, allowing access to req.user.userId and req.user.role.

✅ Features
 JWT-based Authentication (Access + Refresh)

 Secure user registration & login

 Role-based Authorization

 Product CRUD operations

 Order management

 RabbitMQ-based service communication

 Controller → Service → Repository architecture

 Validation with Joi

 Secure headers with Helmet

 Centralized error handling

ecommerce-microservice/
│
├── auth-service/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   └── routes/
│
├── product-service/
├── order-service/
├── gateway/
└── README.md

👨‍💻 Developer
Özer Baykal
A developer with a background in physics and mathematics, transitioning into full-stack development and backend architecture. Passionate about building scalable systems and AI.

📫 GitHub: github.com/ozerbaykal

📌 To-Do (Optional)


 Add unit and integration tests

 Add Swagger API documentation

 Deploy services to Kubernetes / Docker Compose
```
