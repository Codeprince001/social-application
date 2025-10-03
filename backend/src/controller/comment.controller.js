import asyncHandler from 'express-async-handler';
import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import {getAuth} from "@clerk/express"


export const getCommentsByPostId = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate('user', 'username firstName lastName profilePicture');
    res.status(200).json(comments);
});

export const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = getAuth(req);

    if (!content || content.trim() === '') {
        res.status(400);
        throw new Error('Comment content cannot be empty');
    }

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const comment = new Comment({
        user: userId,
        post: postId,
        content,
    });

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    await comment.save();

    // Create a notification for the post owner if the commenter is not the post owner
    if (post.user.toString() !== userId) {
        const notification = new Notification({
            user: post.user,
            type: 'comment',
            message: `${user.userName} commented on your post.`,
            link: `/posts/${postId}`,
            post: postId,
            isRead: false,
        });
        await notification.save();
    }

    const populatedComment = await comment.populate('user', 'username firstName lastName profilePicture');

    res.status(201).json(populatedComment);
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = getAuth(req);   
    const comment = await Comment.findById(commentId);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    if (comment.user.toString() !== userId) {
        res.status(403);
        throw new Error('Not authorized to delete this comment');
    }

    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });

    await Comment.findByIdAndDelete(commentId);
    
    res.status(200).json({ message: 'Comment deleted successfully' });
});