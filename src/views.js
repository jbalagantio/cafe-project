import { products } from './data.js';
import { money, total, cartItems, statuses } from './orders.js';

// Escape customer-provided text before including it in screen markup.
export const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[character]));

const badge = status => (
    `<span class="badge ${
        status === 'Confirmed'
            ? 'confirmed'
            : status === 'Declined'
                ? 'declined'
                : ''
    }">${status}</span>`
);
const reference = id => escape(id);
const time = value => escape(new Date(value).toLocaleString('en-PH'));

// Shared navigation, footer, and accessible feedback.
export function shell(content, admin) {
    return `
        <header>
            <a class="brand" href="/">little table<span>NEIGHBORHOOD CAFE · SAMPLE BUSINESS</span></a>
            <nav aria-label="Main navigation">
                <a href="/" ${!admin ? 'aria-current="page"' : ''}>The menu</a>
                <a href="/admin" ${admin ? 'aria-current="page"' : ''}>Owner demo ↗</a>
            </nav>
        </header>
        <main>${content}</main>
        <footer>
            <div>
                <strong>A little demo. A lot of possibilities.</strong>
                <p>Use fictional customer details only. No payments or notifications.</p>
                <p>Orders are saved only in this browser. Separate devices do not share requests.</p>
            </div>
            <button class="text-button" id="reset">Reset demo data</button>
        </footer>
        <div id="message" role="status" aria-live="polite"></div>
    `;
}

