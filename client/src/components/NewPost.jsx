import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Spinner} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'  

import '../assets/css/loading-icons.css'

import TagsInput from 'react-tagsinput'

// import 'react-tagsinput/react-tagsinput.css'
import '../assets/css/tag-input.css'

function NewPost(props) {
    let history = useHistory();
    let [newPost, setNewPost] = useState({
        title: '',
        md: '',
        tags: [],
        resume: ''
    });
    let [isLoading, setLoading] = useState(false)
    function handleUserInput(ev) {
        setNewPost({
            ...newPost,
            [ev.currentTarget.name]: ev.currentTarget.value
        });
    } 
    function handleTagsChange(tags) {
        setNewPost({
            ...newPost,
            tags: tags
        })
    }
    function handleNewPost() {
        setLoading(true);
        props.setLoadingOverlay(true);
        axios({
            method: "post",
            url:"/posts/new",
            data: newPost
        }).then(res => {
            props.setLoadingOverlay(false);
            setLoading(false);
            history.push("/posts/created");
        }).catch(err => {
            props.setLoadingOverlay(false);
            setLoading(false)
            console.log(err);
        })
    }
    useEffect(() => {
        axios({
            method: "get",
            url: "/users/all"
        }).then(res => {
            setLoading(false)
            if (res.data) {
                /**
                 * Prevents empty array from
                 * causing crash
                 */
                setNewPost({
                    ...newPost,
                    author: res.data[0]
                })
            }
        }).catch(err => {
            throw err;
        })
    }, [])
    return (<div><header>
        <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
            <h1 className="text-center" style={{ color: '#FFFFFF' }}>Create a New Post</h1>
        </div>
    </header>
        <div className="container">
            <div className="row">
                <div className="clearfix" />
                <div className="col">
                    <div className="form-entry">
                        <h1>Title</h1><input type="text" value={newPost.title} name="title" onChange={handleUserInput} className="new-post-in" /></div>
                    <div className="form-entry">
                        <h1>Enter Markdown</h1><textarea className="md-text" defaultValue={newPost.md} name="md" onChange={handleUserInput} /></div>
                    <div className="form-entry">
                        <h1>Resume</h1><textarea className="md-text" defaultValue={newPost.resume} name="resume" onChange={handleUserInput} /></div>
                    <div className="form-entry">
                        <h1>Tags</h1>
                        <TagsInput value={newPost.tags} onChange={handleTagsChange}></TagsInput>
                    </div>
                    <div className="d-flex justify-content-end"><button className="btn btn-primary d-inline-block" type="button" onClick={handleNewPost}>Create</button></div>
                </div>
            </div>
        </div>
    </div>)}

export default NewPost;
    