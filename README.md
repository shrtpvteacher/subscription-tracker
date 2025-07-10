# Subscription Tracker

A beautiful, interactive subscription and bill payment tracker built with React, Radix UI Theme, and Netlify Functions. Track your subscriptions, manage payments, and never miss a due date again.

## Features

- 🎨 **Beautiful Dark UI** - Built with Radix UI Theme using olive gray and indigo accent colors
- 📊 **Dashboard Overview** - See all your subscriptions and payment status at a glance
- 🔍 **Subscription Scanner** - Automatically detect forgotten subscriptions from your accounts
- 💳 **Payment Tracking** - Track due dates, payment methods, and account information
- 🔗 **Quick Actions** - Easy cancellation links and payment marking
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔔 **Notifications** - Get notified about upcoming and overdue payments
- 👥 **Sharing** - Easy to share with family members

## Tech Stack

- **Frontend**: React, Radix UI Theme, Tailwind CSS
- **Backend**: Netlify Functions
- **Icons**: Lucide React
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Netlify account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd subscription-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys in the `.env` file (see API Setup section below).

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start Netlify Functions locally** (in a separate terminal)
   ```bash
   netlify dev
   ```

## API Setup and Integration

This application supports integration with multiple APIs for enhanced functionality. Below are the setup instructions for each service:

### 1. Plaid API (Bank Account Scanning)

**Purpose**: Scan bank accounts and credit cards for subscription charges

**Setup**:
1. Sign up at [Plaid Dashboard](https://dashboard.plaid.com/)
2. Create a new application
3. Get your `client_id` and `secret` keys
4. Add to `.env`:
   ```
   PLAID_CLIENT_ID=your_client_id
   PLAID_SECRET=your_secret_key
   PLAID_ENV=sandbox  # or 'development' or 'production'
   ```

**Frontend Integration**:
```javascript
// In your component
const scanBankAccounts = async () => {
  const response = await fetch('/.netlify/functions/scan-subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scanType: 'bank_accounts',
      credentials: { /* Plaid link token */ }
    })
  });
  const data = await response.json();
  return data.subscriptions;
};
```

### 2. Gmail API (Email Subscription Scanning)

**Purpose**: Scan email for subscription confirmations and receipts

**Setup**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add to `.env`:
   ```
   GMAIL_CLIENT_ID=your_client_id
   GMAIL_CLIENT_SECRET=your_client_secret
   ```

**Frontend Integration**:
```javascript
// In your component
const scanEmails = async () => {
  const response = await fetch('/.netlify/functions/scan-subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scanType: 'email',
      credentials: { /* OAuth token */ }
    })
  });
  const data = await response.json();
  return data.subscriptions;
};
```

### 3. Stripe API (Payment Method Management)

**Purpose**: Retrieve and manage payment methods

**Setup**:
1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your secret key from API keys section
3. Add to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   ```

**Frontend Integration**:
```javascript
// In your component
const getPaymentMethods = async () => {
  const response = await fetch('/.netlify/functions/payment-methods');
  const data = await response.json();
  return data.payment_methods;
};
```

### 4. SendGrid (Email Notifications)

**Purpose**: Send email notifications for due payments

**Setup**:
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Verify a sender email address
4. Add to `.env`:
   ```
   SENDGRID_API_KEY=your_api_key
   SENDGRID_FROM_EMAIL=your_verified_email@example.com
   ```

**Frontend Integration**:
```javascript
// In your component
const sendNotifications = async (type, subscriptions) => {
  const response = await fetch('/.netlify/functions/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      recipients: ['user@example.com'],
      subscriptions
    })
  });
  return response.json();
};
```

## Netlify Functions

The application includes several serverless functions:

### `/netlify/functions/subscriptions.js`
- **GET** `/subscriptions` - Get all subscriptions
- **POST** `/subscriptions` - Create new subscription
- **PUT** `/subscriptions/:id` - Update subscription
- **DELETE** `/subscriptions/:id` - Delete subscription

### `/netlify/functions/scan-subscriptions.js`
- **POST** `/scan-subscriptions` - Scan for hidden subscriptions

### `/netlify/functions/notifications.js`
- **POST** `/notifications` - Send email/SMS notifications

### `/netlify/functions/payment-methods.js`
- **GET** `/payment-methods` - Get user's payment methods

## Deployment to Netlify

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Add Environment Variables**
   - Go to Site settings > Environment variables
   - Add all your API keys from `.env` file

4. **Deploy**
   - Netlify will automatically deploy on every push to main branch

### Option 2: Manual Deploy

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   netlify deploy --prod --dir=dist
   ```

## Environment Variables for Production

When deploying to Netlify, add these environment variables in your site settings:

```
PLAID_CLIENT_ID=your_production_plaid_client_id
PLAID_SECRET=your_production_plaid_secret
PLAID_ENV=production
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
STRIPE_SECRET_KEY=sk_live_your_production_stripe_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_for_auth
ENCRYPTION_KEY=your_32_character_encryption_key
```

## Customization

### Adding New Subscription Categories
Edit the categories in `src/components/AddSubscriptionDialog.jsx`:

```javascript
const categories = [
  'Entertainment',
  'Software', 
  'Utilities',
  'Insurance',
  'Taxes',
  'Government',
  'Your New Category', // Add here
  'Other'
];
```

### Modifying the Theme
The app uses Radix UI Theme. You can customize colors in `src/App.jsx`:

```javascript
<Theme 
  appearance="dark" 
  grayColor="olive"     // Change base gray color
  accentColor="indigo"  // Change accent color
  radius="medium"       // Change border radius
  scaling="100%"        // Change scaling
>
```

### Adding New Notification Types
Add new notification types in `netlify/functions/notifications.js`:

```javascript
case 'your_new_type':
  message = 'Your custom notification message';
  break;
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help setting up the APIs, please open an issue on GitHub or contact the maintainers.

---

**Happy subscription tracking! 🎉**