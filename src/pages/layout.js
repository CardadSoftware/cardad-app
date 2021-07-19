import React from 'react';
import MainNavbar from './navbar.js'

function Layout({ children }) {
    const testUser = { 'name': 'Anthony Stoute',  signedIn : true};
    return (
        <div>
        <MainNavbar user={testUser} title={"CarDad"}></MainNavbar>
        <main>
            { children }
            </main>
        </div>
        
    )
    
}

export default Layout;