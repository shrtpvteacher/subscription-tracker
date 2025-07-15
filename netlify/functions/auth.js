const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// In-memory storage for demo purposes
// In production, use a proper database like Supabase, MongoDB, or PostgreSQL
let users = [];
let sessions = [];

// Mock JWT token generation
function generateToken(userId) {
  return `token_${userId}_${Date.now()}`;
}

// Mock password hashing (use bcrypt in production)
function hashPassword(password) {
  return `hashed_${password}`;
}

function verifyPassword(password, hashedPassword) {
  return `hashed_${password}` === hashedPassword;
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { action, email, password, name } = JSON.parse(event.body);

    switch (action) {
      case 'register':
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'User already exists with this email',
            }),
          };
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password: hashPassword(password),
          createdAt: new Date().toISOString(),
          subscriptionStatus: 'trial',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        };

        users.push(newUser);

        // Create session
        const registerToken = generateToken(newUser.id);
        sessions.push({
          token: registerToken,
          userId: newUser.id,
          createdAt: new Date().toISOString(),
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token: registerToken,
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              subscriptionStatus: newUser.subscriptionStatus,
              trialEndsAt: newUser.trialEndsAt,
            },
          }),
        };

      case 'login':
        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Invalid email or password',
            }),
          };
        }

        // Verify password
        if (!verifyPassword(password, user.password)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Invalid email or password',
            }),
          };
        }

        // Create session
        const loginToken = generateToken(user.id);
        sessions.push({
          token: loginToken,
          userId: user.id,
          createdAt: new Date().toISOString(),
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token: loginToken,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              subscriptionStatus: user.subscriptionStatus,
              trialEndsAt: user.trialEndsAt,
            },
          }),
        };

      case 'verify':
        // Verify token (for protected routes)
        const token = event.headers.authorization?.replace('Bearer ', '');
        const session = sessions.find(s => s.token === token);
        
        if (!session) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Invalid or expired token',
            }),
          };
        }

        const sessionUser = users.find(u => u.id === session.userId);
        if (!sessionUser) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'User not found',
            }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: {
              id: sessionUser.id,
              name: sessionUser.name,
              email: sessionUser.email,
              subscriptionStatus: sessionUser.subscriptionStatus,
              trialEndsAt: sessionUser.trialEndsAt,
            },
          }),
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Invalid action',
          }),
        };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    };
  }
};