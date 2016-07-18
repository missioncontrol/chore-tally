/* @flow */
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { loginUser } from 'redux/modules/auth'
import { routeTo } from 'redux/modules/router'
import classes from './LoginView.scss'

type Props = {
};

export class LoginView extends React.Component<void, Props, void> {
  static propTypes = {
  };

  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  componentWillMount() {
    if (this.props.user) {
      this.props.routeTo({
        pathname: '/settings'
      })
    }
  }

  buildHandler (type, key) {
    return (ev) => {
      if (type === 'onChange') {
        this.setState({
          [key]: ev.target.value
        })
      }
    }
  }

  login (ev) {
    ev.preventDefault()

    this.props.loginUser()
  }

  render () {
    return (
      <div className='container text-center'>
        <div style={{
          display: 'block',
          padding: 20,
          paddingTop: 120,
          textAlign: 'center',
          margin: 'auto'
        }}>
          <a href="/">
            <img src="https://avatars1.githubusercontent.com/u/13472274?v=3&s=64" />
          </a>
        </div>

        <form className={classes.form} onSubmit={this.login.bind(this)}>
          <h2>Login</h2>
          <button type='submit' className="button button-outline">
            <img src="https://logo.clearbit.com/facebook.com" />
            Login With Facebook
          </button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  isAuthenticating: state.auth.isAuthenticating,
  statusText: state.auth.statusText
})
export default connect((mapStateToProps), {
  loginUser,
  routeTo
})(LoginView)
