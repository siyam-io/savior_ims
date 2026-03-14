
## API Documentation

The API is protected and most routes require a valid JSON Web Token (JWT) to be sent in the `Authorization` header as a Bearer token.

### Authentication

| Method | Endpoint         | Description          | Authentication |
| ------ | ---------------- | -------------------- | -------------- |
| POST   | `/api/auth/login`  | Login a user         | None           |
| POST   | `/api/auth/register`| Register a new user  | None           |
| GET    | `/api/auth/me`     | Get the current user | Bearer Token   |

### Users

All routes require `super-admin` or `vendor-admin` role.

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | `/api/users`      | Get all users    |
| GET    | `/api/users/:id`  | Get a user by ID |
| PUT    | `/api/users/:id`  | Update a user    |
| DELETE | `/api/users/:id`  | Delete a user (`super-admin` only) |

### Roles

All routes require `super-admin` role.

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| POST   | `/api/roles`    | Create a new role |
| GET    | `/api/roles`    | Get all roles  |
| GET    | `/api/roles/:id`| Get a role by ID |
| PUT    | `/api/roles/:id`| Update a role  |
| DELETE | `/api/roles/:id`| Delete a role  |

### Vendors

All routes require `super-admin` role.

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| POST   | `/api/vendors`    | Create a new vendor |
| GET    | `/api/vendors`    | Get all vendors  |
| GET    | `/api/vendors/:id`| Get a vendor by ID |
| PUT    | `/api/vendors/:id`| Update a vendor  |
| DELETE | `/api/vendors/:id`| Delete a vendor  |

### Categories

| Method | Endpoint           | Description          | Authentication |
| ------ | ------------------ | -------------------- | -------------- |
| POST   | `/api/categories`    | Create a new category| `super-admin`  |
| GET    | `/api/categories`    | Get all categories   | Bearer Token   |
| GET    | `/api/categories/:id`| Get a category by ID | Bearer Token   |
| PUT    | `/api/categories/:id`| Update a category    | `super-admin`  |
| DELETE | `/api/categories/:id`| Delete a category    | `super-admin`  |

### Sizes

| Method | Endpoint                     | Description           | Authentication |
| ------ | ---------------------------- | --------------------- | -------------- |
| POST   | `/api/sizes`                 | Create a new size     | `super-admin`  |
| GET    | `/api/sizes`                 | Get all sizes         | Bearer Token   |
| GET    | `/api/sizes/category/:categoryId` | Get sizes by category | Bearer Token   |
| GET    | `/api/sizes/:id`             | Get a size by ID      | Bearer Token   |
| PUT    | `/api/sizes/:id`             | Update a size         | `super-admin`  |
| DELETE | `/api/sizes/:id`             | Delete a size         | `super-admin`  |

### Products

| Method | Endpoint         | Description       | Authentication |
| ------ | ---------------- | ----------------- | -------------- |
| GET    | `/api/products`    | Get all products  | Bearer Token   |
| GET    | `/api/products/:id`| Get a product by ID| Bearer Token   |
| POST   | `/api/products`    | Create a new product| `super-admin` or `vendor-admin` |
| PUT    | `/api/products/:id`| Update a product  | `super-admin`, `vendor-admin`, or `staff` |
| DELETE | `/api/products/:id`| Delete a product  | `super-admin`  |

### Inventory

| Method | Endpoint              | Description               | Authentication |
| ------ | --------------------- | ------------------------- | -------------- |
| POST   | `/api/inventory`      | Create a new product inventory | Bearer Token   |
| GET    | `/api/inventory/:vendorId` | Get inventory for a vendor | Bearer Token   |
