import Home from "../components/home"
import '@testing-library/jest-dom'
import {BrowserRouter as Router} from 'react-router-dom'

import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test("loads the home page", () => {
    render(
        <Router>
             <Home />
        </Router>
        );
    expect(screen.getAllByText((text, element) => {
        // Make sure that the page says 'welcome to'
        return (text.match(/welcome to the/i) || text.match(/dominion/i))
    })).toHaveLength(2);
} )