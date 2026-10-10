import { statuses } from './orders.js';

export const storageKey = 'little-table.requests.v1';

function validRequest(order) {
    return order
        && typeof order.id === 'string'
        && order.id.startsWith('DEMO-')
        && statuses.includes(order.status)
        && typeof order.submittedAt === 'string'
        && Number.isFinite(Date.parse(order.submittedAt))
        && order.customer
        && typeof order.customer.name === 'string'
        && typeof order.customer.contact === 'string'
        && typeof order.customer.notes === 'string'
        && Array.isArray(order.items)
        && order.items.length > 0
        && order.items.every(item => item
            && typeof item.id === 'string'
            && typeof item.name === 'string'
            && Number.isFinite(item.price)
            && item.price >= 0
            && Number.isSafeInteger(item.quantity)
            && item.quantity > 0
            && item.quantity <= 999
        );
}

export function loadRequests(storage = localStorage) {
    try {
        const raw = storage.getItem(storageKey);

        if (raw === null) {
            return {
                requests: [],
                warning: ''
            };
        }

        const data = JSON.parse(raw);

        if (
            !Array.isArray(data)
            || !data.every(validRequest)
            || new Set(data.map(item => item.id)).size !== data.length
        ) {
            throw new Error('Invalid data');
        }

        return {
            requests: data,
            warning: ''
        };
    } catch {
        return {
            requests: [],
            warning: 'Saved demo data could not be read. Reset the demo to start fresh. Submissions are disabled until reset succeeds.'
        };
    }
}

export function saveRequests(requests, storage = localStorage) {
    // Persist before updating the interface: failed writes must never look successful.
    try {
        storage.setItem(storageKey, JSON.stringify(requests));
    } catch {
        throw new Error('Browser storage is unavailable or full. Your request was not saved.');
    }
}

export function resetRequests(storage = localStorage) {
    try {
        storage.removeItem(storageKey);
    } catch {
        throw new Error('Browser storage could not be reset. Check browser storage permissions.');
    }
}
