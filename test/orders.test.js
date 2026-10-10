import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequest, setQuantity, cartItems, total, decide, quantity } from '../src/orders.js';
import { loadRequests, saveRequests, resetRequests, storageKey } from '../src/storage.js';

const customer = {
    name: 'Alex Sample',
    contact: '09000000000',
    notes: 'Fictional details'
};

const storage = () => {
    const values = new Map();

    return {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: key => values.delete(key)
    };
};

test('empty carts and invalid required fields cannot create requests', () => {
    assert.throws(() => createRequest({}, customer));

    for (const fields of [
        { name: ' ' },
        { contact: '' },
        { contact: 'abcdefg' },
        { contact: '-------' }
    ]) {
        assert.throws(() => createRequest({ latte: 1 }, {
            ...customer,
            ...fields
        }));
    }
});

test('quantities must be positive safe whole numbers', () => {
    for (const value of [0, -1, 1.5, '', 'abc', Infinity, 1000]) {
        assert.throws(() => quantity(value));
    }

    assert.equal(quantity('3'), 3);
});

test('unavailable and unknown products cannot be added or submitted', () => {
    for (const id of ['cake', 'unknown']) {
        assert.throws(() => setQuantity({}, id, 1));
        assert.throws(() => createRequest({ [id]: 1 }, customer));
    }
});

test('totals follow quantity changes and removal', () => {
    let cart = setQuantity({}, 'latte', 2);
    cart = setQuantity(cart, 'cookie', 3);
    assert.equal(total(cartItems(cart)), 535);
    cart = setQuantity(cart, 'latte', 1);
    assert.equal(total(cartItems(cart)), 380);
    delete cart.cookie;
    assert.equal(total(cartItems(cart)), 155);
});

test('new requests have unique references, pending status, and item snapshots', () => {
    const cart = { latte: 2 };
    const first = createRequest(cart, customer),
        second = createRequest(cart, customer);

    assert.equal(first.status, 'Pending confirmation');
    assert.notEqual(first.id, second.id);
    cart.latte = 9;
    assert.deepEqual(first.items[0], {
        id: 'latte',
        name: 'Spanish latte',
        price: 155,
        quantity: 2
    });
});

test('decisions affect only the selected pending request and cannot be repeated', () => {
    const first = createRequest({ latte: 1 }, customer),
        second = createRequest({ cookie: 1 }, customer);

    let requests = decide([first, second], second.id, 'Declined');
    assert.equal(requests[0].status, 'Pending confirmation');
    assert.equal(requests[1].status, 'Declined');
    requests = decide(requests, first.id, 'Confirmed');
    assert.equal(requests[0].status, 'Confirmed');
    assert.throws(() => decide(requests, first.id, 'Declined'));
    assert.throws(() => decide(requests, second.id, 'Confirmed'));
    assert.throws(() => decide(requests, 'missing', 'Confirmed'));
});

test('storage reload preserves snapshots and decisions; reset restores empty state', () => {
    const browser = storage();
    const request = createRequest({ latte: 2 }, customer);
    const requests = decide([request], request.id, 'Confirmed');
    saveRequests(requests, browser);
    assert.deepEqual(loadRequests(browser), {
        requests,
        warning: ''
    });
    resetRequests(browser);
    assert.deepEqual(loadRequests(browser), {
        requests: [],
        warning: ''
    });
});

test('missing, malformed, and inaccessible storage are handled gracefully', () => {
    const browser = storage();
    assert.deepEqual(loadRequests(browser).requests, []);
    for (const value of ['broken', '{}', '[null]', JSON.stringify([{ id: 'invalid' }])]) {
        browser.setItem(storageKey, value);
        assert.equal(loadRequests(browser).requests.length, 0);
        assert.ok(loadRequests(browser).warning);
    }
    const blocked = {
        getItem() {
            throw new Error();
        },
        setItem() {
            throw new Error();
        },
        removeItem() {
            throw new Error();
        }
    };
    assert.ok(loadRequests(blocked).warning);
    assert.throws(() => saveRequests([], blocked));
    assert.throws(() => resetRequests(blocked));
});
