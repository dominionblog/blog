import React, {useEffect, useState} from 'react'
import PostCard from './post-card'
import welcomeImage from '../assets/img/welcome-image.JPG'

/* Stylesheets */

import axios from 'axios';
import {Spinner} from 'react-bootstrap'
import moment from 'moment'

function Home(props) {
    let [isLoading, setLoading] = useState(true);
    let [posts, setPosts] = useState([{}]);
    useEffect(() => {
      axios({
        url: "/posts/view",
        method: "get"
      }).then(res => {
        setLoading(false);
        // Sort the posts
        res.data.sort((a, b) => {
          let dateA = moment(a.createdAt).unix();
          let dateB = moment(b.createdAt).unix();
          return dateB-dateA;
        })
        setPosts(res.data);
      })
    },[])
    return (<>
    <div>
            <header className="masthead" style={{ backgroundImage: "url(" + welcomeImage + ")"}}>
    <div className="overlay" />
    <div className="container">
      <div className="row">
        <div className="col-md-10 col-lg-8 mx-auto">
          <div className="site-heading">
            <h1>B. Log</h1><span className="subheading">The Best Blog</span></div>
        </div>
      </div>
    </div>
  </header>
        {isLoading ? <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> : posts.map(post => {
          return (<PostCard key={post._id} {...post}></PostCard>)
        })}
    </div>
        </>)
}

export default Home