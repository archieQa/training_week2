import React, { Fragment, useEffect, useState } from 'react'
import { HiUsers } from 'react-icons/hi'
import { MdEvent } from 'react-icons/md'
import { MdEmail } from 'react-icons/md'
import { PiShieldStarFill } from 'react-icons/pi'
import { FaWallet } from 'react-icons/fa6'
import { BsFillChatLeftTextFill, BsCashCoin } from 'react-icons/bs'
import { NavLink, Link, useHistory } from 'react-router-dom'
import { IoMdClose } from 'react-icons/io'
import { IoMenuOutline } from 'react-icons/io5'
import { Menu, Transition, Dialog, Listbox } from '@headlessui/react'
import { ChevronRight } from 'lucide-react'
import { GoChevronDown } from 'react-icons/go'
import { useTranslation } from 'react-i18next'

import TopImage from '@/assets/sidebar.png'
import { TifoLogo } from '@/assets/tifo-logo'
import store from '@/store'
import API from '@/services/api'

const navigation = [
  { name: 'Tableau de bord', href: '/', exact: true, icon: TifoLogo },
  { name: 'Membres', href: '/members', icon: HiUsers },
]

const DrawerDesktop = ({ onMobile }) => {
  const [organizations, setOrganizations] = useState([])
  const { user, setUser } = store()
  const { organization, setOrganization } = store()

  const history = useHistory()

  useEffect(() => {
    getOrganizations()
  }, [])

  const handleLogout = async () => {
    try {
      const res = await API.post(`/user/logout`)
      if (!res.ok) throw new Error('Something went wrong')
      setUser(null)
    } catch (error) {
      console.log(error)
    }
  }



  const getOrganizations = async () => {
    try {
      const { data, ok } = await API.post(`/membership_orga/search`, {
        user_id: user._id
      })
      if (!ok) throw new Error('Something went wrong')
      setOrganizations(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <aside
      className={`${
        onMobile ? 'w-full bg-white flex flex-col' : 'lg:flex hidden w-[256px] sticky flex-shrink-0 flex-col ease-in-out duration-300 h-screen inset-y-0 border-r'
      } overflow-y-auto`}
    >
      <div className='relative mb-12'>
        <img src={TopImage} className='w-full' />
        <div className='w-[96px] h-[96px] rounded-full bg-white absolute -bottom-12 left-1/2 -translate-x-1/2 border flex items-center justify-center'>Logo</div>
      </div>

      <div className='flex flex-col items-center justify-center text-center mb-2 py-3'>
        <Listbox value={organization} onChange={setOrganization}>
          <div className='relative mt-1 w-4/5'>
            <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left ocus:outline-none focus-visible:border-indigo-500 sm:text-sm'>
              <span className='block truncate'>{organization?.organization_name || 'Sélectionner une organisation'}</span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <GoChevronDown />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
              <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm text-left z-20'>
                {organizations?.map(org => (
                  <Listbox.Option key={org._id} className='relative cursor-default select-none py-2 px-4 hover:bg-light-primary/10' value={org}>
                    <span className='block truncate font-normal'>{org.organization_name}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <span className='text-gray-500 text-sm'>Admin</span>
      </div>

      <div className='w-[90%] h-px bg-light-border my-2 mx-auto' />

      <nav className='flex-1 mb-5'>
        <ul className='space-y-2'>
          {navigation.map(item => (
            <li className='py-2 px-5 relative' key={item.name}>
              <NavLink
                exact={item.exact}
                to={item.href}
                className='flex items-center gap-x-3 transition-colors hover:text-primary group'
                activeClassName='text-primary [&>span]:!opacity-100 [&>svg]:!text-primary'
              >
                <item.icon className='w-[24px] h-[24px] shrink-0 text-light-color group-hover:text-primary' />
                {item.name}
                <span className='absolute left-0 h-full w-1 bg-light-primary rounded-r-full opacity-0 transition-opacity' />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {!onMobile && (
          <Menu as='div' className='relative flex justify-center'>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute w-[90%] shadow-md top-[-80px] rounded-md bg-white ring-1 ring-gray-900/5 focus:outline-none'>
                <Menu.Item>
                  {({ active }) => (
                    <Link to='/account' className={`${active ? 'bg-gray-50' : ''} block px-4 py-2 text-sm leading-6 text-gray-900 w-full`}>
                      My account
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button onClick={handleLogout} className={`${active ? 'bg-gray-50' : ''} block px-4 py-2 text-sm leading-6 text-gray-900 w-full text-left`}>
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
            <Menu.Button className='px-4 py-2 flex items-center justify-between w-full'>
              <div className='flex items-center gap-x-2 flex-1'>
                <img className='w-8 h-8 rounded-full' alt={user.email} src={user.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} />
                <p className='text-gray-900'>{user.name || 'Charles'}</p>
              </div>
              <ChevronRight size={24} className='text-gray-300' />
            </Menu.Button>
          </Menu>
        )}
        <div className='bg-light-primary p-4 space-y-3'>
          <p className='text-light-primary-100 text-sm font-medium'>Contacter Tifo</p>

          <div className='space-y-2'>
            <Link to='/' className='flex items-center gap-x-3 text-white'>
              <div className='w-8 h-8 rounded-lg bg-light-primary-400 grid place-items-center'>
                <BsFillChatLeftTextFill size={20} />
              </div>
              <p onClick={handleChatClick} className='text-sm font-medium'>
                {t('navigation.menu.useChat')}
              </p>
            </Link>
            <Link to='/' className='flex items-center gap-x-3 text-white'>
              <div className='w-8 h-8 rounded-lg bg-light-primary-400 grid place-items-center'>
                <MdEmail size={20} />
              </div>
              <p className='text-sm font-medium'>Envoyer un mail</p>
            </Link>
          </div>

          <div className='flex items-center gap-x-2'>
            <button
              className={`text-sm font-medium text-primary-light bg-white py-2 px-6 rounded-lg gap-x-2 flex-1 shrink-0 ${onMobile && 'text-center'}`}
              onClick={() => {
                window.open('https://tifohelp.zendesk.com', '_blank')?.focus()
              }}
            >
              {t('navigation.menu.helpCenter')}
            </button>

          </div>
        </div>
        <Zendesk defer zendeskKey={ZENDESK_KEY} onLoaded={handleLoaded} />
      </div>
    </aside>
  )
}

const DrawerMobile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, setUser } = store()

  const handleLogout = async () => {
    try {
      const res = await API.post(`/user/logout`)
      if (!res.ok) throw new Error('Something went wrong')
      setUser(null)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='flex lg:hidden items-center justify-between border-b py-3 px-5'>
      <button onClick={() => setSidebarOpen(true)}>
        <IoMenuOutline size={24} />
      </button>
      <Menu as='div' className='relative flex items-center'>
        <Menu.Button>
          <img className='w-8 h-8 rounded-full' alt={user.email} src={'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' || user.avatar} />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='absolute shadow-lg top-full right-0 origin-top-right z-10 w-32 rounded-md bg-white py-2 ring-1 ring-gray-900/5 focus:outline-none'>
            <Menu.Item>
              {({ active }) => (
                <Link to='/account' className={`${active ? 'bg-gray-50' : ''} block px-3 py-1 text-sm leading-6 text-gray-900 w-full`}>
                  My account
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button onClick={handleLogout} className={`${active ? 'bg-gray-50' : ''} block px-3 py-1 text-sm leading-6 text-gray-900 w-full text-left`}>
                  Sign out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50 lg:hidden' onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-900/80' />
          </Transition.Child>

          <div className='fixed inset-0 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute left-full top-0 flex w-16 justify-center pt-5 text-white'>
                    <button type='button' className='-m-2.5 p-2.5' onClick={() => setSidebarOpen(false)}>
                      <IoMdClose />
                    </button>
                  </div>
                </Transition.Child>
                <DrawerDesktop onMobile />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

const Drawer = () => {
  return (
    <>
      <DrawerMobile />
      <DrawerDesktop />
    </>
  )
}

export default Drawer
