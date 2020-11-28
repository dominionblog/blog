import AllAuthors from '../components/AllAuthors'
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect"
import React from 'react'
import {render, screen} from '@testing-library/react'

test("shows all authors", () => {
    render(<AllAuthors />)
    expect(screen.getByText(text => {
        let pattern = /our authors/i
        return text.match(pattern)
    })).toBeTruthy();
})