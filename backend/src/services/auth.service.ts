import { query } from '../config/database';

interface LoginResponse {
  user: {
    account_id: number;
    email: string;
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
      `SELECT u.account_id, u.email, u.role, u.employee_id, u.customer_id,
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

    // Step 2: Check password from separate passwords table (best practice)
    const [passwordRecord] = await query<any[]>(
      `SELECT password_hash FROM passwords WHERE account_id = ?`,
      [user.account_id]
    );

    if (!passwordRecord || passwordRecord.password_hash !== password) {
      throw new Error('Invalid email or password');
    }

    return {
      user: {
        account_id: user.account_id,
        email: user.email,
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
}

export default new AuthService();
