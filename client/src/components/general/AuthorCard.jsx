import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'

let AuthorCard = props => {
    return (<div className="card author-card">
        <div className="card-body">
        <h4 className="card-title">{props.name}</h4><Button as={Link} to={`/users/${props._id}`} className="w-100">Meet Me</Button>
        </div>
    </div>)
}

export default AuthorCard;