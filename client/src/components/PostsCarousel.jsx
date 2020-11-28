import React, {useState, useEffect} from 'react'
import axios from 'axios'
import moment from 'moment'
import PostCard from './PostCard'

export default props => {
    return (
        <>
            {props.posts.map(post => {
                let postTags = post.tags.map(tag => {
                    return tag.name
                })
                if (postTags.includes(props.tag.name)) {
                    return <PostCard key={post._id} openInspector={props.openInspector} post={post} />
                } else {
                    return null
                }
            })}
        </>
    )
}