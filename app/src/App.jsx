import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import * as Sentry from '@sentry/browser'

import Auth from '@/pages/auth'
import Account from '@/pages/account'
import Home from '@/pages/home'

import useStore from '@/store'

import ResponsiveIndicator from '@/components/ResponsiveIndicator'
import Drawer from '@/components/drawer'
import Loader from '@/components/loader'

import api from '@/services/api'

import { environment, SENTRY_URL } from './config'


if (environment === 'production') {
  Sentry.init({ dsn: SENTRY_URL, environment: 'app' })
}

export default function App() {
  const [loading, setLoading] = useState(true)

  const { user, setUser } = useStore()
  const { organization, setOrganization } = useStore()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/user/signin_token')
        if (res.token) api.setToken(res.token)
        setUser(res.user)

        const { data, ok } = await api.post(`/organization/search`)
        if (!ok) return
        setOrganization(data[0])
      } catch (e) {
        console.log(e)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <Loader />

  // return <Auth />

  return (
    <BrowserRouter>
      <div className={`${user && 'flex flex-col h-screen overflow-hidden lg:flex-row'}`}>
        {user && <Drawer />}
        <main className={`${user && 'flex-1 overflow-y-auto bg-background-secondary p-6'}`}>
          <Route path='/auth' component={Auth} />
          <Switch>
            <RestrictedRoute path='/account' component={Account} />
            <RestrictedRoute path='/' component={Home} exact />
          </Switch>
          <Toaster position='top-center' />
          <ResponsiveIndicator />
        </main>
      </div>
    </BrowserRouter>
  )
}

const RestrictedRoute = ({ component: Component, role, ...rest }) => {
  const { user } = useStore()

  return <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to={{ pathname: '/auth' }} />)} />
}
