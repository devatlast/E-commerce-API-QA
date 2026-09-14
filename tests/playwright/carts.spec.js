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

test('Admin views all users carts', async ({request}) => {
    const response = await request.get('/cart/', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    const cart = body[0];
    expect(cart).toHaveProperty('id');
    expect(cart).toHaveProperty('user_id');
    expect(cart).toHaveProperty('product_id');
    expect(cart).toHaveProperty('quantity');
})

test('User views own cart', async ({request}) => {
    const response = await request.get('/cart/me', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    const cart = body[0];
    expect(cart).toHaveProperty('full_name');
    expect(cart).toHaveProperty('price');
    expect(cart).toHaveProperty('product_name');
    expect(cart).toHaveProperty('quantity');
})

test('User adds product to cart', async ({request}) => {
    const response = await request.post('/cart/', {
        headers: {
            Authorization: `Bearer ${userToken}`
        },
        data: {
            product_id: 2,
            quantity: 5
        }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    const cart = body[0];
    expect(cart).toHaveProperty('user_id');
    expect(cart).toHaveProperty('product_id');
    expect(cart).toHaveProperty('quantity');
})

test('User deletes product from cart', async ({request}) => {
    const response = await request.delete('/cart/2', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(204);
})

test('User cannot access other users carts', async ({request}) => {
    const response = await request.get('/cart/', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(403);
})