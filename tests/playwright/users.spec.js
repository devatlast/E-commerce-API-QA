import {login} from './helpers/auth.js';
import { test, expect } from '@playwright/test';

let userToken;
let adminToken; 

test.beforeAll(async({request}) => {
    const userRes = await login(
        request, 
        'larotimi@email.com',
        'lawale1'
    );
    userToken = userRes.token;

    const adminRes = await login(
        request,
        'ola@email.com',
        'admin1'
    );
    adminToken = adminRes.token
});



test("Create a new user", async ({request}) => {
    const response = await request.post('/users', {
        data: {
            first_name: 'playwright4',
            last_name: 'tester4',
            email: 'playwright4@test.com',
            password: 'testPasswd123'
        }
    });
    expect(response.status()).toBe(201);
    const body =  await response.json();

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('first_name');
    expect(body).toHaveProperty('last_name');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('password');
})

test('User logs in successfully', async ({request}) => {
    const response = await request.post('/login', {
        data: {
            email: 'playwright@test.com',
            password: 'testPasswd123'
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const token = body.token;
    expect(token).toBeTruthy();
})

test('User updates profile details', async ({ request }) => {

    const response = await request.put('/users/me', {
     headers: { Authorization:  `Bearer ${userToken}` },
     data: {
        first_name: 'olawale',
        last_name: 'olarotimi'
     }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('created_at');
    expect(body).toHaveProperty('first_name');
    expect(body).toHaveProperty('last_name');
})

test('User views profile', async({request}) => {
    const response = await request.get('/users/me', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('full_name');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('created_at');
})

test('Admin views all profiles', async ({request}) => {
    const response = await request.get('/users', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

   const user = body[0];
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('created_at');
    expect(user).toHaveProperty('first_name');
    expect(user).toHaveProperty('last_name');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('password');
})

test('Admin updates user role to Admin successfully', async ({request}) => {
    const response = await request.put('/users/13', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        },
        data: {
            role: 'admin'
        }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body).toHaveProperty('role');
    expect(body.role).toBe('admin');
})


test('Admin deletes user from table', async ({request}) => {
    const response = await request.delete('/users/51', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.message).toBe('User deleted');
})
 

test('User cannot update role to Admin', async ({request}) => {
    const response = await request.put('/users/me', {
        headers: {
            Authorization: `Bearer ${userToken}`
        },
        data: {
            role: 'admin'
        }
    });

    expect(response.status()).toBe(400);
})

test('User cannot access other users details', async ({request}) => {
    const response = await request.get('/users', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });

    expect(response.status()).toBe(403);
})