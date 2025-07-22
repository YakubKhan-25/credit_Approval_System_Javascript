# Credit Approval System Javascript (Monolithic)

A Node.js and MongoDB-based backend for managing customer registrations, loan applications, and credit approval logic. This project provides RESTful APIs for registering customers, checking loan eligibility, and managing loans.

## Features

- Register new customers with personal and financial details
- Check loan eligibility based on customer data and credit logic
- Create and manage loans for customers
- View loans by customer or by loan ID

## Tech Stack

- Node.js (Express)
- MongoDB (via Mongoose)
- Docker & Docker Compose

---

## Getting Started

### 1. Clone the Repository

### Enter into backend

cd credit_approval_monolithic/backend
```

### 2. Set Up Environment Variables

Create a `.env` file in the `backend/` directory with the following content:

```
MONGO_URI=<your_mongodb_connection_string>
BACKEND_PORT=<your_desired_port>
```

- Example for local MongoDB:
  ```
  MONGO_URI=mongodb://localhost:27017/creditapprovalmono
  BACKEND_PORT=3000
  ```
- If using Docker Compose, these are set automatically.


### 3. Run with Docker (Recommended)

Make sure you have Docker and Docker Compose installed.

```sh
docker-compose up -d --build
```

- The backend will be available at `http://localhost:3000`
- MongoDB will be available at `localhost:27017` (inside Docker network as `mongo_db:27017`)

---

## API Endpoints

### Customer APIs

- `POST /api/v1/auth/register`  
  Register a new customer.

### Loan APIs

- `POST /api/v1/loan/check-eligibility`  
  Check loan eligibility for a customer.

- `POST /api/v1/loan/create-loan`  
  Create a new loan for a customer.

- `GET /api/v1/loan/view-loan/:loan_id`  
  View a specific loan by loan ID.

- `GET /api/v1/loan/view-loans/:customer_id`  
  View all loans for a specific customer.

---

## Inspecting MongoDB Data in Docker

To view actual data in your MongoDB Docker container:

1. List running containers to find your MongoDB container name:
   ```sh
   docker ps
   ```
2. Access the MongoDB shell inside the container:
   ```sh
   docker exec -it <your_mongo_container_name> mongosh
   ```
3. Switch to your database:
   ```js
   use creditapprovalmono (database_name)
   ```
4. Show collections:
   ```js
   show collections
   ```
5. View data in a collection (e.g., customers):
   ```js
   db.customers.find()
   ```

---

## Credentials & Configuration

- Replace `<your_mongodb_connection_string>` and `<your_desired_port>` in `.env` with your actual values.
- For Docker Compose, credentials are set in `docker-compose.yml` and do not need to be changed unless you want to customize them.

---

## License

ISC

### Backend

Go to the `backend` directory and run the project with a single Docker command:

```bash
docker-compose up -d

To stop the running project, use the following command:

docker-compose down

