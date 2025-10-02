import express from "express"
import { followUser, getCurrentUser, getUserProfile, syncUser, updateUserProfile } from "../controller/user.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js"
const router = express.Router()

// public
router.get("/profile/:username", getUserProfile)

// protected
router.post("/sync", protectedRoute, syncUser)
router.get("/me", protectedRoute, getCurrentUser)
router.put("/profile", protectedRoute, updateUserProfile)
router.post("follow/:targetUserId", protectedRoute, followUser)

export default router