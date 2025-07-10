const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Mock payment methods retrieval
    // In a real implementation, this would:
    // 1. Connect to Stripe API to get customer payment methods
    // 2. Connect to bank APIs to get account information
    // 3. Retrieve stored payment method data from database

    const mockPaymentMethods = [
      {
        id: 'pm_1',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '5678',
          exp_month: 12,
          exp_year: 2025,
        },
        billing_details: {
          name: 'John Doe',
        },
        created: new Date().toISOString(),
      },
      {
        id: 'pm_2',
        type: 'card',
        card: {
          brand: 'mastercard',
          last4: '1234',
          exp_month: 8,
          exp_year: 2026,
        },
        billing_details: {
          name: 'Jane Doe',
        },
        created: new Date().toISOString(),
      },
      {
        id: 'pm_3',
        type: 'bank_account',
        bank_account: {
          bank_name: 'Chase Bank',
          last4: '9876',
          account_type: 'checking',
        },
        billing_details: {
          name: 'John & Jane Doe',
        },
        created: new Date().toISOString(),
      },
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        payment_methods: mockPaymentMethods,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Payment methods error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to retrieve payment methods',
        message: error.message,
      }),
    };
  }
};