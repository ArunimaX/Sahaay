
import fetch from 'node-fetch';

async function registerUser() {
    const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Auto Test Donor',
            email: 'autotest@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            role: 'donor'
        })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

registerUser();
