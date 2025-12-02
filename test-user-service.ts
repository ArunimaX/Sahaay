
import { UserService } from './server/services/user-service';
import { pool } from './server/postgres-config';

async function test() {
    try {
        console.log("Initializing table...");
        await UserService.initializeTable();

        console.log("Creating user...");
        const email = `test-${Date.now()}@example.com`;
        const user = await UserService.createUser({
            email,
            name: 'Test User',
            role: 'donor',
            password: 'hashedpassword'
        });
        console.log("User created:", user);

        console.log("Getting user by email...");
        const fetchedUser = await UserService.getUserByEmail(email);
        console.log("User fetched:", fetchedUser);

        console.log("Cleaning up...");
        // await UserService.deleteUser(user.id); // id might be number
        await pool.query('DELETE FROM users WHERE email = $1', [email]);

        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

test();
