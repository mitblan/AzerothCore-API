import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 7000

app.use( express.json() )
app.use( express.urlencoded( { extended: true } ) )
app.use( cookieParser() )

app.use('/api/users', userRoutes)

app.get( '/', ( req, res ) => {
  res.json({message: 'Welcome to Azerothcore-API'})
} )

app.listen( port, () => {
  console.log(`Server listening on port ${port}`)
})