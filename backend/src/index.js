import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {clerkMiddleware} from '@clerk/express';

import { errorHandler } from './middleware/error.middleware.js';
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import commentRoute from "./routes/comment.route.js"
import notificationRoute from "./routes/notification.route.js"
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(arcjetMiddleware)

connectDB()


app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/notifications", notificationRoute)
app.use("/api/comments", commentRoute)

app.use(errorHandler)

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});