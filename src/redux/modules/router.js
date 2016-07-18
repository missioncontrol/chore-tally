import { push } from 'react-router-redux'

export const ROUTE_TO = 'ROUTE_TO'

export function routeTo(location) {
  return (dispatch, state) => {
    dispatch(push(location))
  }
}
