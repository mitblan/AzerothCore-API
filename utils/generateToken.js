//=============================================================================
// AzerothCoreAPI
// generateToken.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import jwt from 'jsonwebtoken'

const generateToken = ( res, userId ) => {
  // Generate a token
  const token = jwt.sign( { userId }, process.env.APP_SECRET, {
    expiresIn: '30d'
  } )
  
  // Set HTTP-Only cookie with token
  res.cookie( 'azcoreInfo', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
  })
  
}

export default generateToken