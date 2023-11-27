import { randomUUID } from 'crypto'
import fs from 'fs'

export default class ProductManager {
  constructor(path) {
    this.path = path
  }

  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      const prod = JSON.parse(data)
      console.log(prod)
      return prod
    } else {
      return []
    }
  }

  getProductsById = async (id) => {
    const products = await this.getProducts()
    if (products.length === 0) {
      return console.log('no hay productos en el archivo')
    } else {
      const productById = products.find((p) => p.id === id)
      return productById
    }
  }

  addProducts = async (product) => {
    const products = await this.getProducts()
    const prodExists = products.find((p) => p.code === product.code)
    if (!prodExists) {
      product.id = randomUUID()
      products.push(product)
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, '\t')
      )
      return products
    }else{
      return console.log('producto ya existe')
    }
  }

  updateProducts = async (id, product) => {
    const products = await this.getProducts()
    const ProdToUpdateIndex = products.findIndex((p) => p.id === id)

    if (ProdToUpdateIndex !== -1) {
      products[ProdToUpdateIndex] = { ...product, id }
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, '\t')
      )
      return products
    } else {
      return console.log('producto no encontrado')
    }
  }

  deleteProducts = async (id) => {
    const products = await this.getProducts()
    const prodToDeleteIndex = products.findIndex((p) => p.id === id)

    if (prodToDeleteIndex === -1) {
      return console.log('producto no encontrado')
    } else {
      products.splice(prodToDeleteIndex, 1)
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, '\t')
      )
      return products
    }
  }
}
