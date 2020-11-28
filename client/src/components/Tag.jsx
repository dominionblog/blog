import React, {useState, useEffect} from 'react'
import GeneralJumbo from './GeneralJumbo'
import {Badge} from 'react-bootstrap' 
import {useParams} from 'react-router-dom'
import axios from 'axios'
import PostCarousel from './PostsCarousel'

export default props => {
    let {id} = useParams();
    let [tag, setTag] = useState({});
    let [posts, setPosts] = useState(null)
    useEffect(() => {
        axios({
            url: `/tags/${id}`,
            method: 'get'
        }).then(res => {
            setTag(res.data)
            axios({
                url: `/posts/search/tag/${res.data._id}`,
                method: 'get'
            }).then(res => {
                setPosts(res.data)
            });
        })
    },[]);

    return (
        <div>
            <GeneralJumbo title={<>View Tag {tag ? <Badge variant="primary">{tag.name}</Badge> : null} </>} />
            <div className="container" style={{ height: 'auto' }}>
                {
                    (tag != {}) ? <>
                        <p>{tag.description}</p>
                        <h1>All Posts With This Tag</h1>
                        {posts ? <PostCarousel openInspector={props.openInspector} tag={tag} posts={posts} /> : null}
                    </> : null
                }
                
            </div>
        </div>
    )
}
