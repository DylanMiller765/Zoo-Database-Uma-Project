# 🦁 Zoo Database Management System

## 📌 Team Project Overview

A comprehensive database management system for zoo operations including:

* 🐾 Animal management
* 👩‍💼 Employee tracking
* 🎟️ Ticket sales
* 🛍️ Gift shop inventory
* 🍔 Food services
* 💰 Revenue reporting

Built with **MySQL** and hosted on **Railway** for collaborative access.

---

## 🚀 Getting Started

### 1. Install MySQL Client

* **Windows:** Install [MySQL Community Server](https://dev.mysql.com/downloads/installer/)


---

### 2. Connect to the Shared Database

Use these credentials:

* **Host:** `nozomi.proxy.rlwy.net`
* **Port:** `43756`
* **User:** `root`
* **Password:** `tPLlbwDQnpriZFlWvJThTwkBStwJVmvc`
* **Database:** `zoo_database`

#### CLI (Command Line)

```bash
mysql -h nozomi.proxy.rlwy.net -P 43756 -u root -p zoo_database
```

(Enter password when prompted, or run `-ptPLlbwDQnpriZFlWvJThTwkBStwJVmvc` directly after `-p` if you want no prompt.)

#### MySQL Workbench / DBeaver (GUI)

* Host: `nozomi.proxy.rlwy.net`
* Port: `43756`
* Username: `root`
* Password: `tPLlbwDQnpriZFlWvJThTwkBStwJVmvc`
* Default Schema: `zoo_database`

---

### 3. Import Schema (if needed locally)

This has already been applied to Railway, but to re-import:

```bash
mysql -h nozomi.proxy.rlwy.net -P 43756 -u root -ptPLlbwDQnpriZFlWvJThTwkBStwJVmvc zoo_database < database/zoo_schema.sql
```

---

### 4. Export Database (for submission)

Generate the dump file for submission:

```bash
mysqldump -h nozomi.proxy.rlwy.net -P 43756 -u root -ptPLlbwDQnpriZFlWvJThTwkBStwJVmvc zoo_database > final_dump.sql
```

---

### 5. Verify Tables

Inside MySQL:

```sql
USE zoo_database;
SHOW TABLES;
```

You should see:
`animals, attractions, customers, employees, events, event_registrations, food_services, food_items, food_sales, food_sale_items, gift_shop_items, gift_shop_sales, habitats, tickets, daily_revenue_summary`.

---

## 👥 Team Workflow

* Schema updates → edit `database/zoo_schema.sql` in GitHub.
* Test queries, relationships, and constraints directly on the Railway DB.
* Before submission → run export command → commit `final_dump.sql` → email final copy.

---
