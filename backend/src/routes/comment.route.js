import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import {createComment, deleteComment, getCommentsByPostId} from '../controller/comment.controller.js';

const router = express.Router();

router.get('/:postId', protectedRoute, getCommentsByPostId);
router.post('/:postId', protectedRoute, createComment);
router.delete('/:commentId', protectedRoute, deleteComment);

export default router;