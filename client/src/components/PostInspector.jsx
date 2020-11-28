import React from 'react'
import {Modal, Button, Badge} from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import moment from 'moment'

export default props => {
    let history = useHistory();
    return (
        <Modal show={props.showInspector} onHide={() => {props.openInspector(null)}} >
        {props.post ? <>
                    <Modal.Header closeButton = {true}>
                    <Modal.Title>
                        Inspect Post
                    </Modal.Title>
                    </Modal.Header >
                    <Modal.Body>
                        <h1>{props.post.title}</h1>
                        <p className="m-0">{props.post.resume}</p>
                        <p className="tag-block m-0">
                            <strong>Tags:&nbsp;</strong>
                            {
                                props.post.tags.map(tag => {
                                    return <Badge key={tag._id} className="m-1" variant="primary" as={Link} to={`/tags/${tag._id}`}>{tag.name}</Badge>
                                })
                            }
                        </p>
                        <p className="date-author m-0">{moment(props.post.createdAt).fromNow()} |&nbsp; <Button variant="link" as={Link} to={`/users/${props.post.author._id}`}>{props.post.author.name}</Button></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => {props.openInspector(null)}}>Cancel</Button>
                        <Button variant="primary" onClick={() => {
                            history.push(`/posts/${props.post._id}`)
                            props.openInspector(null)
                        }} >Open<i className="fa fa-folder-open m-1" /></Button>
                    </Modal.Footer>
                </> : null }
        </ Modal >
    )
}