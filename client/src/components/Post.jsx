import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import HTMLToReact from 'html-to-react'
import moment from 'moment'
import {Spinner} from 'react-bootstrap'
import '../assets/css/post-markup.css'
let HtmlToReactParser = HTMLToReact.Parser;
let htmlToReactParser = new HtmlToReactParser();

function Post(props) {
    let [isLoading, setLoading] = useState(true);
    let [post, setPost] = useState({});
    let {id} = useParams();
    
    useEffect(() => {
        axios({
            method: 'get',
            url: '/posts/view/all',
            params: {
                _id: id
            },
            timeout: 1000
        }).then(res => {
            setPost(res.data);
            setLoading(false);
        }).catch(err => {
            props.setCrashed(true)
            throw err;
        })
    })
    return (<div>
        <header className="masthead">
            <div className="overlay" />
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-lg-8 mx-auto">
                        <div className="post-heading">
                            {isLoading ? <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner> : <><h1>{post && post.title}</h1><span className="post-info">Posted by <strong>{post.author && post.author.name}</strong>&nbsp;on <strong>{post && moment(post.createdAt).format('dddd MMMM DD YYYY')}</strong></span></>}
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <article>
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-lg-8 mx-auto post-content">
                        {isLoading ? <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner> : <>{post && htmlToReactParser.parse(post.html)}</>}
                    </div>
                </div>
            </div>
        </article>
    </div>)
}

export default Post;
