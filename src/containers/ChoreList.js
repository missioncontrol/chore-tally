import React from 'react'
import ChoreList from 'components/ChoreList'
import { firebase } from 'utils'
import coinImage from 'views/HomeView/coin.png'

export default class ChoreListContainer extends React.Component {
  constructor(props) {
    super(props)

    this.addItem = this.addItem.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.onDraftChange = this.onDraftChange.bind(this)

    this.state = {
      draftText: '',
      items: []
    }
    this._items = null
  }

  componentWillMount() {
    this.listRef = firebase.database().ref('chores/completed')
    this.listRef.on('value', snapshot => {
      const items = []
      snapshot.forEach(child => {
        const item = child.val()
        item.key = child.key
        items.push(item)
      })

      this._items = items
      const points = items
        .filter(i => i.author === this.props.user.displayName)
        .reduce((a, b) => a + 1, 0) * 10

      if (this.state.draftText) {
        this.setState({
          items: items.filter(i => {
            return i.chore.toLowerCase().indexOf(this.state.draftText.toLowerCase()) > -1
          }),
          points
        })
      } else {
        this.setState({ items, points })
      }
    })
  }

  componentWillUnmount() {
    this.listRef.off()
  }

  removeItem(key) {
    const ref = firebase.database().ref('chores/completed')
    ref.child(key).remove()
  }

  addItem(opts = {}) {
    const item = {
      author: this.props.user.displayName,
      chore: opts.chore || this.state.draftText,
      createdAt: Date.now()
    }

    this.listRef.push(item)
    !opts.chore && this.setState({
      draftText: '',
      items: this._items
    })
  }

  onDraftChange(e) {
    const items = this._items.filter(i => {
      return i.chore.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
    })
    this.setState({
      draftText: e.target.value,
      items
    })
  }

  render() {
    const { draftText, items, points } = this.state
    const { user } = this.props

    return (
      <div>
        <header className="row space-between">
          <div>
            <img src="https://avatars1.githubusercontent.com/u/13472274?v=3&s=200" />
            <label>Chore Tally</label>
          </div>
          <div>
            <strong>
              <img src={coinImage} />
              {points}
            </strong>
            <label>Hi {user.displayName.split(' ')[0]}!</label>
          </div>
        </header>

        <ChoreList
          items={items}
          draftText={draftText}
          onDraftChange={this.onDraftChange}
          addItem={this.addItem}
          removeItem={this.removeItem}
          currentUser={user}
        />
      </div>
    )
  }
}
