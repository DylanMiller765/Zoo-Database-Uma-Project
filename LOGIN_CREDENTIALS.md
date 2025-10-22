# Zoo Admin Login Credentials

## Admin Portal Access

**URL**: `http://localhost:3000/admin/login`

All employees can login with their email address and the password: `password`

## Employee Accounts

| Name | Email | Username | Job Role | Password |
|------|-------|----------|----------|----------|
| John Smith | john.smith@zoo.com | jsmith | Manager | password |
| Sarah Johnson | sarah.johnson@zoo.com | sjohnson | Keeper | password |
| Mike Chen | mike.chen@zoo.com | mchen | Veterinarian | password |
| Emma Davis | emma.davis@zoo.com | edavis | Keeper | password |
| David Lee | david.lee@zoo.com | dlee | Coordinator | password |
| Lisa Martinez | lisa.martinez@zoo.com | lmartinez | Guide | password |
| James Wilson | james.wilson@zoo.com | jwilson | Maintenance | password |
| Rachel Brown | rachel.brown@zoo.com | rbrown | Security | password |

## Quick Test Login

**Manager Account:**
- Email: `john.smith@zoo.com`
- Password: `password`

**Veterinarian Account:**
- Email: `mike.chen@zoo.com`
- Password: `password`

## Customer Portal

**URL**: `http://localhost:3000/login`

(Customer accounts can be created through the registration flow)

## Important Notes

1. All employee accounts use the role `employee` in the backend
2. The `job_role` field determines their specific position (manager, keeper, etc.)
3. Passwords are stored in plain text in the `passwords` table (for demo purposes only - should use bcrypt in production)
4. The admin portal redirects based on the user's role:
   - Employees → `/admin` (Admin Dashboard)
   - Customers → `/` (Public Site)
