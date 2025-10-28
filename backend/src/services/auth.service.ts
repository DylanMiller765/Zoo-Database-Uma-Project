import { query } from '../config/database';
import { signToken } from '../utils/jwt.util';

interface LoginResponse {
  token: string;
  user: {
    account_id: number;
    email: string;
    username: string;
    role: 'employee' | 'customer';
    first_name: string;
    last_name: string;
    job_role?: string;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Step 1: Find user by email
    const [user] = await query<any[]>(
      `SELECT u.account_id, u.email, u.role, u.employee_id, u.customer_id, u.username,
              e.first_name as employee_first_name, e.last_name as employee_last_name, e.job_role,
              c.first_name as customer_first_name, c.last_name as customer_last_name
       FROM user_accounts u
       LEFT JOIN employees e ON u.employee_id = e.employee_id
       LEFT JOIN customers c ON u.customer_id = c.customer_id
       WHERE u.email = ?`,
      [email]
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    console.log('User:', user);

    // Step 2: Check password from separate passwords table
    const [passwordRecord] = await query<any[]>(
      `SELECT password_hash FROM passwords WHERE account_id = ?`,
      [user.account_id]
    );

    console.log('Password Record:', passwordRecord);

    // Plain text password comparison (no hashing)
    const isPasswordValid = passwordRecord && password === passwordRecord.password_hash;

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Step 3: Generate JWT
    const token = signToken({ id: user.account_id, role: user.role });

    return {
      token,
      user: {
        account_id: user.account_id,
        email: user.email,
        username: user.username,
        role: user.role,
        first_name: user.role === 'employee' ? user.employee_first_name : user.customer_first_name,
        last_name: user.role === 'employee' ? user.employee_last_name : user.customer_last_name,
        job_role: user.job_role
      }
    };
  }

  async getProfile(userId: number) {
    const [user] = await query<any[]>(
      `SELECT u.*,
              e.first_name as employee_first_name, e.last_name as employee_last_name,
              e.email as employee_email, e.phone as employee_phone, e.job_role, e.department,
              c.first_name as customer_first_name, c.last_name as customer_last_name,
              c.email as customer_email, c.phone as customer_phone, c.annual_pass
       FROM user_accounts u
       LEFT JOIN employees e ON u.employee_id = e.employee_id
       LEFT JOIN customers c ON u.customer_id = c.customer_id
       WHERE u.account_id = ?`,
      [userId]
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async register(userData: any) {
    const { first_name, last_name, email, phone, address, city, state, zip_code, password } = userData;

    // Step 1: Create a new customer
    const customerResult = await query<any>(
      'INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, registration_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [first_name, last_name, email, phone, address, city, state, zip_code]
    );
    const customerId = customerResult.insertId;

    // Step 2: Create a user account
    const userAccountResult = await query<any>(
      'INSERT INTO user_accounts (email, role, customer_id) VALUES (?, ?, ?)',
      [email, 'customer', customerId]
    );
    const accountId = userAccountResult.insertId;

    // Step 3: Save the password (plain text - no hashing)
    await query('INSERT INTO passwords (account_id, password_hash) VALUES (?, ?)', [accountId, password]);

    // Step 4: Generate JWT
    const token = signToken({ id: accountId, role: 'customer' });

    return { token, user: { account_id: accountId, email, role: 'customer', first_name, last_name } };
  }
}

export default new AuthService();