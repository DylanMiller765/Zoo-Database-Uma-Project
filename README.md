# Zoo Database Management System

## Team Project Overview
A comprehensive database management system for zoo operations including animal management, employee tracking, ticket sales, gift shop inventory, food services, and revenue reporting.

## Technology Stack
- **Frontend:** React (JavaScript)
- **Backend:** Node.js with Express
- **Database:** MySQL
- **Additional:** jQuery for DOM manipulation

## Project Structure
```
zoo-database/
├── frontend/          # React application
├── backend/           # Node.js Express API
├── database/          # SQL schemas and scripts
└── docs/             # Documentation and task tracking
```

## Team Task Assignment

### Database Team (2 members)
- [ ] Set up MySQL database server
- [ ] Create all database tables using schema
- [ ] Create stored procedures for reports
- [ ] Implement data validation triggers
- [ ] Create sample data for testing
- [ ] Document database relationships

### Backend Team (2 members)
- [ ] Set up Express server
- [ ] Create API endpoints for animals
- [ ] Create API endpoints for employees
- [ ] Create API endpoints for tickets
- [ ] Create API endpoints for gift shop
- [ ] Create API endpoints for food services
- [ ] Implement revenue reporting endpoints
- [ ] Add authentication/authorization

### Frontend Team (2-3 members)
- [ ] Design main dashboard layout
- [ ] Create animal management interface
- [ ] Build employee management pages
- [ ] Develop ticket booking system
- [ ] Create gift shop POS interface
- [ ] Build food service management
- [ ] Implement reporting dashboard
- [ ] Add customer management interface

### Testing & Documentation (1-2 members)
- [ ] Write API documentation
- [ ] Create user manual
- [ ] Test all API endpoints
- [ ] Test UI functionality
- [ ] Performance testing
- [ ] Create presentation materials

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git for version control

### Database Setup
1. Install MySQL Server
2. Create database using schema:
   ```sql
   mysql -u root -p < database/zoo_schema.sql
   ```

### Backend Setup
```bash
cd backend
npm install
# Create .env file with database credentials
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Features to Implement

### Core Features (Must Have)
1. **Animal Management**
   - Add/Edit/Delete animals
   - Track medical records
   - Assign keepers

2. **Employee Management**
   - Staff records
   - Schedule management
   - Department assignments

3. **Ticket Sales**
   - Online booking
   - Different ticket types
   - Daily sales tracking

4. **Gift Shop**
   - Inventory management
   - POS system
   - Sales reporting

5. **Revenue Reports**
   - Daily/Monthly/Yearly reports
   - Department-wise breakdown
   - Export to CSV/PDF

### Optional Features (Nice to Have)
- Member management system
- Event scheduling
- Interactive zoo map
- Mobile responsive design
- Email notifications

## API Endpoints Structure

### Animals
- GET /api/animals - List all animals
- GET /api/animals/:id - Get specific animal
- POST /api/animals - Add new animal
- PUT /api/animals/:id - Update animal
- DELETE /api/animals/:id - Remove animal

### Tickets
- GET /api/tickets - List tickets
- POST /api/tickets - Book ticket
- GET /api/tickets/revenue - Revenue report

### Gift Shop
- GET /api/gift-shop/items - List items
- POST /api/gift-shop/sale - Process sale
- GET /api/gift-shop/inventory - Check inventory

## Development Guidelines

### Git Workflow
1. Create feature branches for each task
2. Make regular commits with clear messages
3. Create pull requests for review
4. Merge to main after approval

### Coding Standards
- Use meaningful variable names
- Comment complex logic
- Follow consistent formatting
- Test before committing

## Deliverables
1. Working application with all core features
2. Database with sample data
3. API documentation
4. User manual
5. Final presentation

## Timeline
- Week 1: Setup and database design
- Week 2-3: Backend development
- Week 3-4: Frontend development
- Week 5: Integration and testing
- Week 6: Documentation and presentation prep

## Resources
- [W3Schools SQL Tutorial](http://www.w3schools.com/sql/default.asp)
- [React Documentation](https://www.w3schools.com/REACT/DEFAULT.ASP)
- [Node.js Tutorial](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [MySQL Tutorial](http://www.mysqltutorial.org/)

## Team Communication
- Use GitHub Issues for task tracking
- Regular team meetings (schedule TBD)
- Slack/Discord for quick communication

## Questions for Professor
- Database hosting options?
- Authentication requirements?
- Deployment platform preferences?