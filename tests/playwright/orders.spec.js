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

test('Admin views all orders', async ({request}) => {
    const response = await request.get('/orders/', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    const order = body[0];
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('user_id');
    expect(order).toHaveProperty('status');
    expect(order).toHaveProperty('created_at');
    expect(order).toHaveProperty('total');
})

test('Admin gets order by id', async ({request}) => {
    const response = await request.get('/orders/5', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('user_id');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('created_at');
})

test('User adds product to cart', async ({request}) => {
    const response = await request.post('/cart/', {
        headers: {
            Authorization: `Bearer ${userToken}`
        },
        data: {
            product_id: 1,
            quantity: 4
        }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    console.log(body);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    const cart = body[0];
    expect(cart).toHaveProperty('user_id');
    expect(cart).toHaveProperty('product_id');
    expect(cart).toHaveProperty('quantity');
})

test('User creates new order', async ({request}) => {
    const response = await request.post('/orders', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(201);
    const body = await response.json()
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('order');
})

test('Admin updates order status', async ({request}) => {
    const response = await request.patch('/orders/5/status', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        },
        data: {
            status: 'shipped'
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('order');
})

test('User views order', async ({request}) => {
    const response = await request.get('/orders/me', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    const order = body[0];

    expect(order).toHaveProperty('status');
    expect(order).toHaveProperty('total');
})

test('Admin removes order from list', async ({request}) => {
    const response = await request.delete('/orders/18', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    expect(response.status()).toBe(204);
})

test('User cannot access another user order', async ({request}) => {
    const response = await request.get('/orders/3', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(403)
})

test('User cannot access order without token', async ({request}) => {
    const response = await request.get('/orders/me');
    expect(response.status()).toBe(401);
})