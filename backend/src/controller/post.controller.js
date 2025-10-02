import asyncHandler from 'express-async-handler';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { getAuth } from '@clerk/express';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/upload.middleware.js';


export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('user', 'username firstName lastName profilePicture')
    .sort({ createdAt: -1 })
    .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username firstName lastName profilePicture' }
    })
    .exec();

  res.status(200).json(posts);
});

export const getPostById = asyncHandler(async (req, res) => {
    const {postId} = req.params;
    const post = await Post.findById(postId)
      .populate('user', 'username firstName lastName profilePicture')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username firstName lastName profilePicture' }
      })
      .exec();

      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      res.status(200).json(post);
});

export const getPostsByUsername = asyncHandler(async (req, res) => {
    const {username} = req.params;
    const user = await User.findOne({username}).exec();
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const posts = await Post.find({ user: user._id })
        .populate('user', 'username firstName lastName profilePicture')
        .sort({ createdAt: -1 })
        .populate({
            path: 'comments',
            populate: { path: 'user', select: 'username firstName lastName profilePicture' }
        })
        .exec();
    res.status(200).json(posts);
});

export const createPost = asyncHandler(async (req, res) => {
  const {userId} = getAuth(req);
  const { content} = req.body;
  const image = req.file
  if (!content) {
    res.status(400);
    throw new Error('Content is required');
  }

    const user = await User.findOne({clerkId: userId}).exec();
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    let imageUrl = null;
    let uploadresponse = {};
    if (image) {
        try {
            const base64Image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
            imageUrl = base64Image; 
            uploadresponse = await cloudinary.uploader.upload(imageUrl, {
                folder: 'social_app_posts',
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    {quality: 'auto'},
                    { fetch_format: 'auto' }
                ]
             });
        } catch (uploadError) {
            res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
            return;
        }

    }

    const createdPost = await Post.create({
        user: user._id,
        content,
        image: uploadresponse.secure_url || null
    })

    user.posts.push(createdPost._id);
    await user.save();

    res.status(201).json({message: 'Post created successfully', post: createdPost});
    
});

export const likePost = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);
    const {postId} = req.params;

    const user = await User.findOne({clerkId: userId}).exec();
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    const post = await Post.findById(postId).exec();
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const alreadyLiked = post.likes.includes(user._id);

    if (alreadyLiked) {
        post.likes.pull(user._id);
        await post.save();
        res.status(200).json({message: 'Post unliked'});
    } else {
        post.likes.push(user._id);
        await post.save();
        res.status(200).json({message: 'Post liked'});
    }

    // TODO: Add notification to post owner if someone likes their post
    if (!alreadyLiked && post.user.toString() !== user._id.toString()) {
        // Create notification
        await Notification.create({
            from: user._id,
            to: post.user,
            type: 'like',
            post: post._id,
            message: `${user.userName} liked your post`
        });
    }

});

export const deletePost = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req);
    const {postId} = req.params;

    const user = await User.findOne({clerkId: userId}).exec();
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    if (post.user.toString() !== user._id.toString()) {
        res.status(403);
        throw new Error('You are not authorized to delete this post');
    }

    await Comment.deleteMany({ _id: { $in: post.comments } }).exec();

    await Post.findByIdAndDelete(postId).exec();

    user.posts.pull(post._id);
    await user.save();

    res.status(200).json({message: 'Post deleted successfully'});
});