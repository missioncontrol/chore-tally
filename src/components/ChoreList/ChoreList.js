import React from 'react'
import classes from './ChoreList.scss'

export default function ChoreList(props) {
  const {
    items,
    draftText,
    onDraftChange,
    addItem,
    removeItem,
    currentUser
  } = props

  const onKeyPress = (e) => {
    if (e.which != 13 || e.target.value < 1) {
      return
    }

    addItem()
  }

  const chores = items.reduce((a, b) => {
    if (!a[b.chore]) {
      a[b.chore] = {
        users: {},
        actions: []
      }
    }
    if (!a[b.chore].users[b.author]) {
      a[b.chore].users[b.author] = 0
    }
    if (b.author === currentUser.displayName) {
      if (!a[b.chore].lastItem) {
        a[b.chore].lastItem = b
      } else if (a[b.chore].lastItem.timestamp < b.timestamp) {
        a[b.chore].lastItem = b
      }
    }

    a[b.chore].users[b.author]++
    a[b.chore].actions.push(b)

    return a
  }, {})
  const choreList = Object.keys(chores).map(k => ({
    name: k,
    userList: Object.keys(chores[k].users).map(u => ({
      name: u === currentUser.displayName ? `You (${u})` : u,
      count: chores[k].users[u]
    })),
    ...chores[k]
  }))

  return (
    <div>
      <input
        style={{width: '100%', fontSize: 24}}
        value={draftText}
        placeholder="Search or add chore"
        onChange={(e) => onDraftChange(e)}
        onKeyPress={onKeyPress}
      />
      {draftText.length > 0 && choreList.length === 0 && (
        <div className={classes.empty}>
          Press enter to add a new chore
        </div>
      )}
      {choreList.map(chore => {
        return (
          <div key={chore.name}>
            <div className="row space-between" style={{padding: '20px 10px 10px'}}>
              <h2>{chore.name}</h2>
              <div style={{padding: '12px 0'}}>
                {chore.lastItem && <button className="button button-outline"
                  style={{marginRight: 16}}
                  onClick={() => removeItem(chore.lastItem.key)}>
                  <i className="ion-minus" />
                </button>}
                <button className="button button-outline" onClick={() => addItem({ chore: chore.name })}>
                  <i className="ion-plus" />
                </button>
              </div>
            </div>
            <table className={classes.table}>
              <tbody>
                {chore.userList.map(user => (
                  <tr key={chore.name + '-' + user.name}>
                    <td>{user.name}</td>
                    <td>{user.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
