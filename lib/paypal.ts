const base = process.env.PAYPAL_API_URL || 'https://sandbox.paypal.com';

export const paypal = {
  createOrder: async function createOrder(totalPrice: number) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: totalPrice.toFixed(2),
            },
          },
        ],
      }),
    })
    return handleResponse(response);
  },

  capturePayment: async function capturePayment(orderId: string) {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders/${orderId}/capture`;
      const response = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return handleResponse(response);
  }
};

async function generateAccessToken() {
    const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

    console.log('=== PayPal Debug Info ===');
    console.log('PAYPAL_CLIENT_ID:', PAYPAL_CLIENT_ID ? 'EXISTS' : 'MISSING');
    console.log('PAYPAL_APP_SECRET:', PAYPAL_APP_SECRET ? 'EXISTS' : 'MISSING');
    console.log('Client ID length:', PAYPAL_CLIENT_ID?.length || 0);
    console.log('App Secret length:', PAYPAL_APP_SECRET?.length || 0);
    console.log('Client ID starts with:', PAYPAL_CLIENT_ID?.substring(0, 10) + '...');
    console.log('App Secret starts with:', PAYPAL_APP_SECRET?.substring(0, 10) + '...');
    console.log('========================');

    if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
        throw new Error('Missing PayPal client ID or app secret in environment variables.');
    }

    const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString('base64');

    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: 'post',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,        
      }, 
});

const jsonData = await handleResponse(response);
return jsonData.access_token;
}
async function handleResponse(response: Response) {
    console.log('PayPal Response Status:', response.status);
    console.log('PayPal Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 200 || response.status === 201) {
        return response.json();
    };

    const errorMessage = await response.text();
    console.error('PayPal Error Response:', errorMessage);
    throw new Error(errorMessage);
}

