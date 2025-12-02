
import fetch from 'node-fetch';

async function registerAdmin() {
    try {
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Admin',
                email: 'admin@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'admin'
            })
        });

        const data = await response.json();
        console.log('Registration response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error registering admin:', error);
    }
}

registerAdmin();
