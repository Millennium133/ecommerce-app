// src/tests/CartPage.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import CartPage from '../pages/CartPage';

// Mock Axios
const mock = new axiosMock(axios);

describe('CartPage Integration Tests', () => {
    beforeEach(() => {
        // Mock get cart response
        mock.onGet('/api/cart').reply(200, {
            items: [
                {
                    productId: { _id: 'testProductId', title: 'Test Product', price: 100 },
                    quantity: 2
                }
            ],
            totalAmount: 200
        });
    });

    afterEach(() => {
        mock.reset();
    });

    test('renders cart items and allows updating quantity', async () => {
        render(<CartPage />);

        // Check if the product is displayed
        expect(await screen.findByText('Test Product')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2')).toBeInTheDocument(); // Initial quantity

        // Mock updating quantity
        mock.onPut('/api/cart').reply(200, {
            items: [
                {
                    productId: { _id: 'testProductId', title: 'Test Product', price: 100 },
                    quantity: 3
                }
            ],
            totalAmount: 300
        });

        // Change quantity in input field and trigger update
        fireEvent.change(screen.getByLabelText('Quantity:'), { target: { value: '3' } });

        // Wait for update to finish and check for new quantity
        await waitFor(() => {
            expect(screen.getByDisplayValue('3')).toBeInTheDocument();
        });
    });

    test('displays error for invalid quantity input', async () => {
        render(<CartPage />);

        // Mock backend response for invalid quantity
        mock.onPut('/api/cart').reply(400, {
            message: 'Quantity must be an integer and at least 1'
        });

        // Try updating quantity with invalid input
        fireEvent.change(screen.getByLabelText('Quantity:'), { target: { value: '0' } });
        
        // Wait for the error to be displayed
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Quantity must be a valid number and at least 1.');
        });
    });
});
