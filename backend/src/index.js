import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {clerkMiddleware} from '@clerk/express';

import { errorHandler } from './middleware/error.middleware.js';
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

connectDB()


app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)

app.use(errorHandler)

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});