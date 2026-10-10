import './style.css';
import { createRequest, setQuantity, decide } from './orders.js';
import { loadRequests, saveRequests, resetRequests, storageKey } from './storage.js';
import { shell, catalog, login, dashboard } from './views.js';

// Current screen and in-memory demo state.
const app = document.querySelector('#app');
const admin = location.pathname.replace(/\/$/, '') === '/admin';
let { requests, warning } = loadRequests();
let cart = {},
    acknowledgment = null,
    entered = false,
    filter = 'All',
    selected = null,
    submitting = false;

// Rendering and accessible feedback.
function announce(message) {
    document.querySelector('#message').textContent = message;
}

function render() {
    // Preserve unfinished customer fields when cart controls redraw the screen.
    const oldForm = document.querySelector('#request-form');
    const draft = oldForm ? Object.fromEntries(new FormData(oldForm)) : null;
    app.innerHTML = shell(
        admin
            ? entered
                ? dashboard(requests, filter, selected, !!warning)
                : login()
            : catalog(cart, acknowledgment, !!warning),
        admin
    );

    if (draft) {
        for (const [key, value] of Object.entries(draft)) {
            document.querySelector(`#request-form [name="${key}"]`).value = value;
        }
    }
    if (warning) {
        announce(warning);
    }
}

// Menu, owner decisions, and reset controls.
app.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled) {
        return;
    }

    try {
        if (button.id === 'reset') {
            if (!confirm('Reset this browser’s demo? All requests, decisions, and current cart items will be removed.')) {
                return;
            }
            resetRequests();
            requests = [];
            warning = '';
            cart = {};
            acknowledgment = null;
            selected = null;
            filter = 'All';
            render();
            document.querySelector('#request-form')?.reset();
            announce('Demo reset. All sample requests and cart items were cleared.');
        } else if (button.dataset.add) {
            cart = setQuantity(cart, button.dataset.add, (cart[button.dataset.add] || 0) + 1);
            render();
            document.querySelector(`[data-add="${button.dataset.add}"]`).focus();
            announce('Item added to your request.');
        } else if (button.dataset.remove) {
            delete cart[button.dataset.remove];
            render();
            document.querySelector('#cart-title').scrollIntoView({ block: 'nearest' });
            announce('Item removed.');
        } else if (button.id === 'enter-owner') {
            entered = true;
            render();
        } else if (button.dataset.open) {
            selected = button.dataset.open;
            render();
            document.querySelector('#details').focus();
        } else if (button.id === 'close-details') {
            const id = selected;
            selected = null;
            render();
            document.querySelector(`[data-open="${id}"]`)?.focus();
        } else if (button.dataset.decision) {
            if (warning) {
                throw new Error(warning);
            }

            const latest = loadRequests();
            if (latest.warning) {
                throw new Error(latest.warning);
            }

            const next = decide(latest.requests, selected, button.dataset.decision);
            saveRequests(next);
            requests = next;
            render();
            document.querySelector('#details').focus();
            announce(`Request ${button.dataset.decision.toLowerCase()}. Contact the customer through your existing chat/text process.`);
        }
    } catch (error) {
        announce(error.message);
    }
});

// Quantity and dashboard filter changes.
app.addEventListener('change', event => {
    if (event.target.dataset.quantity) {
        const id = event.target.dataset.quantity;
        try {
            cart = setQuantity(cart, id, event.target.value);
            render();
            document.querySelector(`[data-quantity="${id}"]`).focus();
            announce('Quantity and estimated total updated.');
        } catch (error) {
            event.target.value = cart[id];
            announce(error.message);
        }
    }

    if (event.target.id === 'filter') {
        filter = event.target.value;
        render();
        document.querySelector('#filter').focus();
    }
});

// Request submission: save successfully before clearing the cart.
app.addEventListener('submit', event => {
    if (event.target.id !== 'request-form') {
        return;
    }

    event.preventDefault();
    if (submitting) {
        return;
    }

    submitting = true;
    const button = event.target.querySelector('[type="submit"]');
    button.disabled = true;

    try {
        if (warning) {
            throw new Error(warning);
        }

        const request = createRequest(cart, Object.fromEntries(new FormData(event.target)));
        const latest = loadRequests();
        if (latest.warning) {
            throw new Error(latest.warning);
        }

        const next = [...latest.requests, request];
        saveRequests(next);
        requests = next;
        cart = {};
        acknowledgment = request;
        event.target.reset();
        render();
        document.querySelector('#ack').focus();
        announce('Order request received. Pending confirmation.');
    } catch (error) {
        button.disabled = false;
        announce(error.message);
    } finally {
        submitting = false;
    }
});

// Keep same-browser tabs in sync with saved demo requests.
window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
        const latest = loadRequests();
        requests = latest.requests;
        warning = latest.warning;
        render();
    }
});

render();
