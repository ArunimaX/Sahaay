
import { AuthService } from './server/services/auth-service';
import { pool } from './server/postgres-config';

async function test() {
    try {
        console.log("Initializing DB...");
        await AuthService.initializeDatabase();

        console.log("Registering user...");
        const email = `auth-test-${Date.now()}@example.com`;
        const result = await AuthService.registerUser({
            email,
            name: 'Auth Test User',
            role: 'donor',
            password: 'password123',
            confirmPassword: 'password123'
        });
        console.log("Registration result:", result);

        if (result.success) {
            console.log("Login user...");
            const loginResult = await AuthService.loginUser({
                email,
                password: 'password123'
            });
            console.log("Login result:", loginResult);
        }

        console.log("Cleaning up...");
        await pool.query('DELETE FROM users WHERE email = $1', [email]);

        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

test();
