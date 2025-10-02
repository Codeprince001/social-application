import express from 'express';
import { createPost, deletePost, getPostById, getPosts, getPostsByUsername, likePost } from '../controller/post.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Define your post routes here
router.get('/', getPosts);
router.get('/:postId', getPostById);
router.get('/user/:username', getPostsByUsername);


// protected route to create a post
router.post('/', protectedRoute, upload.single(), createPost);
router.post("/like/:postId", protectedRoute, likePost);
router.post("/delete/:postId", protectedRoute, deletePost);


export default router;
