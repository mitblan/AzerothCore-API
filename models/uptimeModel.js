//=============================================================================
// AzerothCoreAPI
// uptimeModel.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import Sequelize from 'sequelize'
import {auth} from '../utils/database.js'

const Uptime = auth.define(
  'uptime',
  {
    starttime: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    uptime: {
      type: Sequelize.INTEGER,
      allowNull: false,      
    },
    revision: {
      type: Sequelize.STRING,
      allowNull: false,
    }
},
  {
    freezeTableName: true,
    timestamps: false
  }
)

export default Uptime