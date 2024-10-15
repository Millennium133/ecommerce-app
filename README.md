# E-commerce App

This is a monorepo for an e-commerce application with a minimalistic theme. It includes:

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: [React or Next.js] with a minimal design theme

## Directory Structure

- `backend/`: Contains all backend code, including routes, models, and tests.
- `frontend/`: Contains all frontend code, including components, pages, and styles.
- `.github/`: GitHub Actions workflows for CI/CD.

## Getting Started

### Backend Setup

1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `npm run start`

### Frontend Setup

1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### ngrok setup

After both server have been started: `ngrok http ${your own ip address}:${frontend port}`

### Facebook Developer Console Setup

1. Go to facebook developer console: `https://developers.facebook.com/`
2. First, go to "APP SETTINGS" on the left side of the app.
3. Second, choose the option "Basic" and add the ngrok forwarding ip address inside the "APP DOMAINS" field -> For example: `https://eed1-49-228-105-124.ngrok-free.app`
4. Third, go to "Use Cases" on the left side of the app.
5. Fourth, click "customize" button for the Facebook login
6. Fifth, choose the option "Settings" and add the ngrok forwarding ip address inside the "Allowed Domains for the JavaScript SDK" field -> For example: `https://eed1-49-228-105-124.ngrok-free.app`

### Google Cloud Console Setup

1. Go to Google Cloud Console: `https://console.cloud.google.com/`
2. First, go to your project.
3. Second, choose the option "APIS and services" and click "CREDENTIALS".
4. Third, find your project in "OAuth 2.0 Client IDs" section" and click it.
5. Fourth, add the URI that is got from ngrok in both "Authorised JavaScript origins" and "Authorised
   redirect URIs"

### Nginx Setup

1. sudo systemctl start nginx
2. pm2 start server.js -i max --name express-app
3. Whenever the file is changed, run sudo systemctl reload nginx

## Contributing

Please follow the [contribution guidelines](CONTRIBUTING.md) for this project.
