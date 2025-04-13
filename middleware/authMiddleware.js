//=============================================================================
// AzerothCoreAPI
// authMiddleware.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import Account from '../models/accountModel.js';
import dotenv from 'dotenv'
import Access from '../models/accountLevelModel.js'
dotenv.config()

//=============================================================================
// User must be authenticated
//=============================================================================
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'azcoreInfo' cookie
  token = req.cookies.azcoreInfo;

  if (token) {
    try {
      const decoded = jwt.verify( token, process.env.APP_SECRET );

      req.user = await Account.findByPk( decoded.userId, { attributes: { exclude: [ 'salt', 'verifier' ] } } )
      
      const gmLevel = await Access.findByPk( req.user.id, { attributes: { exclude: [ 'id' ] } } )
      if ( gmLevel === null ) {
        req.user.dataValues.gmlevel = 0
      } else {
        req.user.dataValues.gmlevel = gmLevel.gmlevel
      }
      

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

//=============================================================================
// User must be gmlevel 1 or greater
//=============================================================================
const gm1 = ( req, res, next ) => {
  console.log(req.user)
  if(req.user && req.user.dataValues.gmlevel >= 1) {
    next();
  } else {
    res.status( 401 );
    throw new Error( 'Not authorized as a Apprentice GM' );
  }
}

//=============================================================================
// User must be gmlevel 2 or greater
//=============================================================================
const gm2 = ( req, res, next ) => {
  if(req.user && req.user.dataValues.gmlevel >= 2) {
    next();
  } else {
    res.status( 401 );
    throw new Error( 'Not authorized as a Senior GM' );
  }
}

//=============================================================================
// User must be gmlevel 3 or greater
//=============================================================================
const gm3 = ( req, res, next ) => {
  if(req.user && req.user.dataValues.gmlevel >= 3) {
    next();
  } else {
    res.status( 401 );
    throw new Error( 'Not authorized as a Lead GM' );
  }
}

//=============================================================================
// User must be gmlevel 4 or greater
//=============================================================================
const gm4 = ( req, res, next ) => {
  if(req.user && req.user.dataValues.gmlevel >= 4) {
    next();
  } else {
    res.status( 401 );
    throw new Error( 'Not authorized as a Server Admin' );
  }
}

export { protect, gm1, gm2, gm3, gm4 };
