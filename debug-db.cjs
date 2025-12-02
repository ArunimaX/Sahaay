require('dotenv').config();
const { Client } = require('pg');


const passwords = ['slj2003kpa'];
const dbName = 'sahaay_connect'; // Guessed from truncated output
const user = 'postgres';

async function testPasswords() {
    for (const pass of passwords) {
        console.log(`Trying password: ${pass}`);
        const client = new Client({
            connectionString: `postgresql://${user}:${pass}@localhost:5432/${dbName}`,
            connectionTimeoutMillis: 2000,
        });

        try {
            await client.connect();
            console.log(`SUCCESS! Password is: ${pass}`);
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`Failed with ${pass}: ${err.message}`);
            await client.end();
        }
    }
    console.log("All passwords failed.");
    process.exit(1);
}

testPasswords();
