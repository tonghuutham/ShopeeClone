import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'
import Product from '../ProductList/components/Product'
import QuantityController from 'src/components/QuantityController'
import purchaseApi from 'src/apis/purchase.api'

import { purchasesStatus } from 'src/constants/purchase'
import { toast } from 'react-toastify'
import path from 'src/constants/path'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'

export default function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1)
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: ProductDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = ProductDetailData?.data.data
  // console.log(product)

  const navigation = useNavigate()

  const [curentIndexImages, setCurrentIndexImages] = useState([0, 5]) // xet slide 5 ảnh
  const [activeImage, setActiveImage] = useState('') // hover chuột vào ảnh slide thì nó sẽ active

  const imageRef = useRef<HTMLImageElement>(null)

  const { t } = useTranslation(['product'])

  const currentImages = useMemo(
    () => (product ? product.images.slice(...curentIndexImages) : []),
    [product, curentIndexImages]
  )

  const queryConfig: ProductListConfig = { limit: 20, page: 1, category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000 //3 phút   Cơ chế caching
  })

  //addToCartMutation
  const addToCartMutation = useMutation(purchaseApi.addToCart)

  // console.log(currentImages)
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  //hover vào slide ảnh thì nó active ảnh lên
  const chooseActiveImage = (img: string) => {
    setActiveImage(img)
  }

  // next image
  const nextImage = () => {
    if (curentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  // prev Image
  const prevImage = () => {
    if (curentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  //hover chuột vào ảnh thì ảnh sẽ zoom

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect() // lấy ra được chiều cao chiều rộng của thẻ dev
    // console.log(rect)

    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    const { offsetX, offsetY } = event.nativeEvent // offsetX ,offsetY là vị trí của con trỏ chuột khi hover vào ảnh
    // console.log(offsetX, offsetY)
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
    //bubble event : là khi hover vào element con thì cũng đang hover vào element cha dẫn đến hiện tượng GIẬT
    //Giải quyết : Thêm 'pointer-events-none' vào class con ngay sau cha cần hover
  }

  // khi k hover chuột nữa thì reset ảnh về vị trí ban đàu
  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  // handle số lượng mua
  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  //addToCart
  const queryClient = useQueryClient() // queryClient của main.tsx
  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 2000 }) // khi thêm vào giỏ hàng thành công thì nó sẽ hiện ra div thêm sản phẩm thành công  ,autoClose : thời gian div chạy nhanh hay chậm
          queryClient.invalidateQueries({
            queryKey: ['purchases', { status: purchasesStatus.inCart }]
          })
        }
      }
    )
  }

  //buyNow  : sang bên Cart sẽ nhận dc location và có state
  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigation(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>{product.name} | Shopee Clone</title>
        <meta
          name='description'
          content={convert(product.description, {
            limits: {
              maxBaseElements: 120
            }
          })}
        />
      </Helmet>
      <div className='container'>
        <div className='bg-white p-4 shadow '>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className='pointer-events-none absolute top-0 left-0 h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prevImage}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>

                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div
                      className='relative w-full cursor-pointer pt-[100%]'
                      key={img}
                      onMouseEnter={() => chooseActiveImage(img)}
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}

                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={nextImage}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>

            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex  items-center'>
                <div className='flex cursor-pointer items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange text-organge h-4 w-4'
                    nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span className=''>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>{t('product:Sold')}</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>đ{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>đ{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-sm font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} {t('product:OFF')}
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>{t('product:Quantity')}</div>

                {/* // QuantityController */}
                <QuantityController
                  onIncrease={handleBuyCount}
                  onDecrease={handleBuyCount}
                  onType={handleBuyCount}
                  max={product.quantity}
                  value={buyCount}
                />
                <div className='ml-6 text-sm text-gray-500'>
                  {product.quantity} {t('product:available')}
                </div>
              </div>

              {/* // Thêm vào giỏ hàng + Mua ngay */}
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-opacity-10 px-5 capitalize text-orange shadow-sm hover:bg-opacity-5'
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x='0'
                    y='0'
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit='10'
                        ></polyline>
                        <circle cx='6' cy='13.5' r='1' stroke='none'></circle>
                        <circle cx='11.5' cy='13.5' r='1' stroke='none'></circle>
                      </g>
                      <line
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit='10'
                        x1='7.5'
                        x2='10.5'
                        y1='7'
                        y2='7'
                      ></line>
                      <line
                        fill='none'
                        strokeLinecap='round'
                        strokeMiterlimit='10'
                        x1='9'
                        x2='9'
                        y1='8.5'
                        y2='5.5'
                      ></line>
                    </g>
                  </svg>
                  {t('product:AddToCart')}
                </button>
                <button
                  onClick={buyNow}
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize  text-white shadow-sm outline-none hover:bg-opacity-80'
                >
                  {t('product:BuyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MÔ TẢ SẢN PHẨM */}
      <div className='mt-8'>
        <div className='container'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg  uppercase text-slate-700'>
              {t('product:ProductDescription')}
            </div>
            <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description) //DOMPurify : cải thiện bảo mật
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* //  CÓ THỂ BẠN CŨNG THÍCH */}
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>{t('product:YOUMAYALSOLIKE')}</div>
          {productsData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
