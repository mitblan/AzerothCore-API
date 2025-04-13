//=============================================================================
// AzerothCoreAPI
// database.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import Sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const auth = new Sequelize(process.env.AUTH_DB)

const chars = new Sequelize(process.env.CHAR_DB)

const world = new Sequelize(process.env.WORLD_DB)

const site = new Sequelize( process.env.SITE_DB)

export {
	auth,
	chars,
	world,
	site
}
