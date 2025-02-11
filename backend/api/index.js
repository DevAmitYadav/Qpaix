import app from "../app.js";
import { createServer } from "@vercel/node";

// Export the app as a serverless function
export default createServer(app);
