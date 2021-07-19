import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavItem from 'react-bootstrap/NavItem'

function Sidebar(props) {
    return (
        <Navbar fixed="left">
        <NavItem>
            <li className="myJobs">My Jobs</li>
        </NavItem>
        </Navbar>
    )
}

export default Sidebar;