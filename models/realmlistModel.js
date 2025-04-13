//=============================================================================
// AzerothCoreAPI
// realmlistModel.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import Sequelize from 'sequelize'
import {auth} from '../utils/database.js'

const Realmlist = auth.define(
  'realmlist',
  {
    name: {
      type: Sequelize.STRING,
			length: 32,
      unique: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false
  }
)

export default Realmlist