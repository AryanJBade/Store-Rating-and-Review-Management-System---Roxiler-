# Database Design

## Users Table

| Column   | Type    |
| -------- | ------- |
| id       | INT     |
| name     | VARCHAR |
| email    | VARCHAR |
| password | VARCHAR |
| address  | TEXT    |
| role     | VARCHAR |

## Stores Table

| Column   | Type    |
| -------- | ------- |
| id       | INT     |
| name     | VARCHAR |
| email    | VARCHAR |
| address  | TEXT    |
| owner_id | INT     |

## Ratings Table

| Column     | Type      |
| ---------- | --------- |
| id         | INT       |
| user_id    | INT       |
| store_id   | INT       |
| rating     | INT       |
| created_at | TIMESTAMP |

## Relationships

Users (1) → (Many) Ratings

Stores (1) → (Many) Ratings

Store Owner (User) (1) → (Many) Stores
