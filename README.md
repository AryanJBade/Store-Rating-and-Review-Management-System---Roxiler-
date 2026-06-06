# Store Rating Platform

A full-stack web application built using React.js, Node.js, Express.js, and MySQL that allows users to submit ratings for stores.

## Features

### System Administrator

* Login securely using JWT authentication
* View dashboard statistics
* Create users (Admin, Store Owner, User)
* Create stores
* View users and stores

### Normal User

* Signup and Login
* Search stores
* Submit ratings (1–5)
* Update ratings

### Store Owner

* Login
* View store ratings
* View users who rated stores
* View average rating

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

### Database

* MySQL

## Installation

### Backend

npm install

Create .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating_db
JWT_SECRET=your_secret

npm run dev

### Frontend

npm install
npm run dev

## Roles

* ADMIN
* STORE_OWNER
* USER
