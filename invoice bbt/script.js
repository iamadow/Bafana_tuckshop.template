// ==========================================
// INVOICE GENERATOR
// ==========================================

let items = [];

// Get elements
const itemName = document.getElementById("itemName");
const quantity = document.getElementById("quantity");
const unitPrice = document.getElementById("unitPrice");

const addItemBtn = document.getElementById("addItemBtn");
const generateBtn = document.getElementById("generateBtn");

const subtotalElement = document.getElementById("subtotal");
const itemCountElement = document.getElementById("itemCount");


// ==========================================
// ADD ITEM
// ==========================================

function addItem() {

    const name = itemName.value.trim();
    const qty = Number(quantity.value);
    const price = Number(unitPrice.value);

    // Validation
    if (name === "") {
        alert("Please enter the item name.");
        itemName.focus();
        return;
    }

    if (qty <= 0) {
        alert("Please enter a valid quantity.");
        quantity.focus();
        return;
    }

    if (price <= 0) {
        alert("Please enter a valid unit price.");
        unitPrice.focus();
        return;
    }


    // Save item
    const item = {
        name: name,
        quantity: qty,
        unitPrice: price
    };

    items.push(item);


    // Update total
    updateSubtotal();


    // Update item counter
    updateItemCount();


    // ==========================================
    // CLEAR INPUTS
    // ==========================================

    itemName.value = "";
    quantity.value = "1";
    unitPrice.value = "";


    // Put cursor back in item name
    itemName.focus();
}


// ==========================================
// UPDATE SUBTOTAL
// ==========================================

function updateSubtotal() {

    let subtotal = 0;

    items.forEach(item => {

        subtotal +=
            item.quantity * item.unitPrice;

    });

    subtotalElement.textContent =
        formatCurrency(subtotal);
}


// ==========================================
// UPDATE ITEM COUNT
// ==========================================

function updateItemCount() {

    const count = items.length;

    itemCountElement.textContent =
        count === 1
            ? "1 item added"
            : `${count} items added`;
}


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(amount) {

    return "R" + Number(amount).toFixed(2);
}


// ==========================================
// GENERATE INVOICE
// ==========================================

function generateInvoice() {

    // Make sure there is at least one item
    if (items.length === 0) {

        alert("Please add at least one item.");

        itemName.focus();

        return;
    }


    // Save items
    localStorage.setItem(
        "invoiceItems",
        JSON.stringify(items)
    );


    // Generate invoice number
    const invoiceNumber =
        generateInvoiceNumber();

    localStorage.setItem(
        "invoiceNumber",
        invoiceNumber
    );


    // Save date
    localStorage.setItem(
        "invoiceDate",
        new Date().toISOString()
    );


    // Go to invoice page
    window.location.href =
        "invoice.html";
}


// ==========================================
// GENERATE INVOICE NUMBER
// ==========================================

function generateInvoiceNumber() {

    const number =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return `INV-${number}`;
}


// ==========================================
// LOAD INVOICE PAGE
// ==========================================

function loadInvoice() {

    const invoiceItems =
        document.getElementById("invoiceItems");

    // We're not on invoice.html
    if (!invoiceItems) return;


    const savedItems =
        JSON.parse(
            localStorage.getItem("invoiceItems")
        );


    if (!savedItems || savedItems.length === 0) {

        window.location.href =
            "index.html";

        return;
    }


    // Invoice number
    const invoiceNumber =
        localStorage.getItem("invoiceNumber");

    document.getElementById(
        "invoiceNumber"
    ).textContent =
        "#" + invoiceNumber;


    // Invoice date
    const invoiceDate =
        localStorage.getItem("invoiceDate");

    document.getElementById(
        "invoiceDate"
    ).textContent =
        formatDate(invoiceDate);


    // Clear table
    invoiceItems.innerHTML = "";


    let subtotal = 0;


    // Add products to table
    savedItems.forEach(item => {

        const total =
            Number(item.quantity) *
            Number(item.unitPrice);


        subtotal += total;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(item.name)}
            </td>

            <td>
                ${item.quantity}
            </td>

            <td>
                ${formatCurrency(item.unitPrice)}
            </td>

            <td>
                ${formatCurrency(total)}
            </td>

        `;


        invoiceItems.appendChild(row);

    });


    // Subtotal
    document.getElementById(
        "invoiceSubtotal"
    ).textContent =
        formatCurrency(subtotal);


    // Total
    document.getElementById(
        "invoiceTotal"
    ).textContent =
        formatCurrency(subtotal);
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-ZA",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ==========================================
// NEW INVOICE
// ==========================================

function newInvoice() {

    localStorage.removeItem(
        "invoiceItems"
    );

    localStorage.removeItem(
        "invoiceNumber"
    );

    localStorage.removeItem(
        "invoiceDate"
    );


    window.location.href =
        "index.html";
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ==========================================
// BUTTON EVENTS
// ==========================================

if (addItemBtn) {

    addItemBtn.addEventListener(
        "click",
        addItem
    );
}


if (generateBtn) {

    generateBtn.addEventListener(
        "click",
        generateInvoice
    );
}


// ==========================================
// INVOICE PAGE
// ==========================================

loadInvoice();