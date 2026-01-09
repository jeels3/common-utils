# @jeels3/common-utils - Validation Library

A powerful, chainable, and type-safe validation library for TypeScript and JavaScript.

## Features
- 🔗 **Fluent API**: Chainable rules (e.g., `.required().email().min(5)`)
- 🏗 **Schema Validation**: Validate full objects against interfaces.
- ⚡ **Async Support**: Native support for async validation (DB checks, API calls).
- 🧩 **Cross-Field Validation**: Compare fields (e.g., Password vs Confirm Password).
- 📦 **Zero Dependencies**: Lightweight and framework-agnostic.

## Installation

```bash
npm install @jeels3/common-utils
```

## Usage

### Basic Field Validation

```typescript
import { Validator } from '@jeels3/common-utils';

const emailValidator = new Validator('email')
  .required()
  .email()
  .allowedDomains(['company.com']);

const result = await emailValidator.run('test@gmail.com');

if (!result.valid) {
  console.log(result.errors); 
  // Output: [{ field: 'email', message: 'Email domain must be one of: company.com', ... }]
}
```

### Schema Model Validation

```typescript
import { Validator, createSchema } from '@jeels3/common-utils';

interface User {
  username: string;
  age: number;
}

const UserSchema = createSchema<User>({
  username: new Validator().required().min(3),
  age: new Validator().number().min(18)
});

const result = await UserSchema.run({ username: 'yo', age: 16 });
```

### Async Validation

```typescript
new Validator().unique(async (val) => {
  const exists = await db.checkUser(val);
  return !exists;
});
```

## License
MIT
