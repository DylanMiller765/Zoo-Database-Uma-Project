const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zoo_database'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// ===== ANIMAL ROUTES =====
// Get all animals
app.get('/api/animals', (req, res) => {
  const query = `
    SELECT a.*, e.first_name as keeper_first_name, e.last_name as keeper_last_name 
    FROM animals a 
    LEFT JOIN employees e ON a.keeper_id = e.employee_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get single animal
app.get('/api/animals/:id', (req, res) => {
  const query = `
    SELECT a.*, e.first_name as keeper_first_name, e.last_name as keeper_last_name 
    FROM animals a 
    LEFT JOIN employees e ON a.keeper_id = e.employee_id 
    WHERE a.animal_id = ?
  `;
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Animal not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Add new animal
app.post('/api/animals', (req, res) => {
  const { name, species, breed, date_of_birth, arrival_date, gender, habitat, diet_type, medical_notes, keeper_id } = req.body;
  const query = `
    INSERT INTO animals (name, species, breed, date_of_birth, arrival_date, gender, habitat, diet_type, medical_notes, keeper_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name, species, breed, date_of_birth, arrival_date, gender, habitat, diet_type, medical_notes, keeper_id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, message: 'Animal added successfully' });
  });
});

// Update animal
app.put('/api/animals/:id', (req, res) => {
  const { name, species, breed, date_of_birth, arrival_date, gender, habitat, diet_type, medical_notes, status, keeper_id } = req.body;
  const query = `
    UPDATE animals 
    SET name = ?, species = ?, breed = ?, date_of_birth = ?, arrival_date = ?, 
        gender = ?, habitat = ?, diet_type = ?, medical_notes = ?, status = ?, keeper_id = ?
    WHERE animal_id = ?
  `;
  db.query(query, [name, species, breed, date_of_birth, arrival_date, gender, habitat, diet_type, medical_notes, status, keeper_id, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Animal not found' });
      return;
    }
    res.json({ message: 'Animal updated successfully' });
  });
});

// Delete animal
app.delete('/api/animals/:id', (req, res) => {
  const query = 'DELETE FROM animals WHERE animal_id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Animal not found' });
      return;
    }
    res.json({ message: 'Animal deleted successfully' });
  });
});

// ===== EMPLOYEE ROUTES =====
// Get all employees
app.get('/api/employees', (req, res) => {
  const query = 'SELECT * FROM employees';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Add new employee
app.post('/api/employees', (req, res) => {
  const { first_name, last_name, email, phone, hire_date, job_title, department, salary } = req.body;
  const query = `
    INSERT INTO employees (first_name, last_name, email, phone, hire_date, job_title, department, salary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [first_name, last_name, email, phone, hire_date, job_title, department, salary], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, message: 'Employee added successfully' });
  });
});

// ===== TICKET ROUTES =====
// Get all tickets
app.get('/api/tickets', (req, res) => {
  const query = `
    SELECT t.*, c.first_name, c.last_name, c.email 
    FROM tickets t 
    LEFT JOIN customers c ON t.customer_id = c.customer_id
    ORDER BY t.purchase_date DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Book new ticket
app.post('/api/tickets', (req, res) => {
  const { customer_id, visit_date, ticket_type, price, payment_method } = req.body;
  const query = `
    INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [customer_id, visit_date, ticket_type, price, payment_method], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, message: 'Ticket booked successfully' });
  });
});

// ===== GIFT SHOP ROUTES =====
// Get all gift shop items
app.get('/api/gift-shop/items', (req, res) => {
  const query = 'SELECT * FROM gift_shop_items';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Process gift shop sale
app.post('/api/gift-shop/sale', (req, res) => {
  const { customer_id, item_id, quantity, total_amount, payment_method, employee_id } = req.body;
  
  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Insert sale record
    const saleQuery = `
      INSERT INTO gift_shop_sales (customer_id, item_id, quantity, total_amount, payment_method, employee_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(saleQuery, [customer_id, item_id, quantity, total_amount, payment_method, employee_id], (err, result) => {
      if (err) {
        db.rollback();
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Update inventory
      const updateQuery = 'UPDATE gift_shop_items SET quantity_in_stock = quantity_in_stock - ? WHERE item_id = ?';
      db.query(updateQuery, [quantity, item_id], (err, result) => {
        if (err) {
          db.rollback();
          res.status(500).json({ error: err.message });
          return;
        }
        
        db.commit((err) => {
          if (err) {
            db.rollback();
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(201).json({ message: 'Sale processed successfully' });
        });
      });
    });
  });
});

// ===== CUSTOMER ROUTES =====
// Get all customers
app.get('/api/customers', (req, res) => {
  const query = 'SELECT * FROM customers';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Add new customer
app.post('/api/customers', (req, res) => {
  const { first_name, last_name, email, phone, address, city, state, zip_code, membership_type } = req.body;
  const query = `
    INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, membership_type, registration_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
  `;
  db.query(query, [first_name, last_name, email, phone, address, city, state, zip_code, membership_type], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: result.insertId, message: 'Customer added successfully' });
  });
});

// ===== REVENUE REPORTS =====
// Get daily revenue
app.get('/api/reports/revenue/daily', (req, res) => {
  const { date } = req.query;
  const query = `
    SELECT 
      (SELECT SUM(price) FROM tickets WHERE DATE(purchase_date) = ?) as ticket_revenue,
      (SELECT SUM(total_amount) FROM gift_shop_sales WHERE DATE(sale_date) = ?) as gift_shop_revenue,
      (SELECT SUM(total_amount) FROM food_sales WHERE DATE(sale_date) = ?) as food_revenue
  `;
  db.query(query, [date, date, date], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
});

// Get monthly revenue
app.get('/api/reports/revenue/monthly', (req, res) => {
  const { year, month } = req.query;
  const query = `
    SELECT 
      (SELECT SUM(price) FROM tickets WHERE YEAR(purchase_date) = ? AND MONTH(purchase_date) = ?) as ticket_revenue,
      (SELECT SUM(total_amount) FROM gift_shop_sales WHERE YEAR(sale_date) = ? AND MONTH(sale_date) = ?) as gift_shop_revenue,
      (SELECT SUM(total_amount) FROM food_sales WHERE YEAR(sale_date) = ? AND MONTH(sale_date) = ?) as food_revenue
  `;
  db.query(query, [year, month, year, month, year, month], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});