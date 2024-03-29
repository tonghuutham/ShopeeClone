import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState, useMemo, Fragment } from 'react'
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { setProfileToLS } from 'src/utils/auth'
import { getAvatarUrl, isAxiosUnprocessableEntity } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'

import InputFile from 'src/components/InputFile'
import { Helmet } from 'react-helmet-async'

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormDataProfile>()
  return (
    <Fragment>
      <Helmet>
        <title> Shopee Clone</title>
        <meta name='description' content='Đây là dự án Shopee Clone' />
      </Helmet>
      {/* Tên  */}
      <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
            placeholder='Tên'
            register={register}
            name='name'
            errorMessage={errors.name?.message}
          />
        </div>
      </div>
      {/* Số điện thoại  */}
      <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => {
              return (
                <InputNumber
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Số Điện Thoại'
                  errorMessage={errors.phone?.message}
                  {...field}
                  onChange={field.onChange}
                />
              )
            }}
          />
        </div>
      </div>
    </Fragment>
  )
}

type FormDataProfile = Pick<UserSchema, 'address' | 'name' | 'avatar' | 'date_of_birth' | 'phone'>

type FormDataError = Omit<FormDataProfile, 'date_of_birth'> & {
  date_of_birth?: string
}

const profileSchema = userSchema.pick(['name', 'address', 'avatar', 'date_of_birth', 'phone'])

// Flow :  + Nhấn upload  : không upload lên server
//         + Nhấn submit thì tiến hành upload lên server  , nếu upload thành công thì gọi api updateProfile

export default function Profile() {
  const [file, setFile] = useState<File>()

  const preview = useMemo(() => {
    // URL.createObjectURL(file) : chuyển ảnh được chọn sang url
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const { data: profileDate, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileDate?.data.data

  const updateProfileMution = useMutation(userApi.updateProfile)

  const uploadAvatarMution = useMutation(userApi.uploadAvater)

  const { setProfile } = useContext(AppContext)

  const methods = useForm<FormDataProfile>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1) // năm , tháng , ngày :  tháng bắt đầu từ tháng 0
    },
    resolver: yupResolver(profileSchema)
  })

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors }
  } = methods

  // console.log(profile)

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  //onSubmit
  const onSubmit = handleSubmit(async (data) => {
    // console.log(data)

    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file) //  Thêm image vào file
        const uploadRes = await uploadAvatarMution.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }
      const rep = await updateProfileMution.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfileToLS(rep.data.data)
      setProfile(rep.data.data)
      refetch()
      toast.success(rep.data.message, {
        autoClose: 1000
      })
    } catch (error) {
      if (isAxiosUnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  //avatar
  const avatar = watch('avatar')

  // handleChangeFile
  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      {/* Hồ Sơ Của Tôi */}
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>

      <FormProvider {...methods}>
        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            {/* Email */}
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>

            {/* Info */}
            <Info />

            {/* Đỉa chỉ */}
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Địa chỉ'
                  register={register}
                  name='address'
                  errorMessage={errors.address?.message}
                />
              </div>
            </div>
            {/* Ngày Sinh  */}
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  onChange={field.onChange}
                  value={field.value}
                  errorMessage={errors.date_of_birth?.message}
                />
              )}
            />

            {/* Lưu  */}
            <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  type='submit'
                  className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
          {/* Chọn ảnh */}
          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  // src='https://znews-photo.zingcdn.me/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg'
                  src={preview || getAvatarUrl(avatar)}
                  alt=''
                  className='h-full w-full rounded-full object-cover'
                />
              </div>

              {/* InputFile */}
              <InputFile onChange={handleChangeFile} />

              <div className='mt-3 text-gray-400'>
                <div>Dụng lượng file tối đa 1 MB</div>
                <div>Định dạng:.JPEG, .PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
