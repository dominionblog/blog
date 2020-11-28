import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'
import HTMLToReact from 'html-to-react'
import moment from 'moment'
import {Spinner, Button} from 'react-bootstrap'
import GeneralJumbo from './GeneralJumbo'
import Prism from 'prismjs'
import '../assets/css/post-markup.css'
let HtmlToReactParser = HTMLToReact.Parser;
let htmlToReactParser = new HtmlToReactParser();

function Post(props) {
    let [isLoading, setLoading] = useState(true);
    let [post, setPost] = useState(null);
    let {id} = useParams();
    useEffect( () => {
        Prism.highlightAll();
    })
    useEffect(() => {
        axios({
            method: 'get',
            url: '/posts/view/all',
            params: {
                _id: id
            }
        }).then(res => {
            setPost(res.data);
            setLoading(false);
        })
    },[])
    return (<div>
        <GeneralJumbo title={post && post.title}/>
        <article>
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-lg-8 mx-auto post-content">
                        {isLoading ? <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner> : <>{post && htmlToReactParser.parse(post.html)}</>}
                    </div>
                    {
                        post ? <div className="col-xl-3">
                            <div className="card post-meta">
                                <div className="card-body">
                                    <h1 className="card-title">Post Information</h1>
                                    <h2>Title</h2>
                                    <p>{post.title}</p>
                                    <h2>Author</h2>
                                    <p><Button as={Link} variant="link" to={`/users/${post.author._id}`}>{post.author.name}</Button></p>
                                    <h2>Published</h2>
                                    <p>{moment(post.createdAt).format("MMMM DD YYYY")}</p>
                                    <h2>Last Updated</h2>
                                    <p>{moment(post.updatedAt).format("MMMM DD YYYY")}</p>
                                </div>
                            </div>
                        </div> : null
                    }
                    
                </div>
            </div>
        </article>
    </div>)
}

export default Post;
