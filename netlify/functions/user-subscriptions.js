const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// In-memory storage for demo purposes
// In production, use a proper database with proper user isolation
let userSubscriptions = {}; // { userId: [subscriptions] }

// Mock function to verify user token
async function verifyUser(token) {
  // In production, verify JWT token and get user info
  // For demo, we'll extract user ID from token
  if (!token) return null;
  
  const userId = token.split('_')[1]; // Extract from mock token format
  return { id: userId };
}

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Verify user authentication
    const token = event.headers.authorization?.replace('Bearer ', '');
    const user = await verifyUser(token);
    
    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const userId = user.id;
    const { httpMethod, body } = event;
    const pathParts = event.path.split('/').filter(Boolean);
    const subscriptionId = pathParts[pathParts.length - 1];

    // Initialize user subscriptions if not exists
    if (!userSubscriptions[userId]) {
      userSubscriptions[userId] = [];
    }

    switch (httpMethod) {
      case 'GET':
        // Get all subscriptions for the user
        if (subscriptionId && subscriptionId !== 'user-subscriptions') {
          const subscription = userSubscriptions[userId].find(s => s.id === subscriptionId);
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
            body: JSON.stringify(userSubscriptions[userId] || []),
          };
        }

      case 'POST':
        // Create new subscription for the user
        const newSubscription = JSON.parse(body);
        newSubscription.id = Date.now().toString();
        newSubscription.userId = userId;
        newSubscription.createdAt = new Date().toISOString();
        newSubscription.updatedAt = new Date().toISOString();
        
        userSubscriptions[userId].push(newSubscription);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newSubscription),
        };

      case 'PUT':
        // Update existing subscription
        const updateData = JSON.parse(body);
        const subscriptionIndex = userSubscriptions[userId].findIndex(s => s.id === subscriptionId);
        
        if (subscriptionIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Subscription not found' }),
          };
        }

        userSubscriptions[userId][subscriptionIndex] = {
          ...userSubscriptions[userId][subscriptionIndex],
          ...updateData,
          updatedAt: new Date().toISOString(),
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(userSubscriptions[userId][subscriptionIndex]),
        };

      case 'DELETE':
        // Delete subscription
        const deleteIndex = userSubscriptions[userId].findIndex(s => s.id === subscriptionId);
        
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Subscription not found' }),
          };
        }

        userSubscriptions[userId].splice(deleteIndex, 1);

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
    console.error('User subscriptions API error:', error);
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