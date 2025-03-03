# WINA - Privileged Access Management (PAM) System

## Overview

WINA is a **Privileged Access Management (PAM)** application designed to provide secure and controlled access to critical systems. It features a web-based frontend built with **Angular Material** and integrates **Apache Guacamole** for remote session management. The backend is powered by **Java Spring**, ensuring robust security and scalability.

## Features

- **Secure Privileged Access**: Manage and control privileged user sessions.
- **Angular Material Frontend**: Modern UI with a responsive design.
- **Remote Access via Guacamole**: Browser-based RDP, SSH, Telnet and VNC support.
- **Spring Boot Backend**: Secure and scalable server-side logic.
- **Audit & Logging**: Tracks user activities for compliance.
- **Role-Based Access Control (RBAC)**: Granular permissions for users and admins.

## Technologies Used

### Frontend:

- Angular with Material UI
- Guacamole.js for remote access

### Backend:

- Java Spring Boot
- Spring Security for authentication & authorization
- Hibernate & PostgreSQL/MySQL (or any other DBMS)

## Installation

### Prerequisites

- **Node.js** & **Angular CLI** (for frontend)
- **Java 17+** & **Maven** (for backend)
- **Apache Guacamole Server** (for remote session handling)
- **Database (PostgreSQL/MySQL)**

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://gitlab.phoenix.mahsan.net/wina/core.git
   ```
2. Configure the `application.properties` file:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/wina_db
   spring.datasource.username=your_db_user
   spring.datasource.password=your_db_password
   ```
3. Build and run the server:
   ```bash
   mvn clean install
   java -jar target/wina.jar
   ```

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone ssh://git@gitlab.phoenix.mahsan.net:11022/wina/Front.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   ng serve
   ```

## Usage

- Access the frontend via `http://localhost:4200`
- Login using admin credentials
- Manage privileged sessions and monitor activity logs

## API Endpoints

| Method | Endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| `POST` | `/api/auth/login` | User authentication         |
| `GET`  | `/api/users`      | Retrieve user list          |
| `POST` | `/api/sessions`   | Create a privileged session |
| `GET`  | `/api/logs`       | Fetch system logs           |

## Contribution

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Contact

For any inquiries or support, contact **your.email@example.com**.
