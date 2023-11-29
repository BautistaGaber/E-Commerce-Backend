import express, { urlencoded } from 'express'
import  { productsRouter } from './routes/products.js'
import { cartsRouter } from './routes/carts.js'
import __dirname from './utils.js'

const PORT = 8080
const app = express()

app.use(express.json())
app.use(urlencoded({ extended: true }))

app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
})

app.use(express.static(__dirname + '/public'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)