import { Validator } from '../core/Validator';
import { createSchema } from '../core/SchemaValidator';

// 1. Define your interface
interface UserProfile {
    username: string;
    email: string;
    age: number;
    website?: string;
}

// 2. Define the exact schema matching the interface
const UserProfileSchema = createSchema<UserProfile>({
    username: new Validator('username')
        .required()
        .min(3)
        .max(20),

    email: new Validator('email')
        .required()
        .email(),

    age: new Validator('age')
        .number()
        .min(18), // Must be adult

    website: new Validator('website')
        .url() // Optional by default unless .required() is called
});

async function runModelDemo() {
    console.log("=== Model/Schema Validation Demo ===\n");

    const validUser: UserProfile = {
        username: "jeel_dev",
        email: "jeel@example.com",
        age: 25,
        website: "https://jeel.dev"
    };

    const invalidUser: UserProfile = {
        username: "yo", // too short
        email: "not-an-email",
        age: 16, // Underage
        website: "htp://broke-url"
    };

    console.log("--- Valid User ---");
    const r1 = await UserProfileSchema.run(validUser);
    console.log(JSON.stringify(r1, null, 2));

    console.log("\n--- Invalid User ---");
    const r2 = await UserProfileSchema.run(invalidUser);
    console.log(JSON.stringify(r2, null, 2));
}

runModelDemo().catch(console.error);
