import { createSearchParams, useNavigate } from 'react-router-dom'
import { QueryConfig } from '../../ProductList'
import path from 'src/constants/path'

/**
 * index 0 : Có 5 cái màu vàng tương ứng từ indexStart 0 -4 đều màu vàng
 * index 1 : Có 4 cái màu vàng tương ứng từ indexStart 0 -3 đều màu vàng
 * index 2 : Có 3 cái màu vàng tương ứng từ indexStart 0 -2 đều màu vàng
 * index 3 : Có 2 cái màu vàng tương ứng từ indexStart 0 -1 đều màu vàng
 * index 4 : Có 1 cái màu vàng tương ứng từ indexStart 0  đều màu vàng
 * 
 * Chúng ta nhận ra là indexStart < 5 - index
 
 */

interface Props {
  queryConfig: QueryConfig
}

export default function RatingStar({ queryConfig }: Props) {
  const navigate = useNavigate()

  const handleFitleStart = (ratingFilter: number) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        rating_filter: String(ratingFilter)
      }).toString()
    })
  }
  return (
    <ul className='my-3'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <li className='py-1 pl-2' key={index}>
            <div
              className='flex cursor-pointer items-center text-sm'
              onClick={() => handleFitleStart(5 - index)}
              aria-hidden='true'
            >
              {Array(5)
                .fill(0)
                .map((_, indexStart) => {
                  if (indexStart < 5 - index) {
                    return (
                      <svg viewBox='0 0 9.5 8' className='mr-1 h-4 w-4' key={indexStart}>
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
                    )
                  }
                  return (
                    <svg viewBox='0 0 30 30' className='mr-1 h-4 w-4' key={indexStart}>
                      <defs>
                        <linearGradient id='star__hollow' x1='50%' x2='50%' y1='0%' y2='99.0177926%'>
                          <stop offset='0%' stopColor='#FFD211'></stop>
                          <stop offset='100%' stopColor='#FFAD27'></stop>
                        </linearGradient>
                      </defs>
                      <path
                        fill='none'
                        fillRule='evenodd'
                        stroke='url(#star__hollow)'
                        strokeWidth='2'
                        d='M23.226809 28.390899l-1.543364-9.5505903 6.600997-6.8291523-9.116272-1.4059447-4.01304-8.63019038-4.013041 8.63019038-9.116271 1.4059447 6.600997 6.8291523-1.543364 9.5505903 8.071679-4.5038874 8.071679 4.5038874z'
                      ></path>
                    </svg>
                  )
                })}
              {index !== 0 && <span className='ml-1 text-center'>trở lên</span>}
            </div>
          </li>
        ))}
    </ul>
  )
}
