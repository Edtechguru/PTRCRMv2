# Poo Tang Reefs CRM (PTRCRM)

This repository contains the full-stack architecture for the custom Poo Tang Reefs CRM application. It is structured to support a React frontend, a Node.js backend API, and a dedicated AI agent orchestration layer.

## 📁 Repository Structure

*   **/client**: Contains the Vite + React frontend application serving the custom PTRCRM interface (transplanted from `PTR-crm .jsx`).
*   **/server**: Contains the Express Node.js backend API.
*   **/agents**: Contains the AI Agent orchestration engine and subagent workspaces.

## 🚀 Getting Started

To run the application locally, you will need to start the client and server processes independently.

### Running the Frontend Client

```bash
cd client
npm install
npm run dev
```

The React development server typically starts on `http://localhost:5173` or `http://localhost:5174`.

### Running the Backend Server

```bash
cd server
npm install
node src/index.js
```

The Express API will start on `http://localhost:3001`.
