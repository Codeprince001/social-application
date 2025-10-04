import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controller/notificaton.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get notifications for the authenticated user
router.get('/', protectedRoute, getNotifications);
router.delete("/:notificationId", protectedRoute, deleteNotification)
// Mark a notification as read
router.put('/:notificationId/read', protectedRoute, markAsRead);

export default router