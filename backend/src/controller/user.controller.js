import { clerkClient, getAuth } from "@clerk/express"
import User from "../models/user.model.js"
import asyncHandler from "express-async-handler"

export const getUserProfile =   async (req, res) => {
    const {username} = req.params

    try {
        const user = await User.findOne({username})

        if (!user) return res.status(404).json({error: "User not found"})

        res.status(200).json({user})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { username, bio, avatar } = req.body;
    const {userId} = getAuth(req)
    const user = await User.findOneAndUpdate({ clerkId: userId }, { username, bio, avatar }, { new: true });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
});

export const syncUser = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req)

    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
        return res.status(200).json({ message: 'User already exists', user: existingUser });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const newUser = new User({
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        email: clerkUser.emailAddresses[0].emailAddress,
        clerkId: clerkUser.id,
        userName: clerkUser.username || `${clerkUser.firstName}${clerkUser.lastName}`.toLowerCase(),
        profilePicture: clerkUser.profileImageUrl || '',
    });
    await newUser.save();
    res.status(201).json({ message: 'User synced successfully', user: newUser });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const {userId} = getAuth(req)
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
    const { targetUserId } = req.params;
    const { userId } = getAuth(req);

    if (userId === targetUserId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findOne({ clerkId: userId });
    const targetUser = await User.findOne({ clerkId: targetUserId });

    if (!targetUser) {
        return res.status(404).json({ message: "Target user not found" });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
        // Unfollow
        await User.findByIdAndUpdate(currentUser._id, {
            $pull: { following: targetUser._id }
        });
        await User.findByIdAndUpdate(targetUser._id, {
            $pull: { followers: currentUser._id }
        });
        return res.status(200).json({ message: `Unfollowed ${targetUser._id}` });
    }
    // Follow
    await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: targetUser._id }
    });
    await User.findByIdAndUpdate(targetUser._id, {
        $push: { followers: currentUser._id }
    });

    await Notification.create({
        user: targetUser._id,
        type: 'follow',
        message: `${currentUser._id} started following you.`,
        link: `/profile/${currentUser._id}`,
    });
    res.status(200).json({ message: isFollowing ? `Unfollowed ${targetUser._id}` : `Followed ${targetUser._id}` });
});