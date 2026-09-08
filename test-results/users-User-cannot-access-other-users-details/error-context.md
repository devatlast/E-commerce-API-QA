# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: users.spec.js >> User cannot access other users details
- Location: tests/playwright/users.spec.js:153:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 403
Received: 200
```

# Test source

```ts
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
  135 | 
  136 |     expect(body.message).toBe('User deleted');
  137 | })
  138 |  
  139 | 
  140 | test('User cannot update role to Admin', async ({request}) => {
  141 |     const response = await request.put('/users/me', {
  142 |         headers: {
  143 |             Authorization: `Bearer ${userToken}`
  144 |         },
  145 |         data: {
  146 |             role: 'admin'
  147 |         }
  148 |     });
  149 | 
  150 |     expect(response.status()).toBe(400);
  151 | })
  152 | 
  153 | test('User cannot access other users details', async ({request}) => {
  154 |     const response = await request.get('/users', {
  155 |         headers: {
  156 |             Authorization: `Bearer ${userToken}`
  157 |         }
  158 |     });
  159 | 
> 160 |     expect(response.status()).toBe(403);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  161 | })
```