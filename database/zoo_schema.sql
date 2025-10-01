-- Zoo Database Schema
-- Team Project Database Design

-- Use Railway's default database so it shows up in the dashboard
USE railway;

-- Employees Table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    hire_date DATE,
    job_title VARCHAR(50),
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Attractions Table
CREATE TABLE attractions (
    attraction_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    capacity INT,
    opening_time TIME,
    closing_time TIME,
    ticket_price DECIMAL(8, 2),
    status ENUM('open', 'closed', 'maintenance') DEFAULT 'open'
);

-- Habitats Table
CREATE TABLE habitats (
    habitat_id INT PRIMARY KEY AUTO_INCREMENT,
    habitat_name VARCHAR(100) NOT NULL,
    attraction_id INT,
    habitat_type VARCHAR(50),
    size VARCHAR(50),
    environment_type VARCHAR(50),
    temperature_range VARCHAR(50),
    capacity INT DEFAULT 10,
    features TEXT,
    cleaning_schedule VARCHAR(100),
    last_maintenance DATE,
    status ENUM('active', 'maintenance', 'renovation', 'closed') DEFAULT 'active',
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attraction_id) REFERENCES attractions(attraction_id)
);

-- Animals Table
CREATE TABLE animals (
    animal_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    date_of_birth DATE,
    arrival_date DATE,
    gender ENUM('male', 'female', 'unknown'),
    habitat VARCHAR(100),
    habitat_id INT,
    diet_type VARCHAR(50),
    medical_notes TEXT,
    status ENUM('active', 'transferred', 'deceased') DEFAULT 'active',
    keeper_id INT,
    FOREIGN KEY (keeper_id) REFERENCES employees(employee_id),
    FOREIGN KEY (habitat_id) REFERENCES habitats(habitat_id)
);

-- Customers Table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    membership_type ENUM('none', 'bronze', 'silver', 'gold') DEFAULT 'none',
    registration_date DATE
);

-- Tickets Table
CREATE TABLE tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    visit_date DATE,
    ticket_type ENUM('adult', 'child', 'senior', 'student') NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    payment_method ENUM('cash', 'credit', 'debit', 'online'),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Gift Shop Items Table
CREATE TABLE gift_shop_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(8, 2) NOT NULL,
    cost DECIMAL(8, 2),
    quantity_in_stock INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    supplier VARCHAR(100)
);

-- Gift Shop Sales Table
CREATE TABLE gift_shop_sales (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    item_id INT,
    quantity INT NOT NULL,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'credit', 'debit'),
    employee_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (item_id) REFERENCES gift_shop_items(item_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Food Services Table
CREATE TABLE food_services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    type ENUM('restaurant', 'snack_bar', 'kiosk', 'vending'),
    opening_time TIME,
    closing_time TIME,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

-- Food Items Table
CREATE TABLE food_items (
    food_item_id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(8, 2) NOT NULL,
    cost DECIMAL(8, 2),
    calories INT,
    allergens VARCHAR(200),
    available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (service_id) REFERENCES food_services(service_id)
);

-- Food Sales Table
CREATE TABLE food_sales (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    service_id INT,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'credit', 'debit'),
    employee_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (service_id) REFERENCES food_services(service_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Food Sale Items Table
CREATE TABLE food_sale_items (
    sale_item_id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT,
    food_item_id INT,
    quantity INT NOT NULL,
    subtotal DECIMAL(8, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES food_sales(sale_id),
    FOREIGN KEY (food_item_id) REFERENCES food_items(food_item_id)
);

-- Events Table
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(100),
    max_participants INT,
    ticket_price DECIMAL(8, 2),
    coordinator_id INT,
    FOREIGN KEY (coordinator_id) REFERENCES employees(employee_id)
);

-- Event Registrations Table
CREATE TABLE event_registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    customer_id INT,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    number_of_participants INT DEFAULT 1,
    total_amount DECIMAL(10, 2),
    payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Daily Revenue Summary View
CREATE VIEW daily_revenue_summary AS
SELECT 
    DATE(t.purchase_date) as date,
    SUM(t.price) as ticket_revenue,
    (SELECT SUM(total_amount) FROM gift_shop_sales WHERE DATE(sale_date) = DATE(t.purchase_date)) as gift_shop_revenue,
    (SELECT SUM(total_amount) FROM food_sales WHERE DATE(sale_date) = DATE(t.purchase_date)) as food_revenue
FROM tickets t
GROUP BY DATE(t.purchase_date);

-- Indexes
CREATE INDEX idx_ticket_date ON tickets(visit_date);
CREATE INDEX idx_animal_species ON animals(species);
CREATE INDEX idx_customer_email ON customers(email);
CREATE INDEX idx_gift_sale_date ON gift_shop_sales(sale_date);
CREATE INDEX idx_food_sale_date ON food_sales(sale_date);
