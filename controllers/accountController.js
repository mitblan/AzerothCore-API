//=============================================================================
// AzerothCoreAPI
// userController.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import cryto from 'crypto'
import { Op } from 'sequelize'
import { computeVerifier, params } from '@azerothcore/ac-nodejs-srp6'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import Account from '../models/accountModel.js'
import Character from '../models/characterModel.js'
import Command from '../models/commandModel.js'
import Access from '../models/accountLevelModel.js'

//=============================================================================
// @desc:   Get a list of all users
// @route:  GET /api/users
// @access: Private/Staff
//=============================================================================
const getUsers = asyncHandler( async ( req, res ) => { 
  const users = await Account.findAll( {
    attributes: ['id', 'username', 'email', 'reg_mail', 'online', 'totaltime']
  } )
  res.status(200).json( users )
} )

//=============================================================================
// @desc:   Get a list of all of a users characters
// @route:  GET /api/users/:id
// @access: Private/Staff
//=============================================================================
const getUserChars = asyncHandler( async ( req, res ) => { 
  // console.log('REQUEST: ', req.params.id)
  const user = await Account.findByPk( req.params.id, {attributes: {exclude: ['verifier', 'salt', 'session_token']}} )
  // console.log('USER INFO: ', req.dataValues.id)
  const chars = await Character.findAll( {
    where: { account: user.id },
  } )
  console.log(chars)
  res.status(200).json( {user, chars} )
} )

//=============================================================================
// @desc:   Login a user
// @route:  POST /api/users/login
// @access: Public
//=============================================================================
const authUser = asyncHandler( async ( req, res ) => { 
  // Destructure the request body
  const { username, password } = req.body
  
  // Find the user by email
  const user = await Account.findOne( { where: { username } } )

  // test the username and password
  const testUser = ( username, password, user ) => {
    const u = username.toUpperCase()
  const p = password.toUpperCase()
    const verifier = computeVerifier( params.constants, user.salt, u, p )
  
    if ( verifier.toString() === ( user.verifier.toString() ) ) {
    return true
  } else {
    false
  }
  }

  if ( user && testUser( username, password, user ) ) {
    const accessLevel = await Access.findOne( { where: { id: user.id } } )
    generateToken( res, user.id )
    res.json( {
      id: user.id,
      username: user.username,
      email: user.email,
      level: accessLevel.gmlevel
    })
  } else {
    res.status( 401 )
    throw new Error('Invalid email or password')
  }

} )

//=============================================================================
// @desc:   Logout a user
// @route:  POST /api/users/logout
// @access: Private
//=============================================================================
const logoutUser = asyncHandler( async ( req, res ) => { 
  // Clear the cookie
  res.cookie('azcoreInfo', null, {
    httpOnly: true,
    expires: new Date( 0 ),
  })
  res.json( { message: 'Logged out successfully' } )

} )

//=============================================================================
// @desc:   Register a new user and create a server account
// @route:  POST /api/users
// @access: Public
//=============================================================================
const registerUser = asyncHandler( async ( req, res ) => { 
  // Destructure the request body
  const { email, username, password } = req.body

  // Generate a random salt
  const salt = cryto.randomBytes( 32 )
  
  // Check if the user already exists in the database
  let userExists = await Account.findOne( { where: { [ Op.or ]: [ { username }, { reg_email } ] } } )

  // If the user or account exists, throw an error
  if ( userExists ) {
    res.status( 400 )
    throw new Error( 'Username or Email already exists.' )
  }

  // Compute the verifier
  const verifier = await computeVerifier( params.constants, salt, username.toUpperCase(), password.toUpperCase() )

  // Create the account
  const user = await Account.create( { username, salt, verifier, email, reg_mail: email } )

  // If the account is created, create the user
  if ( user ) {
      generateToken(res, user.id)
      res.status( 201 ).json( { message: 'User created successfully' } )
  } else {
    res.status( 400 )
    throw new Error( 'Invalid user data' )
  }
  
  
} )

//=============================================================================
// @desc:   Get a user's profile
// @route:  GET /api/users/profile
// @access: Private
//=============================================================================
const getProfile = asyncHandler( async ( req, res ) => { 
  // Get user info from the request including gmlevel
  // const user = req.user
  // console.log(user)

  // Get the users Account
  const account = await Account.findByPk( req.user.id, { attributes: [ 'id', 'username', 'email', 'reg_mail', 'online', 'totaltime' ] } )
  
  //get accounts access level
  const level = await Access.findOne({where: {id: account.id}})

  // Get the users characters
  const characters = await Character.findAll( { where: { account: account.id } } )

  // Get available commands
  const commands = await Command.findAll( { where: { security: { [ Op.lte ]: level } } } )

  const user = {
    id: account.id,
    username: account.username,
    email: account.email,
    reg_mail: account.reg_mail,
    online: account.online,
    totaltime: account.totaltime,
    level: level.gmlevel,
    chars: characters,
    commands: commands
  }


  // If the user and account exist, send the response
  if ( account ) {
    res.json({user})
  } else {
    res.status( 404 )
    throw new Error( 'User not found' )
  }
} )

//=============================================================================
// @desc:   Edit a user's profile
// @route:  PUT /api/users/profile
// @access: Private
//=============================================================================
const editProfile = asyncHandler( async ( req, res ) => {
  // Get user info from the request
  const user = req.user

  // get form data from the request
  const { username, email, password } = req.body

  // Get the users account
  const account = await User.findByPk( user.id )

  // If the user exists, update the account
  if ( user ) {
    user.username = username || user.username
    user.email = email || user.email
    if ( password ) {
      user.password = password
    }
    const updatedUser = await user.save()
    generateToken( res, updatedUser.id )
    res.json( {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      account_id: updatedUser.account_id,
    } )
  } else {
    res.status( 404 )
    throw new Error( 'User not found' )
  }

} )

//=============================================================================
// Export the functions
//=============================================================================
 
export { getUsers, registerUser, authUser, logoutUser, getProfile, getUserChars, editProfile}