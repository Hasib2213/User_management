-- Users Table (simplified, actual from migrations)
CREATE TABLE core_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP,
    is_superuser BOOLEAN NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    is_staff BOOLEAN NOT NULL,
    is_active BOOLEAN NOT NULL,
    date_joined TIMESTAMP NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(10) NOT NULL,
    status VARCHAR(10) NOT NULL,
    email_verified BOOLEAN NOT NULL,
    verification_token VARCHAR(100),
    reset_token VARCHAR(100)
);

-- Activity Logs Table
CREATE TABLE core_activitylog (
    id SERIAL PRIMARY KEY,
    activity TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES core_user(id) ON DELETE CASCADE
);