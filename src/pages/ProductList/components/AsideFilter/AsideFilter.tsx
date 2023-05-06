import classNames from 'classnames'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import { useForm, Controller } from 'react-hook-form'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from 'src/types/utils.type'
import RatingStar from '../RatingStars'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

/**
- Rule validation
+ Nếu có cả price_min và price_max thì điểu kiện phải là price_min <= price_max
+ Nếu có 1 trong 2 thì luôn thỏa mãn  

-Dùng PICK : Chỉ lấy 1 số giá trị nhất định
-Dùng omit : Loại bỏ 1 số giá trị
 */

export default function AsideFilter({ queryConfig, categories }: Props) {
  const { category } = queryConfig
  // console.log(category, categories)

  const { t } = useTranslation('home')

  const {
    control,
    // watch,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })
  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  // const valueForm = watch()
  // console.log(valueForm)
  // console.log(errors)

  // handle Xóa tất cả
  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['rating_filter', 'category', 'price_min', 'price_max'])).toString()
    })
  }

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
        {t('aside filter.all categories')}
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
        {t('aside filter.filter search')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    classNameInput='w-full border border-gray-200 p-1 outline-none focus:border-gray-400 focus:shadow-sm'
                    placeholder='đ Từ'
                    classNameError='hidden'
                    type='text'
                    className='grow'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max') // trigger của react-hoock-form :xác thực đầu vào phụ thuộc vào giá trị của đầu vào khác)
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />

            {/* InputV2 : chỉ sử dụng khi dùng 'react-hook-form' */}
            {/* <InputV2
              control={control}
              name='price_min'
              classNameInput='w-full border border-gray-200 p-1 outline-none focus:border-gray-400 focus:shadow-sm'
              placeholder='đ Từ'
              classNameError='hidden'
              type='text'
              className='grow'
              onChange={() => {
                trigger('price_max') // trigger của react-hoock-form :xác thực đầu vào phụ thuộc vào giá trị của đầu vào khác)
              }}
            /> */}

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    classNameInput='w-full border border-gray-200 p-1 outline-none focus:border-gray-400 focus:shadow-sm'
                    placeholder='đ Đến'
                    type='text'
                    classNameError='hidden'
                    className='grow'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min') // trigger của react-hoock-form :xác thực đầu vào phụ thuộc vào giá trị của đầu vào khác)
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-orange '>{errors.price_min?.message}</div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/75'>
            Áp Dụng
          </Button>
        </form>
      </div>

      {/* Đánh giá */}
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm'>Đánh Giá</div>

      {/* RatingStarts   */}
      <RatingStar queryConfig={queryConfig} />

      {/* Xóa Tất Cả */}
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        onClick={handleRemoveAll}
        className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/75'
      >
        Xóa Tất Cả
      </Button>
    </div>
  )
}
