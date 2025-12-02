// app.ts
import express from 'express'
import dotenv from 'dotenv'
import { setupSwagger } from './infra/config/swagger'
import cors from 'cors'
import AuthRouter from './infra/web/routes/AuthRoutes'
import ListingRouter from './infra/web/routes/ListingRoutes'
import path from 'path'

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const listingsStoragePath = path.resolve(__dirname, '..', 'src', 'infra', 'storage', 'listings')
const profilePictureStoragePath = path.resolve(__dirname, '..', 'src', 'infra', 'storage', 'profilePictures')

app.use('/media/', express.static(listingsStoragePath))
app.use('/profile-picture/', express.static(profilePictureStoragePath))
app.use('/auth/', AuthRouter)
app.use('/listing/', ListingRouter)

setupSwagger(app)


export default app
