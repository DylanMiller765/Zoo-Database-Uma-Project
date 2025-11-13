# Testing Payment Forms and Auto-Renewal Features

## Prerequisites

1. ✅ Migration files run:
   - `add_auto_renew_payment_methods.sql` ✅
   - `add_auto_renewal_job.sql` ✅
2. ✅ Backend running on `http://localhost:5000`
3. ✅ Frontend running on `http://localhost:3000`
4. ✅ Test customer account (e.g., `john.smith@email.com` / `password`)

---

## Test 1: Payment Form on Tickets Page

### Steps:
1. Go to `http://localhost:3000/tickets`
2. Select tickets (e.g., 2 adults)
3. Choose a visit date
4. Click **"Proceed to Checkout"**
5. **Payment form should appear**

### What to verify:
- ✅ Payment form shows all fields (card number, name, expiry, CVV, billing address)
- ✅ If logged in: "Save payment method" checkbox appears
- ✅ If not logged in: No save checkbox
- ✅ Form validation works (try submitting empty form)
- ✅ Card number formatting (spaces every 4 digits)

### Test saving payment (if logged in):
1. Fill in payment form
2. ✅ Check "Save payment method to my account"
3. Submit
4. Verify in database:
   ```sql
   SELECT * FROM customer_payment_methods WHERE customer_id = YOUR_CUSTOMER_ID;
   ```

---

## Test 2: Payment Form on Membership Page

### Steps:
1. Go to `http://localhost:3000/membership`
2. Fill in member information (name, email, etc.)
3. Click **"Complete Purchase"**
4. **Payment form should appear**

### What to verify:
- ✅ Payment form appears after clicking "Complete Purchase"
- ✅ "Save payment method" checkbox shows (if logged in)
- ✅ Form validation works
- ✅ After submitting, redirects to confirmation page

### Test saving payment:
1. Fill payment form
2. ✅ Check "Save payment method"
3. Submit
4. Verify:
   ```sql
   -- Check payment method saved
   SELECT * FROM customer_payment_methods WHERE customer_id = YOUR_CUSTOMER_ID;
   
   -- Check membership purchased
   SELECT * FROM membership_purchases WHERE customer_id = YOUR_CUSTOMER_ID ORDER BY purchase_date DESC;
   
   -- Check customer membership updated
   SELECT customer_id, annual_pass, membership_start_date, membership_end_date, membership_auto_renew 
   FROM customers WHERE customer_id = YOUR_CUSTOMER_ID;
   ```

---

## Test 3: Auto-Renewal Toggle

### Steps:
1. Login as a customer with an **active membership**
2. Go to `http://localhost:3000/customer`
3. Click **"Membership"** tab
4. Scroll down to **"Auto-Renewal"** section

### What to verify:
- ✅ Auto-renewal toggle appears (only if user has active membership)
- ✅ Shows current status (ON/OFF)
- ✅ Toggle switch works (click to turn ON/OFF)
- ✅ Status updates immediately after toggling
- ✅ Message changes based on status

### Test enabling auto-renewal:
1. Click toggle to turn ON
2. Verify in database:
   ```sql
   SELECT customer_id, membership_auto_renew 
   FROM customers WHERE customer_id = YOUR_CUSTOMER_ID;
   -- Should show: membership_auto_renew = 1 (or TRUE)
   ```

### Test disabling auto-renewal:
1. Click toggle to turn OFF
2. Verify:
   ```sql
   SELECT membership_auto_renew FROM customers WHERE customer_id = YOUR_CUSTOMER_ID;
   -- Should show: membership_auto_renew = 0 (or FALSE)
   ```

### Test error handling:
1. Try to enable auto-renewal **without** a saved payment method
2. ✅ Should show error: "Please save a payment method before enabling auto-renewal"

---

## Test 4: Payment Method Management

### Get saved payment method:
```bash
# Using curl (replace YOUR_TOKEN)
curl -X GET http://localhost:5000/api/me/payment-method \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:** Returns payment method with masked card number (last 4 digits only)

### Delete payment method:
```bash
curl -X DELETE http://localhost:5000/api/me/payment-method \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:** Payment method deleted, auto-renewal should be disabled if it was ON

---

## Test 5: Auto-Renewal Job (Manual Test)

Since the job runs at midnight, you can test it manually:

### Step 1: Set up test data
```sql
-- Set a customer's membership to expire TODAY
UPDATE customers 
SET membership_end_date = CURDATE(),
    membership_auto_renew = TRUE,
    annual_pass = 'yes'
WHERE customer_id = YOUR_CUSTOMER_ID;

-- Make sure they have a payment method
SELECT * FROM customer_payment_methods WHERE customer_id = YOUR_CUSTOMER_ID;
-- If none, create one or use existing
```

### Step 2: Run the procedure manually
```sql
CALL auto_renew_memberships();
```

