import { UserAuthWrapper } from 'redux-auth-wrapper'
import { push } from 'react-router-redux'

export const requireAuthentication = UserAuthWrapper({
  authSelector: state => (state.auth || {}),
  predicate: auth => auth.isAuthenticated,
  redirectAction: push,
  wrapperDisplayName: 'UserIsJWTAuthenticated'
})

export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function parseJSON(response) {
  return response.json()
}

export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type]

    return reducer ? reducer(state, action.payload) : state
  }
}

export const firebase = window.firebase
