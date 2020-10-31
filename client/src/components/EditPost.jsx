import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useHistory, useParams, Link} from 'react-router-dom'  
import {Button} from 'react-bootstrap'

import '../assets/css/loading-icons.css'

import TagsInput from 'react-tagsinput'

// import 'react-tagsinput/react-tagsinput.css'
import '../assets/css/tag-input.css'

function EditPost(props) {
    let {id} = useParams();
    let history = useHistory();
    let [post, setPost] = useState({});
    let [isLoading, setLoading] = useState(true);
    function handleUserInput(ev) {
        setPost({
            ...post,
            [ev.currentTarget.name]: ev.currentTarget.value
        });
    } 
    function handleTagsChange(tags) {
        setPost({
            ...post,
            tags: tags
        })
    }
    let saveChanges = () => {
        props.setLoadingOverlay(true)
        axios({
            method: "put",
            url: "/posts/edit",
            data: post
        }).then(res => {
            props.setLoadingOverlay(false)
        }).catch(err => {
            throw err;
        })
    }
    let archive = () => {
        props.setLoadingOverlay(true);
        axios({
            method: "put",
            url: "/posts/archive",
            data: {_id: post._id}
        }).then(res => {
            props.setLoadingOverlay(false);
            setPost({
                ...post,
                archived: true
            });
        }).catch(err => {
            throw err;
        })
    }
    let unarchive = () => {
        props.setLoadingOverlay(true);
        axios({
            method: "put",
            url: "/posts/unarchive",
            data: {_id: post._id}
        }).then(res => {
            props.setLoadingOverlay(false);
            setPost({
                ...post,
                archived: false
            });
        }).catch(err => {throw err})
    }
    useEffect(() => {
        props.setLoadingOverlay(true);
        axios({
            url: "/posts/view/all",
            method: "get",
            params: {
                _id: id
            }
        }).then(res => {
            setPost(res.data);
            props.setLoadingOverlay(false);
            setLoading(false);
        }).catch(err => {
            throw err;
        })
    },[])
    return (<div><header>
        <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
            <h1 className="text-center" style={{ color: '#FFFFFF' }}>Edit Post</h1>
        </div>
    </header>
        <div className="container">
            <div className="row">
                <div className="clearfix" />
                <div className="col">
                    <div className="form-entry">
                        <h1>Title</h1><input type="text" value={post.title} name="title" onChange={handleUserInput} className="new-post-in" /></div>
                    <div className="form-entry">
                        <h1>Enter Markdown</h1><textarea className="md-text" defaultValue={post.md} name="md" onChange={handleUserInput} /></div>
                    <div className="form-entry">
                        <h1>Resume</h1><textarea className="md-text" defaultValue={post.resume} name="resume" onChange={handleUserInput} /></div>
                    <div className="form-entry">
                        <h1>Tags</h1>
                        {isLoading ? null : <TagsInput value={post.tags} onChange={handleTagsChange}></TagsInput>}
                    </div>
                    <div role="group" className="btn-group d-flex">
                        <Link to="/posts/all" as={Button} className="btn btn-primary" type="button">Return</Link>
                        {post.archived ? <Button variant="primary" onClick={unarchive}>Unarchive</Button> : <Button variant="danger" onClick={archive}>Archive</Button>}
                        <Button variant="success" onClick={saveChanges}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>)}

export default EditPost;
    