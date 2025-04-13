//===================================================================
// AzerothCoreAPI
// userRoutes.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//===================================================================

//===================================================================
// Dependencies
//===================================================================
import express from 'express'
import { getUsers, registerUser, authUser, logoutUser, getProfile, getUserChars, editProfile } from '../controllers/accountController.js'
import { protect, gm1, gm2, gm3, gm4 } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route( '/' ).get( protect, gm1, getUsers ).post( registerUser )
router.post( '/login', authUser )
router.post( '/logout', protect, logoutUser )
router.get( '/profile', protect, getProfile )
router.get( '/:id', protect, gm1, getUserChars).put('/profile', protect, editProfile)

export default router