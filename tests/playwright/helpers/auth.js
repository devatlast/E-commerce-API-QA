export async function login(request, email, password ) {
    const response = await request.post('https://e-commerce-api-qa.vercel.app/login', {
        data: {
            email,
            password
        }
    });
    const body = await response.json();
    return body;
}