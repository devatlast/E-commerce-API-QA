# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: users.spec.js >> Create a new user
- Location: tests/playwright/users.spec.js:25:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 400
```

# Test source

```ts
  1   | import {login} from './helpers/auth.js';
  2   | import { test, expect } from '@playwright/test';
  3   | 
  4   | let userToken;
  5   | let adminToken; 
  6   | 
  7   | test.beforeAll(async({request}) => {
  8   |     const userRes = await login(
  9   |         request, 
  10  |         'larotimi@email.com',
  11  |         'lawale1'
  12  |     );
  13  |     userToken = userRes.token;
  14  | 
  15  |     const adminRes = await login(
  16  |         request,
  17  |         'ola@email.com',
  18  |         'admin1'
  19  |     );
  20  |     adminToken = adminRes.token
  21  | });
  22  | 
  23  | 
  24  | 
  25  | test("Create a new user", async ({request}) => {
  26  |     const response = await request.post('/users', {
  27  |         data: {
  28  |             first_name: 'playwright4',
  29  |             last_name: 'tester4',
  30  |             email: 'playwright4@test.com',
  31  |             password: 'testPasswd123'
  32  |         }
  33  |     });
> 34  |     expect(response.status()).toBe(201);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  35  |     const body =  await response.json();
  36  | 
  37  |     expect(body).toHaveProperty('id');
  38  |     expect(body).toHaveProperty('first_name');
  39  |     expect(body).toHaveProperty('last_name');
  40  |     expect(body).toHaveProperty('email');
  41  |     expect(body).toHaveProperty('password');
  42  | })
  43  | 
  44  | test('User logs in successfully', async ({request}) => {
  45  |     const response = await request.post('/login', {
  46  |         data: {
  47  |             email: 'playwright@test.com',
  48  |             password: 'testPasswd123'
  49  |         }
  50  |     });
  51  |     expect(response.status()).toBe(200);
  52  |     const body = await response.json();
  53  |     const token = body.token;
  54  |     expect(token).toBeTruthy();
  55  | })
  56  | 
  57  | test('User updates profile details', async ({ request }) => {
  58  | 
  59  |     const response = await request.put('/users/me', {
  60  |      headers: { Authorization:  `Bearer ${userToken}` },
  61  |      data: {
  62  |         first_name: 'olawale',
  63  |         last_name: 'olarotimi'
  64  |      }
  65  |     });
  66  |     expect(response.status()).toBe(201);
  67  |     const body = await response.json();
  68  |     expect(body).toHaveProperty('id');
  69  |     expect(body).toHaveProperty('created_at');
  70  |     expect(body).toHaveProperty('first_name');
  71  |     expect(body).toHaveProperty('last_name');
  72  | })
  73  | 
  74  | test('User views profile', async({request}) => {
  75  |     const response = await request.get('/users/me', {
  76  |         headers: {
  77  |             Authorization: `Bearer ${userToken}`
  78  |         }
  79  |     });
  80  |     expect(response.status()).toBe(200);
  81  |     const body = await response.json();
  82  |     expect(body).toHaveProperty('full_name');
  83  |     expect(body).toHaveProperty('email');
  84  |     expect(body).toHaveProperty('created_at');
  85  | })
  86  | 
  87  | test('Admin views all profiles', async ({request}) => {
  88  |     const response = await request.get('/users', {
  89  |         headers: {
  90  |             Authorization: `Bearer ${adminToken}`
  91  |         }
  92  |     });
  93  |     expect(response.status()).toBe(200);
  94  |     const body = await response.json();
  95  | 
  96  |     expect(Array.isArray(body)).toBeTruthy();
  97  |     expect(body.length).toBeGreaterThan(0);
  98  | 
  99  |    const user = body[0];
  100 |     expect(user).toHaveProperty('id');
  101 |     expect(user).toHaveProperty('created_at');
  102 |     expect(user).toHaveProperty('first_name');
  103 |     expect(user).toHaveProperty('last_name');
  104 |     expect(user).toHaveProperty('role');
  105 |     expect(user).toHaveProperty('password');
  106 | })
  107 | 
  108 | test('Admin updates user role to Admin successfully', async ({request}) => {
  109 |     const response = await request.put('/users/13', {
  110 |         headers: {
  111 |             Authorization: `Bearer ${adminToken}`
  112 |         },
  113 |         data: {
  114 |             role: 'admin'
  115 |         }
  116 |     });
  117 | 
  118 |     expect(response.status()).toBe(201);
  119 |     const body = await response.json();
  120 | 
  121 |     expect(body).toHaveProperty('role');
  122 |     expect(body.role).toBe('admin');
  123 | })
  124 | 
  125 | 
  126 | test('Admin deletes user from table', async ({request}) => {
  127 |     const response = await request.delete('/users/51', {
  128 |         headers: {
  129 |             Authorization: `Bearer ${adminToken}`
  130 |         }
  131 |     });
  132 | 
  133 |     expect(response.status()).toBe(200);
  134 |     const body = await response.json();
```