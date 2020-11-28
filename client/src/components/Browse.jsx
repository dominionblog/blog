import React, {useState, useEffect} from 'react'
import axios from 'axios'
import moment from 'moment'
import {Badge, Button, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import PostsCarousel from './PostsCarousel'
import PostInspector from './PostInspector'

export default props => {
    let [isLoading, setLoading] = useState(true);
    let [tags, setTags] = useState(null);
    let [posts, setPosts] = useState(null);
    
    /* Get tags */
    useEffect(() => {
        axios({
            url: "/tags/all",
            method: 'get'
        }).then(res => {
            setTags(res.data)
        })
    },[]);
    /* Get Posts */
    useEffect(() => {
        axios({
            url: "/posts/view",
            method: "get"
        }).then(res => {
            // Sort the posts
            res.data.sort((a, b) => {
                let dateA = moment(a.createdAt).unix();
                let dateB = moment(b.createdAt).unix();
                return dateB - dateA;
            })
            setPosts(res.data);
        })
    }, []);
    return (<div>
            {/**
             * Body
             */}
        <div className="container">
            <h1>Browse Posts</h1>
            <div className="all-subjects">
                {
                    tags ? tags.map(tag => {
                        return (
                            <Badge key={tag._id} className="tag-badge" as={Link}to={`/tags/${tag._id}`} variant="primary">{tag.name}</Badge>
                        )
                    }): null
                }
            </div>
            {
                (tags && posts) ? <div>
                    {tags.map(tag => {
                            return (
                                <div key={tag._id} id={`${tag._id}`} className="show-posts">
                                    <h1 className="card-carousel-title">{tag.name}<Badge as={Link} to={`/tags/${tag._id}`} variant="light" className="see-all-btn"><i className="fa fa-search" /></Badge></h1>
                                    <PostsCarousel openInspector={props.openInspector} posts={posts} tag={tag}/>
                                </div>
                            )
                        })}
                </div> : null
            }
        </div>
    </div>)
}
