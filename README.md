# API Boilerplate

## 🚀 Quick Start

### Installation

1. Create a new project on GitHub

2. Copy and paste the files from the Boilerplate into your project

3. Replace all `[boilerplate_name]` with your project's name

4. Install the dependencies

   ```bash
   cd api
   npm install
   cd app
   npm install
   ```

5. Create your database on Clever Cloud

   - Create a MongoDB add-on
   - Retrieve the MongoDB connection URI from the add-on information
   - Insert the URI into your `.env` file:

6. Configure Sentry

   In `api/src/services/sentry.js`, add your Sentry DSN:

   ```javascript
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: "server",
   });
   ```

7. Start the server

   ```bash
   cd api
   npm run dev
   cd app
   npm run dev
   ```

---

Write with ❤️ by Léopold
