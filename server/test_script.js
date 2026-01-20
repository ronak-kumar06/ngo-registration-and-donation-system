
const axios = require('axios');
const crypto = require('crypto');

const API_URL = 'http://localhost:5000/api';
const SECRET = 'rzp_secret_placeholder'; // Matching server .env

const runTest = async () => {
    try {
        console.log('--- STARTING BACKEND TESTS ---');

        // 1. Register User
        const userEmail = `user_${Date.now()}@test.com`;
        console.log(`\n1. Registering User: ${userEmail}`);
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: userEmail,
            password: 'password123',
            phone: '1234567890'
        });
        console.log('   Status:', regRes.status);
        const userToken = regRes.data.token;

        // 2. Login User (Verification)
        console.log('\n2. Logging in User');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: userEmail,
            password: 'password123'
        });
        console.log('   Status:', loginRes.status);
        console.log('   Role:', loginRes.data.role);

        // 3. Get User Profile
        console.log('\n3. Fetching User Profile');
        const profileRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('   Status:', profileRes.status);
        console.log('   User:', profileRes.data.name);

        // 4. Create Donation Order
        console.log('\n4. Creating Donation Order');
        const orderRes = await axios.post(`${API_URL}/donations/create-order`, {
            amount: 500,
            campaign: 'Test Campaign'
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('   Status:', orderRes.status);
        const orderId = orderRes.data.id; // Usually 'order_...' from razorpay
        // Since we are in test mode and using placeholder keys, Razorpay might error if keys are invalid.
        // However, if the server is just using the library, it might fail if keys are invalid.
        // Let's see if it passed.
        console.log('   Order ID:', orderId);

        if (orderId) {
             // 5. Verify Payment (Mocking Signature)
            console.log('\n5. Verifying Payment');
            const paymentId = 'pay_test_' + Date.now();
            const body = orderId + '|' + paymentId;
            const signature = crypto
                .createHmac('sha256', SECRET)
                .update(body.toString())
                .digest('hex');

            const verifyRes = await axios.post(`${API_URL}/donations/verify-payment`, {
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
                amount: 500,
                campaign: 'Test Campaign'
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.log('   Status:', verifyRes.status);
            console.log('   Message:', verifyRes.data.message);
        } else {
            console.log('   SKIPPING VERIFICATION (No Order ID)');
        }

        // 6. Get My Donations
        console.log('\n6. Fetching My Donations');
        const myDonationsRes = await axios.get(`${API_URL}/donations/my`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('   Status:', myDonationsRes.status);
        console.log('   Count:', myDonationsRes.data.length);


        // --- ADMIN TESTS ---

        // 7. Register Admin
        const adminEmail = `admin_${Date.now()}@test.com`;
        console.log(`\n7. Registering Admin: ${adminEmail}`);
        const adminRegRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Admin User',
            email: adminEmail,
            password: 'password123',
            phone: '9876543210',
            role: 'admin'
        });
        console.log('   Status:', adminRegRes.status);
        const adminToken = adminRegRes.data.token;

        // 8. Admin Stats
        console.log('\n8. Fetching Admin Stats');
        const statsRes = await axios.get(`${API_URL}/admin/stats`, {
             headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('   Status:', statsRes.status);
        console.log('   Total Users:', statsRes.data.totalUsers);
        console.log('   Total Donations:', statsRes.data.totalDonationsAmount);

        // 9. Admin Get Users
        console.log('\n9. Fetching All Users');
        const usersRes = await axios.get(`${API_URL}/admin/users`, {
             headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('   Status:', usersRes.status);
        console.log('   User Count:', usersRes.data.length);

        console.log('\n--- TESTS COMPLETED SUCCESSFULLY ---');

    } catch (error) {
        console.error('\n!!! TEST FAILED !!!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
};

runTest();
