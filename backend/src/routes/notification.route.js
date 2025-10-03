import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notification.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getAuth } from '@clerk/express';
const router = express.Router();

// Get notifications for the authenticated user
router.get('/', getAuth(), getNotifications);
router.delete("/:notificationId", protectedRoute, deleteNotification)
// Mark a notification as read
router.put('/:notificationId/read', protectedRoute, markAsRead);