// Customer catalog, cart, and request acknowledgment.
export function catalog(cart, acknowledgment, blocked) {
    const items = cartItems(cart);

    return `
        <section class="intro">
            <span class="eyebrow">SOMETHING GOOD, SOMETHING SIMPLE</span>
            <h1>Your next little<br>coffee break.</h1>
            <p>Browse a few favorites and send us an order request.<br>The business will confirm availability and fulfillment.</p>
            <span class="demo-tag">FRONTEND DEMO · ALL PRODUCTS & PRICES ARE SAMPLES</span>
        </section>
        ${acknowledgment ? `
            <section class="acknowledgment" tabindex="-1" id="ack">
                <span class="eyebrow">REQUEST RECEIVED</span>
                <h2>Thank you, ${escape(acknowledgment.customer.name)}.</h2>
                ${badge(acknowledgment.status)}
                <p>Your order request has been received and is awaiting confirmation from the business.</p>
                <p class="reference">${reference(acknowledgment.id)}</p>
                <p>Submission does not mean your order has been accepted.</p>
            </section>
        ` : ''}
        <div class="shop-layout">
            <section aria-labelledby="menu-title">
                <div class="section-heading">
                    <h2 id="menu-title">On the sample menu</h2>
                    <span>${products.length} little favorites</span>
                </div>
                <div class="products">
                    ${products.map(product => `
                        <article class="product">
                            <div
                                class="product-art ${product.tone}"
                                role="img"
                                aria-label="Illustration placeholder for ${product.name}"
                            >
                                <span aria-hidden="true">${product.icon}</span>
                                <small>IMAGE PLACEHOLDER</small>
                                ${!product.available ? '<span class="sold-out">Currently unavailable</span>' : ''}
                            </div>
                            <div class="product-content">
                                <span class="eyebrow">${product.category} · SAMPLE</span>
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                <div class="product-bottom">
                                    <strong>${money(product.price)}</strong>
                                    <button
                                        data-add="${product.id}"
                                        ${!product.available ? 'disabled' : ''}
                                        aria-label="Add ${product.name} to cart"
                                    >${product.available ? '+ Add' : 'Unavailable'}</button>
                                </div>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
            <aside class="cart" aria-labelledby="cart-title">
                <div class="section-heading">
                    <h2 id="cart-title">Your request</h2>
                    <span>${items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                </div>
                <p class="muted">A good break starts here.</p>
                <div class="cart-items">
                    ${items.length ? items.map(item => `
                        <div class="cart-item">
                            <div>
                                <strong>${item.name}</strong>
                                <small>${money(item.price)} each</small>
                            </div>
                            <div class="quantity-row">
                                <label for="qty-${item.id}">Quantity</label>
                                <input
                                    id="qty-${item.id}"
                                    data-quantity="${item.id}"
                                    type="number"
                                    min="1"
                                    max="999"
                                    step="1"
                                    required
                                    value="${item.quantity}"
                                >
                                <button
                                    class="text-button"
                                    data-remove="${item.id}"
                                    aria-label="Remove ${item.name}"
                                >Remove</button>
                                <strong>${money(item.price * item.quantity)}</strong>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="empty-cart">
                            <span aria-hidden="true">☕</span>
                            <p>Your table is empty.</p>
                            <small>Add something from the sample menu.</small>
                        </div>
                    `}
                </div>
                <div class="total">
                    <span>Estimated total</span>
                    <strong>${money(total(items))}</strong>
                </div>
                <form id="request-form">
                    <label for="customer-name">Customer name <span>(required)</span></label>
                    <input
                        id="customer-name"
                        name="name"
                        autocomplete="off"
                        required
                        maxlength="100"
                        placeholder="e.g. Alex Sample"
                    >
                    <label for="customer-contact">Contact number <span>(required)</span></label>
                    <input
                        id="customer-contact"
                        name="contact"
                        type="tel"
                        autocomplete="off"
                        required
                        minlength="7"
                        maxlength="25"
                        placeholder="Use a fictional number"
                    >
                    <label for="customer-notes">Notes <span>(optional)</span></label>
                    <textarea
                        id="customer-notes"
                        name="notes"
                        maxlength="1000"
                        rows="3"
                        placeholder="Anything you would like the business to know?"
                    ></textarea>
                    <p class="form-note">This is a request, subject to confirmation of availability and fulfillment by the business.</p>
                    <button
                        class="primary"
                        type="submit"
                        ${!items.length || blocked ? 'disabled' : ''}
                    >Submit order request</button>
                    <small class="privacy">Demo only. Please use fictional details.</small>
                </form>
            </aside>
        </div>
    `;
}

// Explicitly unsecured owner demo entry.
export function login() {
    return `
        <section class="login">
            <span class="eyebrow">BEHIND THE COUNTER</span>
            <h1>Hello, owner.</h1>
            <h2>Demo owner access — no real authentication.</h2>
            <p>This entry does not protect the dashboard. Anyone using this browser can open the owner demo and manage its sample requests.</p>
            <button class="primary" id="enter-owner">Enter owner demo</button>
            <a href="/">← Back to the sample menu</a>
        </section>
    `;
}

// Owner summary, request filtering, and the selected request's details.
export function dashboard(requests, filter, selected, blocked) {
    const visible = requests.filter(request => filter === 'All' || request.status === filter);
    const request = requests.find(item => item.id === selected);

    return `
        <section class="owner-heading">
            <span class="eyebrow">BEHIND THE COUNTER · OWNER DEMO</span>
            <h1>Requests at a glance.</h1>
            <p>Demo owner access — no real authentication.</p>
            <p>Contact customers through the business’s existing chat/text process. This demo sends no notifications.</p>
        </section>
        <div class="stats">
            ${statuses.map(status => `
                <div>
                    <strong>${requests.filter(item => item.status === status).length}</strong>
                    <span>${status}</span>
                </div>
            `).join('')}
        </div>
        <section>
            <div class="section-heading">
                <h2>Order requests</h2>
                <label>Show <select id="filter">${['All', ...statuses].map(status => `
                    <option ${status === filter ? 'selected' : ''}>${status}</option>
                `).join('')}</select></label>
            </div>
            <div class="requests">
                ${visible.length ? visible.slice().reverse().map(item => `
                    <article class="request-row">
                        <div>
                            <strong>${escape(item.customer.name)}</strong>
                            <small class="reference">${reference(item.id)}</small>
                            <small>${time(item.submittedAt)}</small>
                        </div>
                        ${badge(item.status)}
                        <strong>${money(total(item.items))}</strong>
                        <button data-open="${escape(item.id)}">View details →</button>
                    </article>
                `).join('') : `
                    <div class="empty-state">
                        <h3>No requests here yet.</h3>
                        <p>Requests matching this filter will appear here.</p>
                        <a href="/">Browse the sample menu →</a>
                    </div>
                `}
            </div>
        </section>
        ${request ? `
            <section class="details" id="details" tabindex="-1">
                <div class="section-heading">
                    <h2>Request details</h2>
                    <button id="close-details">Close</button>
                </div>
                <p class="reference">${reference(request.id)}</p>
                ${badge(request.status)}
                <p>Submitted ${time(request.submittedAt)}</p>
                <dl>
                    <dt>Customer</dt>
                    <dd>${escape(request.customer.name)}</dd>
                    <dt>Contact</dt>
                    <dd>${escape(request.customer.contact)}</dd>
                    <dt>Notes</dt>
                    <dd class="notes">${escape(request.customer.notes || 'No notes provided.')}</dd>
                </dl>
                <ul>
                    ${request.items.map(item => `
                        <li>
                            <span>${escape(item.name)} × ${item.quantity}<small>${money(item.price)} each</small></span>
                            <strong>${money(item.price * item.quantity)}</strong>
                        </li>
                    `).join('')}
                </ul>
                <div class="total">
                    <span>Estimated total</span>
                    <strong>${money(total(request.items))}</strong>
                </div>
                ${request.status === statuses[0] ? `
                    <div class="decision-actions">
                        <button
                            class="primary"
                            data-decision="Confirmed"
                            ${blocked ? 'disabled' : ''}
                        >Confirm request</button>
                        <button
                            data-decision="Declined"
                            ${blocked ? 'disabled' : ''}
                        >Decline request</button>
                    </div>
                ` : '<p>This request has already been decided. Further decisions are disabled.</p>'}
                <p class="form-note">Communicate the decision through your existing chat/text process. No notification is sent by this demo.</p>
            </section>
        ` : ''}
    `;
}
