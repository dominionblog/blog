import React from 'react'
import {Button} from 'react-bootstrap'
import moment from 'moment'
import {Link} from 'react-router-dom'

export default props => {
    return (
        <div className="card post-card">
            <div className="card-body">
                <Button onClick={() => { props.openInspector(props.post)}} variant="link" className="card-link">{props.post.title}</Button>
                <p className="date-author">{moment(props.post.createdAt).fromNow()} | Posted by <Button as={Link} variant="link" to={`/users/${props.post.author._id}`}>{props.post.author.name}</Button></p>
            </div>
        </div>
    )
}