### Step 3: Verify results
```sql
-- Check membership was renewed
SELECT customer_id, membership_start_date, membership_end_date, membership_auto_renew
FROM customers 
WHERE customer_id = YOUR_CUSTOMER_ID;
-- membership_end_date should be 1 year from today

-- Check purchase was recorded
SELECT * FROM membership_purchases 
WHERE customer_id = YOUR_CUSTOMER_ID 
ORDER BY purchase_date DESC LIMIT 1;
-- Should show: auto_renewed = 1 (or TRUE)
```

---

## Test 6: Complete Flow Test

### Full user journey:
1. **Register/Login** as new customer
2. **Purchase membership** with payment form
   - ✅ Fill payment form
   - ✅ Check "Save payment method"
   - ✅ Complete purchase
3. **Verify membership active**
   - Go to `/customer` → Membership tab
   - ✅ See "Active Membership"
4. **Enable auto-renewal**
   - ✅ Toggle auto-renewal ON
   - ✅ See confirmation message
5. **Verify in database**
   ```sql
   SELECT 
       c.customer_id,
       c.annual_pass,
       c.membership_auto_renew,
       c.membership_end_date,
       pm.payment_method_id,
       COUNT(mp.purchase_id) as purchase_count
   FROM customers c
   LEFT JOIN customer_payment_methods pm ON c.customer_id = pm.customer_id
   LEFT JOIN membership_purchases mp ON c.customer_id = mp.customer_id
   WHERE c.customer_id = YOUR_CUSTOMER_ID
   GROUP BY c.customer_id;
   ```

---

## Quick Test Checklist

### Payment Forms:
- [ ] Payment form appears on tickets page
- [ ] Payment form appears on membership page
- [ ] "Save payment method" checkbox shows (logged in only)
- [ ] Form validation works
- [ ] Payment method saves to database
- [ ] Purchase completes successfully

### Auto-Renewal:
- [ ] Toggle appears in membership tab (only if active membership)
- [ ] Toggle can be turned ON/OFF
- [ ] Status updates correctly
- [ ] Error shows if no payment method when enabling
- [ ] Database updates correctly

### Database Verification:
- [ ] `customer_payment_methods` table has records
- [ ] `membership_purchases` has `payment_method_id` linked
- [ ] `membership_purchases` has `auto_renewed` column
- [ ] `customers.membership_auto_renew` updates correctly

---

## Common Issues & Fixes

### Issue: Payment form doesn't appear
**Check:**
- Browser console for errors
- Network tab - is API call failing?
- Is `showPaymentForm` state being set?

### Issue: "Save payment method" not showing
**Check:**
- Are you logged in? (Check `isAuthenticated` in AuthContext)
- Is `showSaveOption` prop set to `true`?

### Issue: Auto-renewal toggle not appearing
**Check:**
- Does user have active membership? (`membership.status === 'Active'`)
- Is the membership tab active?
- Check browser console for errors

### Issue: Toggle doesn't work
**Check:**
- Network tab - is API call successful?
- Backend logs - any errors?
- Database - is `membership_auto_renew` column updating?

---

## SQL Queries for Verification

### Check all saved payment methods:
```sql
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    pm.card_number,
    pm.cardholder_name,
    pm.expiry_month,
    pm.expiry_year
FROM customers c
JOIN customer_payment_methods pm ON c.customer_id = pm.customer_id;
```

### Check auto-renewal status:
```sql
SELECT 
    customer_id,
    first_name,
    last_name,
    annual_pass,
    membership_auto_renew,
    membership_end_date
FROM customers
WHERE membership_auto_renew = TRUE;
```

### Check auto-renewed purchases:
```sql
SELECT 
    mp.*,
    c.first_name,
    c.last_name
FROM membership_purchases mp
JOIN customers c ON mp.customer_id = c.customer_id
WHERE mp.auto_renewed = TRUE
ORDER BY mp.purchase_date DESC;
```

---

## Testing Auto-Renewal Job Manually

Since it runs at midnight, test it now:

```sql
-- 1. Set a test customer's membership to expire today
UPDATE customers 
SET membership_end_date = CURDATE(),
    membership_auto_renew = TRUE
WHERE customer_id = 1;  -- Replace with your test customer ID

-- 2. Make sure they have a payment method
-- (Should already exist if you tested saving payment)

-- 3. Run the procedure manually
CALL auto_renew_memberships();

-- 4. Check results
SELECT 
    customer_id,
    membership_start_date,
    membership_end_date,
    membership_auto_renew
FROM customers 
WHERE customer_id = 1;

-- Should show new end_date = 1 year from today
```

---

## Next Steps After Testing

If everything works:
- ✅ All features are functional
- ✅ Auto-renewal will work automatically when memberships expire
- ✅ Users can save payment methods for faster checkout

If something doesn't work:
- Check browser console for frontend errors
- Check backend terminal for API errors
- Check database to see if data is being saved
- Share the error and I'll help fix it!

