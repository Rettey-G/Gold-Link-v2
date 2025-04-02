# Gold Link International

A comprehensive quotation and invoice management system for Gold Link International.

## Features

- Quotation Management
- Invoice Generation
- Price List Management
- Sales Tracking
- PDF Export
- Resort Database

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gold-link.git
cd gold-link
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string in `.env`

4. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Environment Variables

Required environment variables in your `.env` file:
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 3000)

## Deployment

This project is configured for deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Add the environment variables in Netlify's dashboard
3. Deploy! The `netlify.toml` file handles all the configuration

## Tech Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- PDF Generation: PDFKit
- Deployment: Netlify

## License

ISC License