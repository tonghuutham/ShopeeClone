import React, { useContext } from 'react'
import Popover from '../Popover'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { purchasesStatus } from 'src/constants/purchase'
import { getAvatarUrl } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'

export default function NavHeader() {
  const queryClient = useQueryClient() // queryClient của main.tsx
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const { i18n } = useTranslation()
  const { t } = useTranslation('home')

  const currentLanguage = locales[i18n.language as keyof typeof locales]

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const changeLanguage = (lng: 'vi' | 'en') => {
    i18n.changeLanguage(lng)
  }
  return (
    <div className='flex justify-between'>
      <div className='flex '>
        <div className='flex cursor-pointer items-center py-1 hover:text-gray-300'>
          {t('aside filter.SellerCentre')}
        </div>
        <div className='ml-3 mt-1 flex h-4 items-center justify-center border-r-[1px] border-r-white/40' />
        <div className='ml-3 flex cursor-pointer items-center py-1 hover:text-gray-300'>
          {t('aside filter.Download')}
        </div>
        <div className='ml-3 mt-1 flex h-4 items-center justify-center border-r-[1px] border-r-white/40' />
        <div className='ml-3 flex cursor-pointer items-center py-1 hover:text-gray-300'>{t('aside filter.Follow')}</div>
      </div>
      <div className='flex'>
        <Popover
          className='flex items-center py-1 hover:cursor-pointer hover:text-gray-300'
          renderPopover={
            <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
              <div className='flex flex-col py-2 pr-28 pl-3'>
                <button className='py-2 px-3 text-left hover:text-orange' onClick={() => changeLanguage('vi')}>
                  Tiếng Việt
                </button>
                <button className='mt-2 py-2 px-3 text-left hover:text-orange' onClick={() => changeLanguage('en')}>
                  English
                </button>
              </div>
            </div>
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
            />
          </svg>
          <span className='mx-1'>{currentLanguage}</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
          </svg>
        </Popover>
        {isAuthenticated && (
          <Popover
            className='ml-6 flex items-center py-1 hover:cursor-pointer hover:text-gray-300'
            renderPopover={
              <div>
                <Link
                  to={path.profile}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Tài khoản của tôi
                </Link>
                <Link
                  to={path.historyPurchase}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Đơn hàng
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Đăng xuất
                </button>
              </div>
            }
          >
            <div className='mr-2 h-6 w-6 flex-shrink-0'>
              <img
                // src='https://znews-photo.zingcdn.me/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg'
                src={getAvatarUrl(profile?.avatar)}
                alt='avatar'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <div className=''>{profile?.name || profile?.email}</div>
          </Popover>
        )}

        {!isAuthenticated && (
          <div className='flex items-center hover:text-gray-300'>
            <Link to={path.register} className='mx-3 capitalize hover:text-white '>
              Đăng kí
            </Link>
            <div className='h-4 border-r-[1px] border-r-white/40'></div>
            <Link to={path.login} className='mx-3 capitalize hover:text-white '>
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
