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

### ngrok and facebook developer console setup

1. After both server have been started: `ngrok http ${your own ip address}:${frontend port}`
2. Go to facebook developer console: `https://developers.facebook.com/`
3. First, go to app settings on the left side of the app.
4. Second, choose the option "Basic" and add the ngrok forwarding ip address inside the "APP DOMAINS" field -> For example: `https://eed1-49-228-105-124.ngrok-free.app`
5. Third, go to "Use Cases" on the left side of the app.
6. Fourth, click "customize" button for the Facebook login
7. Fifth, choose the option "Settings" and add the ngrok forwarding ip address inside the "Allowed Domains for the JavaScript SDK" field -> For example: `https://eed1-49-228-105-124.ngrok-free.app`

## Contributing

Please follow the [contribution guidelines](CONTRIBUTING.md) for this project.
