import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { requireAuthentication } from '../utils'

import CoreLayout from 'layouts/CoreLayout'
import HomeView from 'views/HomeView'
import LoginView from 'views/LoginView'

export default (store) => (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={requireAuthentication(HomeView)} />
    <Route path='/login' component={LoginView} />
  </Route>
)
