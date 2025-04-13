//=============================================================================
// AzerothCoreAPI
// commandModel.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import { Sequelize } from 'sequelize'
import { world } from '../utils/database.js'

const Command = world.define(
	'command',
	{
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			primaryKey: true,
		},
		security: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		help: {
			type: Sequelize.STRING,
			allowNull: true,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
)

export default Command
