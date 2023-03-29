import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import { QueryConfig } from '../ProductList'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { category } = queryConfig
  // console.log(category, categories)

  return (
    <div className='py-4'>
      {/* Tất Cả Danh Mục */}
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-4 h-4 w-4 fill-current '>
          <g fillRule='evenodd' stroke='none' strokeWidth='1'>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z'></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất Cả Danh Mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />

      <ul className='mb-3'>
        {categories.map((categoryItem) => {
          const isActive = categoryItem._id === category
          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative flex px-2  ', {
                  'font-semibold text-orange': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-3 w-3 fill-orange '>
                    <polygon points='4 3.5 0 0 0 7'></polygon>
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Bộ lọc tìm kiếm */}
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x='0'
          y='0'
          className='mr-4 h-3 w-3  fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit='10'
            ></polyline>
          </g>
        </svg>
        Bộ Lọc Tìm Kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2'>
          <div className='flex items-start'>
            <Input
              classNameInput='w-full border border-gray-200 p-1 outline-none focus:border-gray-400 focus:shadow-sm'
              placeholder='đ Từ'
              type='text'
              className='grow'
              name='from'
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Input
              classNameInput='w-full border border-gray-200 p-1 outline-none focus:border-gray-400 focus:shadow-sm'
              placeholder='đ Đến'
              type='text'
              className='grow'
              name='to'
            />
          </div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/75'>
            Áp Dụng
          </Button>
        </form>
      </div>

      {/* Đánh giá */}
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm'>Đánh Giá</div>
      <ul className='my-3'>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 9.5 8' className='mr-1 h-4 w-4' key={index}>
                  <defs>
                    <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                      <stop offset='0' stopColor='#ffca11'></stop>
                      <stop offset='1' stopColor='#ffad27'></stop>
                    </linearGradient>
                    <polygon
                      id='ratingStar'
                      points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                    ></polygon>
                  </defs>
                  <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth='1'>
                    <g transform='translate(-876 -1270)'>
                      <g transform='translate(155 992)'>
                        <g transform='translate(600 29)'>
                          <g transform='translate(10 239)'>
                            <g transform='translate(101 10)'>
                              <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar'></use>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              ))}
            <span className='ml-1 text-center'>trở lên</span>
          </Link>
        </li>
        <li className='py-1 pl-2'>
          <Link to='' className='flex items-center text-sm'>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <svg viewBox='0 0 9.5 8' className='mr-1 h-4 w-4' key={index}>
                  <defs>
                    <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                      <stop offset='0' stopColor='#ffca11'></stop>
                      <stop offset='1' stopColor='#ffad27'></stop>
                    </linearGradient>
                    <polygon
                      id='ratingStar'
                      points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                    ></polygon>
                  </defs>
                  <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth='1'>
                    <g transform='translate(-876 -1270)'>
                      <g transform='translate(155 992)'>
                        <g transform='translate(600 29)'>
                          <g transform='translate(10 239)'>
                            <g transform='translate(101 10)'>
                              <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar'></use>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              ))}
            <span className='ml-1 text-center'>trở lên</span>
          </Link>
        </li>
      </ul>
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/75'>
        Xóa Tất Cả
      </Button>
    </div>
  )
}
