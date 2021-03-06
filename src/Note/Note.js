import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NotefulContext from '../NotefulContext'
import config from '../config'
import './Note.css'

export default class Note extends React.Component {
  static defaultProps ={
    onDeleteNote: () => {},
  }
  static contextType = NotefulContext;

  handleClickDelete = e => {
    e.preventDefault()
    const noteid = this.props.noteid

    fetch(`${config.API_ENDPOINT}/notes/${noteid}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(() => {
        this.context.deleteNote(noteid)
        // allow parent to perform extra behaviour
        this.props.onDeleteNote(noteid)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { note_name, noteid, modified } = this.props
    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/notes/${noteid}`}>
            {note_name}
          </Link>
        </h2>
        <button
          className='Note__delete'
          type='button'
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
