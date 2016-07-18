/* @flow */
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classes from './HomeView.scss'
import ChoreList from 'containers/ChoreList'
import coinImage from './coin.png'

type Props = {
}

export class HomeView extends React.Component {
  render() {
    const { user } = this.props

    return (
      <div className={classes.home}>
        <ChoreList user={user} />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { auth: { user } } = state

  return {
    user
  }
}
export default connect(mapStateToProps, {
})(HomeView)
