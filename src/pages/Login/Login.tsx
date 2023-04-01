import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/components/Input'
import { useForm } from 'react-hook-form'

import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate() // chuyển trang
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  // React Query có hook useMutation mà bạn có thể sử dụng để cập nhật / tạo / xóa dữ liệu.
  //useMutation cung cấp cho bạn quyền truy cập vào hàm mutate mà chúng ta có thể chuyển các đối số cần thiết.
  //Sau đó nó trả về thông tin về trạng thái của lệnh gọi API của chúng ta.
  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/') // login xong thì chuyển qua trang home
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)) {
          const formError = error?.response?.data.data
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError?.password) {
            setError('email', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })

  // const value = watch()
  // console.log(value)

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng nhập</div>

              {/* <div className='mt-8'>
                <input
                  type='email'
                  name='email'
                  className='w-full border border-gray-200 p-3 outline-none focus:border-gray-400 focus:shadow-sm'
                  placeholder='Email'
                />
                <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>Email không hợp lệ</div>
              </div> */}
              <Input
                className='mt-8'
                type='email'
                placeholder='Email'
                register={register}
                name='email'
                errorMessage={errors.email?.message}
              />

              {/* <div className='mt-2'>
                <input
                  type='password'
                  autoComplete='on'
                  name='password'
                  className='w-full border border-gray-200 p-3 outline-none focus:border-gray-400 focus:shadow-sm'
                  placeholder='Password'
                />
                <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'></div>
              </div> */}
              <Input
                className='mt-2'
                type='password'
                placeholder='Password'
                register={register}
                name='password'
                errorMessage={errors.password?.message}
              />
              <div className='mt-2'>
                <Button
                  className='flex  w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>

              <div className='mt-8 flex items-center justify-center'>
                <span className='text-slate-400'>Bạn mới biết đến Shopee ? </span>
                <Link to={path.register} className='text-red-400'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
