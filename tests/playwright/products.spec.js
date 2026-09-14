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


test('User views all available products', async ({request}) => {
    const response = await request.get('/products', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const product = body[0];

    expect(product).toHaveProperty('product_name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('stock')
})

test('Admin views all products', async ({request}) => {
    const response = await request.get('/products/all', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const product = body[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('category_id');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('stock');
})

test('admin adds new product to list', async ({request}) => {
    const response = await request.post('/products', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        },
        data: {
        category_id: 1,
        name: 'Desktop',
        description: 'Portable desktop for home and office',
        price: 329.78,
        stock: 4
        }
    });

    expect(response.status()).toBe(201);
    const product = await response.json();

    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('category_id');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('stock');
})

test('Admin updates existing product', async ({request}) => {
    const response = await request.put('/products/4', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        },
        data: {
            stock: 3
        }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    const product = body[0];

    expect(product).toHaveProperty('category_id');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('stock');
})

test('Admin deletes product from list', async ({request}) => {
    const response = await request.delete('/products/38', {
        headers: {
            Authorization: `Bearer ${adminToken}`
        }
    });
    expect(response.status()).toBe(204);
})


test('user cannot delete product from list', async ({request}) => {
    const response = await request.delete('/products/2', {
        headers: {
            Authorization: `Bearer ${userToken}`
        }
    });
    expect(response.status()).toBe(403);
})

test('User cannot add new product', async ({ request }) => {
    const response = await request.post('/products', {
        headers: {
            Authorization: `Bearer ${userToken}`
        },
        data: {
        category_id: 1,
        name: 'Desktop',
        description: 'Portable desktop for home and office',
        price: 329.78,
        stock: 4
        }
    });
    expect(response.status()).toBe(403);
})