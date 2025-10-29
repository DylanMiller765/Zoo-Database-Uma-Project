# Browser Console Demo: Testing Notifications API

This guide shows you how to test the notification system from your web browser's developer console.

## Prerequisites

1. Backend server running: `npm run dev:backend`
2. Frontend server running: `npm run dev:frontend`
3. Database has been updated with the new schema
4. At least one customer has a membership expiring within 30 days

## Step-by-Step Browser Demo

### Step 1: Login as a Customer

1. Open your browser to `http://localhost:3000/login`
2. Login with Maria Garcia's credentials:
   - Email: `maria.garcia@email.com`
   - Password: `password`

### Step 2: Open Browser Console

- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- **Safari**: `Cmd+Option+C`

### Step 3: Check Authentication

Verify you're logged in by checking for a token:

```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
```

### Step 4: Test Notification API Endpoints

#### Get All Notifications
```javascript
const API_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

fetch(`${API_URL}/api/notifications`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('All notifications:', data);
  console.table(data);
})
.catch(err => console.error('Error:', err));
```

#### Get Unread Notifications Only
```javascript
fetch(`${API_URL}/api/notifications?unread=true`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('Unread notifications:', data);
  console.table(data);
})
.catch(err => console.error('Error:', err));
```

#### Get Unread Count
```javascript
fetch(`${API_URL}/api/notifications/unread-count`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('Unread count:', data.count);
})
.catch(err => console.error('Error:', err));
```

#### Mark a Notification as Read
```javascript
// Replace NOTIFICATION_ID with an actual ID from the notifications you received
const notificationId = 1; // Change this to a real ID

fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('Marked as read:', data);
})
.catch(err => console.error('Error:', err));
```

#### Mark All Notifications as Read
```javascript
fetch(`${API_URL}/api/notifications/mark-all-read`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  console.log('All marked as read:', data);
})
.catch(err => console.error('Error:', err));
```

#### Delete a Notification
```javascript
const notificationId = 1; // Change this to a real ID

fetch(`${API_URL}/api/notifications/${notificationId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(() => {
  console.log('Notification deleted');
})
.catch(err => console.error('Error:', err));
```

### Step 5: Complete Testing Script

Here's a complete script that runs all tests in sequence:

```javascript
(async function testNotificationSystem() {
  const API_URL = 'http://localhost:5000';
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('❌ Not logged in! Please login first.');
    return;
  }

  console.log('🚀 Starting Notification System Test...\n');

  try {
    // Test 1: Get all notifications
    console.log('📋 Test 1: Getting all notifications...');
    const allRes = await fetch(`${API_URL}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const allNotifications = await allRes.json();
    console.log('✅ Total notifications:', allNotifications.length);
    console.table(allNotifications);

    // Test 2: Get unread count
    console.log('\n📊 Test 2: Getting unread count...');
    const countRes = await fetch(`${API_URL}/api/notifications/unread-count`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const countData = await countRes.json();
    console.log('✅ Unread notifications:', countData.count);

    // Test 3: Get only unread
    console.log('\n📬 Test 3: Getting unread notifications...');
    const unreadRes = await fetch(`${API_URL}/api/notifications?unread=true`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const unreadNotifications = await unreadRes.json();
    console.log('✅ Unread notifications:', unreadNotifications.length);
    console.table(unreadNotifications);

    // Test 4: Mark one as read (if exists)
    if (unreadNotifications.length > 0) {
      const firstId = unreadNotifications[0].notification_id;
      console.log(`\n✔️ Test 4: Marking notification ${firstId} as read...`);
      await fetch(`${API_URL}/api/notifications/${firstId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Marked as read');
    }

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
})();
```

## Testing the NotificationBanner Component

The NotificationBanner component should automatically appear at the top of any page when you're logged in and have unread notifications.

### To Test:

1. Make sure you ran the `CALL check_expiring_memberships();` procedure in the database
2. Login as `maria.garcia@email.com`
3. Navigate to any page (home, tickets, membership, etc.)
4. You should see a yellow warning banner at the top with the expiration message
5. Click the X button to dismiss it
6. Refresh the page - the banner should NOT reappear (marked as read)

### Debugging the Banner

If the banner doesn't appear, check the browser console:

```javascript
// Check if NotificationBanner is fetching data
// Look for any errors in the console

// Manually trigger a notification fetch
import { notificationService } from '@/services/notification.service';

notificationService.getNotifications(true)
  .then(notifications => {
    console.log('Fetched notifications:', notifications);
  })
  .catch(err => {
    console.error('Error fetching notifications:', err);
  });
```

## Force Trigger the Stored Procedure

### Option 1: From MySQL Workbench (Recommended)

1. Connect to Railway database in MySQL Workbench
2. Run this single command:
   ```sql
   CALL check_expiring_memberships();
   ```

3. Check results:
   ```sql
   SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
   ```

### Option 2: From Browser Console (Indirect)

You can't directly call SQL procedures from the browser, but you can create a test customer that should trigger notifications:

```javascript
// This requires you to be logged in as an admin/manager
const API_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

// Create a customer with membership expiring soon
fetch(`${API_URL}/api/customers`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: 'Test',
    last_name: 'Expiring',
    email: 'test.expiring@email.com',
    phone: '555-TEST',
    annual_pass: 'yes',
    membership_start_date: new Date(Date.now() - 350 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    membership_end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    registration_date: new Date().toISOString().split('T')[0]
  })
})
.then(res => res.json())
.then(data => console.log('Test customer created:', data))
.catch(err => console.error('Error:', err));
```

Then run the procedure in MySQL Workbench to create the notification for this test customer.

## Common Issues

### "Not authorized" error
- Make sure you're logged in
- Check that `localStorage.getItem('token')` returns a valid token
- Try logging out and logging back in

### No notifications returned
- Run `CALL check_expiring_memberships();` in the database first
- Verify Maria Garcia has a membership expiring within 30 days
- Check the database directly: `SELECT * FROM notifications WHERE customer_id = 2;`

### CORS errors
- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000
- Check backend CORS settings in `backend/src/server.ts`

## Expected Behavior

When everything is working correctly:

1. **Database**: `check_expiring_memberships()` creates notifications for memberships expiring in 1-30 days
2. **API**: Returns unread notifications when called with authentication
3. **Frontend**: NotificationBanner fetches and displays unread notifications
4. **User Experience**: Yellow warning banner appears at top with expiration message and "Renew membership →" link
