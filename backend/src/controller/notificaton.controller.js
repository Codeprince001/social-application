import Notification from "../models/notification.model.js";
import expressAsyncHandler from "express-async-handler";

export const getNotifications = expressAsyncHandler(async (req, res) => {
    const userId = req.auth.userId;
    const notifications = await Notification.find({ to: userId }).sort({ createdAt: -1 }).populate('from', 'username avatarUrl').populate('post', 'image caption').populate('comment', 'content').populate('like');
    res.json(notifications);
});

export const markAsRead = expressAsyncHandler(async (req, res) => {
    const userId = req.auth.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({ _id: notificationId, to: userId });
    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
});

export const deleteNotification = expressAsyncHandler(async (req, res) => {
    const userId = req.auth.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({ _id: notificationId, to: userId });
    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    await notification.remove();
    res.json({ message: 'Notification deleted' });
});

