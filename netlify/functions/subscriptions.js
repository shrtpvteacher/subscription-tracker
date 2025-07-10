const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// In-memory storage for demo purposes
// In production, use a proper database
let subscriptions = [];

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const { httpMethod, path, body } = event;
  const pathParts = path.split('/').filter(Boolean);
  const subscriptionId = pathParts[pathParts.length - 1];

  try {
    switch (httpMethod) {
      case 'GET':
        // Get all subscriptions or a specific one
        if (subscriptionId && subscriptionId !== 'subscriptions') {
          const subscription = subscriptions.find(s => s.id === subscriptionId);
          if (!subscription) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Subscription not found' }),
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(subscription),
          };
        } else {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(subscriptions),
          };
        }

      case 'POST':
        // Create new subscription
        const newSubscription = JSON.parse(body);
        newSubscription.id = Date.now().toString();
        newSubscription.createdAt = new Date().toISOString();
        newSubscription.updatedAt = new Date().toISOString();
        subscriptions.push(newSubscription);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newSubscription),
        };

      case 'PUT':
        // Update existing subscription
        const updateData = JSON.parse(body);
        const subscriptionIndex = subscriptions.findIndex(s => s.id === subscriptionId);
        
        if (subscriptionIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Subscription not found' }),
          };
        }

        subscriptions[subscriptionIndex] = {
          ...subscriptions[subscriptionIndex],
          ...updateData,
          updatedAt: new Date().toISOString(),
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(subscriptions[subscriptionIndex]),
        };

      case 'DELETE':
        // Delete subscription
        const deleteIndex = subscriptions.findIndex(s => s.id === subscriptionId);
        
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Subscription not found' }),
          };
        }

        subscriptions.splice(deleteIndex, 1);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Subscription deleted successfully' }),
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Subscriptions API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};