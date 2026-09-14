import {login} from './helpers/auth.js';
import { test, expect } from '@playwright/test';

let userToken;
let adminToken; 

test.beforeEach(async({request}) => {
    const userRes = await login(
        request, 
        'tolu@email.com',
        'tolu1st'
    );
    userToken = userRes.token;

    const adminRes = await login(
        request,
        'ola@email.com',
       'admin1'
    );
    adminToken = adminRes.token;
});


test('Admin views all categories', async ({request}) => {
    const response = await request.get('/category/all', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const category = body[0];
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('name');
})

test('User views available categories', async ({request}) => {
    const response = await request.get('/category/me', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const category = body[0];
    expect(category).toHaveProperty('name');
})

test('Admin adds new category', async ({request}) => {
    const response = await request.post('/category', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        },
        data: {
            name: 'construction'
        }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
})

test('Admin updates existing category', async ({request}) => {
    const response = await request.patch('/category/32', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        },
        data: {
            name: 'Men Fashion'
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
})

test('Admin deletes category from list', async ({request}) => {
    const response = await request.delete('/category/36', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    expect(response.status()).toBe(204);
})

test('user cannot add new category', async ({request}) => {
    const response = await request.post('/category/', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(403);
})

test('User cannot remove category from list', async ({request}) => {
    const response = await request.delete('/category/1', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(403);
})

test('User cannot access categories without token', async ({request}) => {
    const response = await request.get('/category/me');
    expect(response.status()).toBe(401);
})