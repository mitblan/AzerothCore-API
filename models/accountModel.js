//=============================================================================
// AzerothCoreAPI
// accountModel.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import { Sequelize } from 'sequelize'
import { auth } from '../utils/database.js'

const Account = auth.define(
	'account',
	{
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: Sequelize.STRING,
			length: 32,
			unique: true,
			allowNull: false,
		},
		salt: {
			type: Sequelize.STRING,
			binary: true,
			lenght: 32,
			allowNull: false,
		},
		verifier: {
			type: Sequelize.STRING,
			binary: true,
			length: 32,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		reg_mail: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		online: {
			type: Sequelize.INTEGER,
			default: 0,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default Account
