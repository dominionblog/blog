import React, {useMemo, useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {useTable} from 'react-table'
import { useEffect } from 'react';

function AllUsers() {

    let [users, setUsers] = useState([]);

    useEffect(() => {
        axios({
            method: "get",
            url: "/users/all"
        }).then(res => {
            setUsers(res.data)
        }).catch(err => {
            throw err
        });
    },[])

    let data = useMemo(() => {
        return users
    },[users])
    const cols = useMemo(() => {
        return ([
            {
                header: 'Name',
                accessor: 'name'
            },
            {
                header: 'Action',
                accessor: '_id',
                Cell: ({ cell: { value } }) => <Link to={`/users/edit/${value}`} className="btn btn-primary"><i className="fa fa-pencil-square-o" />Edit</Link>
            }
        ])
    },[]);
    const tableInstance = useTable({
        columns: cols,
        data: data
    })
    return (<div>
        <header>
            <div className="jumbotron" style={{ backgroundColor: 'rgb(63,108,118)' }}>
                <h1 className="text-center" style={{ color: '#FFFFFF' }}>View all Users</h1>
            </div>
        </header>
        <div className="container">
            <div className="row">
                <div className="col-md-10 col-lg-8 mx-auto">
                    <div className="row d-flex jusify-content-center">
                        <div className="col w-100">
                            <div className="btn-group d-inline d-flex edit-btns" role="group">
                                <Link to="/users/new" className="btn btn-primary"><i className="fa fa-plus" />New</Link></div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table" {...tableInstance.getTableProps()}>
                            <thead>
                                {tableInstance.headerGroups.map(headerGroup => {
                                    return (<tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(header => {
                                            return (<th {...header.getHeaderProps()}>{header.render('header')}</th>)
                                        })}
                                    </tr>)
                                })}
                            </thead>
                            <tbody {...tableInstance.getTableBodyProps()}>
                                {tableInstance.rows.map(row => {
                                    tableInstance.prepareRow(row);
                                    return(<tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{
                                                cell.render('Cell')
                                            }</td>
                                        ))}
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="clearfix" />
                <div className="clearfix" />
            </div>
        </div>
    </div>)
}

export default AllUsers