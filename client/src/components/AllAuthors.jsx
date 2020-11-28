import React, {useState, useEffect} from 'react'
import AuthorCard from './general/AuthorCard'
import axios from 'axios'
import {Spinner} from 'react-bootstrap'
import GeneralJumbo from './GeneralJumbo'

let AllAuthors = () => {
    let [authors, setAuthors] = useState([]);
    let [isLoading, setLoading] = useState(true);
    useEffect(() => {
        axios({
            url: "/users/all",
            method: "get"
        }).then(res => {
            setLoading(false);
            setAuthors(res.data)
        }).catch(err => {
            setLoading(false);
            throw err;
        })
    },[])
        return (<>
        <GeneralJumbo title="Our Authors" />
        <div className="container authors-container" style={{height: 'auto'}}>
            {isLoading ? <div className="d-flex justify-content-center w-100"><Spinner animation="border"></Spinner></div> : authors.map(author => {
                return (<AuthorCard key={author._id} {...author}/>)
            })}
        </div>
    </>)
}

export default AllAuthors;
