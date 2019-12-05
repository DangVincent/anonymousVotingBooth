import React, { Component } from 'react';
import './App.scss';
import firebase from 'firebase';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import GuestLogin from './components/GuestLogin';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';



class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Header />
                    <Route exact path='/guestlogin' component={GuestLogin} />
                    <Route path="/guestlogin/dashboard" component={Dashboard} />
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;