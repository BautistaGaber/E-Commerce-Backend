import CartManager from '../managers/CartManager.js'
import { Router } from 'express'

const router = Router()
const cartManager = new CartManager('./src/files/cart.json')

router.get('/', async (req, res) => {
  const cart = await cartManager.getCart()
  res.json(cart)
})

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid
  const cart = await cartManager.getCartById(cartId)
  res.json(cart)
})

router.post('/', async (req, res) => {
  const newCart = await cartManager.addCart()
  res.json(newCart)
})

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params   
    const cart = await cartManager.saveProdToCart(cid, pid)
    
    if (cart === 'Cart not found') {
      res.status(404).json({ message: 'Cart not found' })
    } else if (cart === 'Product not found') {
      res.status(404).json({ message: 'Product not found' })
    } else {
      res.json(cart)
    }
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

export { router as cartsRouter }
