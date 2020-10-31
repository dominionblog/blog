import React, {useState} from 'react'
import moment from 'moment'
import axios from 'axios'
import {Spinner} from 'react-bootstrap'
import {Link} from 'react-router-dom'

function PostCard(props) {
    return (<div className="post-card">
        <div className="container">
            <div className="row post-subtitle">
                <div className="col-lg-8 align-content-center justify-content-center align-items-center d-flex">
            <h2 className="post-title">{props.title}</h2>
                </div>
                <div className="col">
                    <div className="row h-100">
                        <div className="col d-flex justify-content-center align-items-center">
                            <h5>Posted by {props.author && props.author.name} on {moment(props.createdAt).format("dddd MMMM D yyyy")}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container">
            <div className="post-preview">
                <p className="resume"><strong>{props.resume}.</strong></p>
                <Link to={`/posts/${props._id}`}><div className="d-flex justify-content-center"><button className="btn btn-primary w-100 read-btn" type="button">Read</button></div></Link>
                <p className="tag-block"><strong>Tags:&nbsp;</strong> {props.tags && props.tags.map(tag => {
                            return(<span className="badge badge-primary tag-badge">{tag}</span>)
                        })}
                </p>
            </div>
        </div>
    </div>)
}

export default PostCard