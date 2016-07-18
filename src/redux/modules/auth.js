import { push } from 'react-router-redux'
import { createReducer, checkHttpStatus, parseJSON } from 'utils'
import fetch from 'isomorphic-fetch'
import { firebase } from 'utils'

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE'
export const LOGOUT_USER = 'LOGOUT_USER'

export function loginUserSuccess({ user, token }) {
  localStorage.setItem('ctToken', token)
  localStorage.setItem('ctUser', JSON.stringify(user))
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      user,
      token
    }
  }
}

export function loginUserFailure(error) {
  localStorage.removeItem('ctToken')
  localStorage.removeItem('ctUser')
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export function logout() {
  localStorage.removeItem('ctToken')
  localStorage.removeItem('ctUser')
  return {
    type: LOGOUT_USER
  }
}

export function logoutAndRedirect() {
  return (dispatch, state) => {
    dispatch(logout())
    dispatch(push('/login'))
  }
}

export function loginUser(redirect = '/') {
  return (dispatch) => {
    const { firebase } = window
    const provider = new firebase.auth.FacebookAuthProvider()

    dispatch(loginUserRequest())
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(({ credential, user }) => {
        console.log(credential, user)
        dispatch(loginUserSuccess({ user, token: credential.accessToken }))
        dispatch(push(redirect))
      })
      .catch(err => {
        if (err) {
          dispatch(loginUserFailure({
            response: {
              status: 403,
              statusText: 'Invalid token'
            }
          }))
        }
      })
  }
}

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null
}

export default createReducer(initialState, {
  [LOGIN_USER_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      isAuthenticating: true,
      statusText: null
    })
  },
  [LOGIN_USER_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      isAuthenticating: false,
      isAuthenticated: true,
      token: payload.token,
      user: payload.user,
      statusText: 'You have been successfully logged in.'
    })

  },
  [LOGIN_USER_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      isAuthenticating: false,
      isAuthenticated: false,
      token: null,
      user: null,
      statusText: `Authentication Error: ${payload.status} ${payload.statusText}`
    })
  },
  [LOGOUT_USER]: (state, payload) => {
    return Object.assign({}, state, {
      isAuthenticated: false,
      token: null,
      user: null,
      statusText: 'You have been successfully logged out.'
    })
  }
})
