# Handmade Marketplace

A full-stack marketplace platform for buying and selling handmade products.

The application enables users to browse products, manage listings, leave reviews, complete purchases through Stripe-powered payments, and track orders through a unified buyer/seller experience.

Built with React, Express, PostgreSQL, Prisma ORM, and JWT authentication.

---

## Demo

> Screenshots, GIFs, and deployment link coming soon.

### Home Page

[Insert screenshot]

### Product Page

[Insert screenshot]

### Shopping Cart & Checkout

[Insert screenshot]

### User Profile

[Insert screenshot]

### Admin Panel

[Insert screenshot]

---

## Features

### Public Access

Visitors can browse the platform without creating an account.

* Browse all publicly listed handmade products
* Explore categories
* View seller profiles and catalogs
* Search products, users, and categories
* Dynamic search suggestions while typing
* Dedicated search results page
* View product ratings and reviews
* Discover newly listed products

### User Accounts

Registered users can act as both buyers and sellers.

* Secure registration and login
* JWT-based authentication
* Profile customization
* Profile picture uploads
* Bio editing
* Favorites management
* Product management
* Review management

### Product Listings

Users can create and manage their own products.

* Create listings
* Edit existing products
* Upload multiple product images
* Assign categories
* Configure pickup and delivery options
* Set pricing and descriptions

### Shopping Experience

* Add products to favorites
* Add products to cart
* Adjust quantities directly from the cart
* Remove products from cart
* Checkout workflow with order summary
* Shipping address management

### Payments

* Stripe Checkout integration
* Secure payment processing
* Payment status tracking
* Automatic order creation after successful payment

### Orders

Users can manage both purchases and sales.

* Purchase history
* Sales history
* Order status tracking
* Delivery confirmation
* Payment status visibility
* Multi-seller order support

### Reviews & Ratings

* Product ratings
* Written reviews
* Average rating calculation
* User review history

### Administration

Administrators have access to moderation tools.

* User moderation
* Product moderation
* Review moderation
* Marketplace management

---

## Search System

The platform includes a real-time search experience.

### Live Suggestions

Search suggestions appear automatically when entering at least two characters.

### Search Results

Results are grouped into three categories:

* Products
* Users
* Categories

Users can navigate directly to the corresponding pages from the search results.

---

## Technology Stack

### Frontend

* React
* React Router
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* REST API

### Database

* PostgreSQL
* Prisma ORM

### Payments

* Stripe Checkout

### Storage

* Image Upload Support

---

## Architecture

The application follows a client-server architecture:

```text
React + Vite Frontend
          │
          ▼
      REST API
          │
          ▼
 Express.js Backend
          │
          ▼
      Prisma ORM
          │
          ▼
     PostgreSQL
```

Authentication is handled through JSON Web Tokens (JWT), while Stripe Checkout is used for secure payment processing.

---

## Database Design

The marketplace is built on a relational PostgreSQL database managed through Prisma ORM.

Core entities include:

* User
* Item
* Category
* Favorite
* Review
* Cart
* CartItem
* Order
* OrderItem
* ShippingAddress
* Payment

Key design considerations include:

* Historical purchase price preservation
* Multi-seller order support
* User favorites
* Product reviews
* Cart persistence
* Shipping address management
* Payment tracking
* Database-level integrity constraints

### Entity Relationship Diagram

[Insert ER Diagram]

---

## Notable Implementations

### Real-Time Search

A dynamic search bar provides instant suggestions while typing and redirects users to a dedicated results page for comprehensive searching.

### Multi-Seller Checkout

When products from multiple sellers are purchased in a single checkout session, separate orders are automatically generated for each seller.

### Historical Purchase Records

Order items store purchase-time pricing information to preserve accurate transaction history even if product prices change later.

### Role-Based Access Control

The application supports standard users and administrators, with dedicated moderation tools available only to administrators.

---

## Future Improvements

Potential future enhancements include:

* Product recommendations
* Advanced filtering and sorting
* Seller analytics
* Messaging system
* Email notifications
* Inventory tracking
* CI/CD pipeline
* Cloud deployment
* Automated testing

---

## Learning Outcomes

This project provided practical experience with:

* Full-stack web development
* REST API design
* Authentication and authorization
* Relational database modeling
* Payment processing
* File uploads
* State management
* Search implementation
* E-commerce workflows
* Database schema design

---

## Author

**Petar Milojević**

Computer Science & Software Engineering Student

Faculty of Engineering Sciences, University of Kragujevac
