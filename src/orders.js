import { products } from './data.js';

export const statuses = ['Pending confirmation', 'Confirmed', 'Declined'];

export const money = value => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
}).format(value);

export const total = items => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export function quantity(value) {
    const number = Number(value);

    if (!Number.isSafeInteger(number) || number < 1 || number > 999) {
        throw new Error('Use a whole-number quantity from 1 to 999.');
    }

    return number;
}

export function setQuantity(cart, id, value) {
    if (!products.find(product => product.id === id)?.available) {
        throw new Error('This sample product is unavailable.');
    }

    return {
        ...cart,
        [id]: quantity(value)
    };
}

export function cartItems(cart) {
    return Object.entries(cart).map(([id, count]) => {
        const product = products.find(item => item.id === id);

        if (!product?.available) {
            throw new Error('An item in your cart is unavailable.');
        }

        return {
            id,
            name: product.name,
            price: product.price,
            quantity: quantity(count)
        };
    });
}

export function createRequest(cart, customer) {
    const items = cartItems(cart);

    if (!items.length) {
        throw new Error('Add an available item before submitting.');
    }

    const name = customer.name.trim();
    const contact = customer.contact.trim();

    if (!name || name.length > 100) {
        throw new Error('Enter a customer name (up to 100 characters).');
    }

    if (
        !/^[+\d()\s-]{7,25}$/.test(contact)
        || contact.replace(/\D/g, '').length < 7
    ) {
        throw new Error('Enter a valid contact number with at least 7 digits.');
    }

    if ((customer.notes || '').length > 1000) {
        throw new Error('Keep notes under 1,000 characters.');
    }

    return {
        id: `DEMO-${crypto.randomUUID()}`,
        customer: {
            name,
            contact,
            notes: (customer.notes || '').trim()
        },
        items,
        status: statuses[0],
        submittedAt: new Date().toISOString()
    };
}

export function decide(requests, id, status) {
    if (!['Confirmed', 'Declined'].includes(status)) {
        throw new Error('Choose confirm or decline.');
    }

    const request = requests.find(item => item.id === id);

    if (!request || request.status !== statuses[0]) {
        throw new Error('Only pending requests can be decided.');
    }

    return requests.map(item => item.id === id
        ? {
            ...item,
            status
        }
        : item
    );
}
