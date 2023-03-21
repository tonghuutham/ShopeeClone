import React from 'react'
import { Link } from 'react-router-dom'

export default function Product() {
  return (
    <Link to=''>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.0625rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src='https://down-vn.img.susercontent.com/file/756c3dcdb55872c7c9787516162c9447_tn'
            alt='Áo'
            className='absolute top-0 left-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          {/* Title  */}
          <div className='min-h-[2rem] text-xs line-clamp-2'>
            Áo Sweater Nam Form Rộng Phối Layer Chất Nỉ Unisex Thời Trang Trẻ Trung VESCA M10
          </div>
          {/* Giá bán */}
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className=''>199.000</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span className=''>99.000</span>
            </div>
          </div>
          {/* Đánh giá theo sao */}
          <div className='mt-3 flex items-center'>
            {/* Sao  */}
            <div className='flex items-center'>
              <div className='relative'>
                <div className='absolute top-0 left-0 h-full overflow-hidden' style={{ width: '50%' }}>
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x='0'
                    y='0'
                    className='h-3 w-3 fill-yellow-300 text-yellow-300'
                  >
                    <polygon
                      points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeMiterlimit='10'
                    ></polygon>
                  </svg>
                </div>
                <svg
                  enableBackground='new 0 0 15 15'
                  viewBox='0 0 15 15'
                  x='0'
                  y='0'
                  className='h-3 w-3 fill-current text-gray-300'
                >
                  <polygon
                    points='7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeMiterlimit='10'
                  ></polygon>
                </svg>
              </div>
            </div>

            {/* Đã bán  */}
            <div className='ml-2 text-sm'>
              <span className=''>Đã bán</span>
              <span className='ml-1'>2.45k</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
