import fs from 'fs'
import getProductsById from '../managers/ProductManagers.js'
import { randomUUID } from 'crypto'
import ProductManager from '../managers/ProductManagers.js'

const productManager = new ProductManager('./src/files/products.json')

export default class CartManager {
  constructor(path) {
    this.path = path
  }

  getCart = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const cart = JSON.parse(data)
      return cart
    } else {
      return []
    }
  }

  getCartById = async (id) => {
    const cart = await this.getCart()
    if (cart.length === 0) {
      return console.log('no hay productos en el carrito')
    } else {
      const cartById = cart.find((c) => c.id === id)
      return cartById
    }
  }

  addCart = async () => {
    const cart = await this.getCart()
    const newCart = { id: randomUUID(), products: [] }

    cart.push(newCart)
    await fs.promises.writeFile(this.path, JSON.stringify(cart, null, '\t'))
    return newCart
  }

  saveProdToCart = async (cid, pid) => {
    const gCart = await this.getCart()
    console.log(gCart)

    try {
      let cartIndex = await gCart.findIndex((c) => c.id === cid)
      console.log(cartIndex)

      if (cartIndex === -1) {
        return console.log('Cart not found')
      }
      const prodExist = await productManager.getProductsById(pid)
      if (prodExist === undefined) {
        console.log('Product not found')
      }

      const cart = gCart[cartIndex]
      if (cart && cart.products) {
        const prodIndex = cart.products.findIndex((p) => p.id === pid)

        if (prodIndex !== -1) {
          cart.products[prodIndex].quantity++
        } else {
          const newProd = {
            id: pid,
            quantity: 1,
          }
          cart.products.push(newProd)
        }
      }

      await fs.promises.writeFile(this.path, JSON.stringify(gCart, null, '\t'))
      return cart
    } catch (error) {
      console.log(error)
    }
  }
}
