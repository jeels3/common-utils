import { Validator } from '../core/Validator';
import { ValidationContext } from '../core/ValidationContext';

// Mock DB or API
const db = {
    users: ['test@company.com']
};

async function runDemo() {
    console.log("=== Validation Library Demo ===\n");

    // 1. Basic Validation
    console.log("--- 1. Basic Email Validation ---");
    const emailValidator = new Validator('email')
        .required()
        .email()
        .allowedDomains(['company.com']); // Business Rule

    const r1 = await emailValidator.run('invalid-email');
    console.log("Invalid Email Result:", JSON.stringify(r1, null, 2));

    const r2 = await emailValidator.run('user@gmail.com'); // Wrong domain
    console.log("Wrong Domain Result:", JSON.stringify(r2, null, 2));

    const r3 = await emailValidator.run('jeel@company.com');
    console.log("Valid Email Result:", JSON.stringify(r3, null, 2));


    // 2. Async Validation
    console.log("\n--- 2. Async Uniqueness Check ---");
    const uniqueValidator = new Validator('email')
        .email()
        .unique(async (email) => {
            // Simulate DB call
            await new Promise(r => setTimeout(r, 100));
            return !db.users.includes(email);
        });

    const r4 = await uniqueValidator.run('test@company.com'); // Exists
    console.log("Duplicate Email Result:", JSON.stringify(r4, null, 2));


    // 3. Cross-Field Validation (Registration Form)
    console.log("\n--- 3. Cross-Field Validation (Registration) ---");

    const registrationData = {
        password: 'securePassword123!',
        confirmPassword: 'wrongPassword',
        role: 'user'
    };

    const passwordValidator = new Validator('confirmPassword')
        .required()
        .matchField('password', 'Password');

    const r5 = await passwordValidator.run(registrationData.confirmPassword, {}, registrationData);
    console.log("Password Mismatch Result:", JSON.stringify(r5, null, 2));


    // 4. Context-Aware Validation
    console.log("\n--- 4. Context-Aware Validation ---");
    const adminActionValidator = new Validator('deleteAction')
        .adminOnly();

    const contextUser: ValidationContext = { userRole: 'user' };
    const contextAdmin: ValidationContext = { userRole: 'admin' };

    const r6 = await adminActionValidator.run('delete', contextUser);
    console.log("User Context Result:", JSON.stringify(r6, null, 2));

    const r7 = await adminActionValidator.run('delete', contextAdmin);
    console.log("Admin Context Result:", JSON.stringify(r7, null, 2));

    console.log("\n=== Demo Complete ===");
}

runDemo().catch(console.error);
