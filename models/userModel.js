//=============================================================================
// AzerothCoreAPI
// userModel.js
// www.azerothcore.org
// Written by Mitchell Blankenship
//=============================================================================

//=============================================================================
// Dependencies
//=============================================================================
import Sequelize from 'sequelize'
import { site } from '../utils/database.js'
import bcrypt from 'bcrypt'

const User = site.define( 'user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    lenght: 32,
    unique: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
  },
  account_id: {
    type: Sequelize.INTEGER,
  },
} )

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

User.beforeSave( async ( user, options ) => {
  if ( user.changed( 'password' ) ) {
    const salt = await bcrypt.genSalt( 10 )
    user.password = await bcrypt.hash( user.password, salt )
  }
} )


export default User