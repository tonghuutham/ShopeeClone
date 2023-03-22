export interface Product {
  _id: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  name: string
  decription: string
  category: {
    _id: string
    name: string
  }
  image: string
  createdAt: string
  updatedAt: string
}

export interface ProductList {
  products: [Product]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductListConfig {
  page?: number
  limit?: number
  order?: 'asc' | 'desc'
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  rating_filter?: number
  exclude?: string
  price_max?: number
  price_min?: number
  name?: string
}