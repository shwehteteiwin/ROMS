/* ---------- Status List ---------- */
const statusList = [
    "Received",
    "Cooking",
    "Ready",
    "Completed"
];

const statusMap = {
    RECEIVED: 0,
    COOKING: 1,
    READY: 2,
    COMPLETED: 3
};


/* ---------- Orders Array ---------- */
let orders = [];


/* ---------- Fetch Orders From Backend ---------- */
async function loadOrders() {

    try {

        const response = await fetch("http://localhost:8080/api/orders/kitchen");
        const data = await response.json();

        orders = [];

        data.forEach(order => {

            order.items.forEach((item, index) => {

                orders.push({
                    orderId: order.orderId,
                    tableNo: order.tableId,
                    item: item.name,
                    qty: item.quantity,
                    status: statusMap[order.status],
                    index: index
                });

            });

        });

        renderBoard();

    } catch (error) {
        console.error("Failed to load orders:", error);
    }

}


/* ---------- Group Orders By Order ID ---------- */
function groupOrdersByOrderId() {

    const grouped = {};

    orders.forEach(order => {

        if (!grouped[order.orderId]) {
            grouped[order.orderId] = [];
        }

        grouped[order.orderId].push(order);

    });

    return grouped;
}


/* ---------- Create Status Buttons ---------- */
function createStatusButtons(order) {

    const btnContainer = document.createElement("div");
    btnContainer.className = "status-buttons";

    statusList.forEach((status, i) => {

        const button = document.createElement("button");
        button.innerText = status;

        /* Highlight current status */
        if (order.status === i) {
            button.classList.add("active");
        }

        /* Disable previous statuses */
        if (i < order.status) {
            button.disabled = true;
        }

        // Completed button only for view
        if(status === "Completed"){
            button.disabled = true;
        }else{
            button.onclick = async () => {

                const newStatus = status.toUpperCase();

                try {

                    await fetch(`http://localhost:8080/api/orders/${order.orderId}/status`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            status: newStatus
                        })
                    });

                    loadOrders();

                } catch (error) {
                    console.error("Status update failed:", error);
                }

            };
        }

        btnContainer.appendChild(button);

    });

    return btnContainer;
}


/* ---------- Create Order Card ---------- */
function createOrderCard(order) {

    const card = document.createElement("div");
    card.className = "order-card";

    const item = document.createElement("div");
    item.className = "item-name";
    item.innerText = order.item;

    const qty = document.createElement("div");
    qty.className = "qty";
    qty.innerText = "Qty: " + order.qty;
    
    if(order.status === statusMap["COMPLETED"]){
        card.classList.add("completed");
    }
    card.appendChild(item);
    card.appendChild(qty);

    return card;
}


/* ---------- Create Table Column ---------- */
function createTableColumn(orderId, tableOrders) {

    const column = document.createElement("div");
    column.className = "table-column";


    /* ---------- Order ID ---------- */
    const orderTitle = document.createElement("div");
    orderTitle.className = "order-id";
    orderTitle.innerText = "Order ID: " + orderId;


    /* ---------- Orders Container ---------- */
    const ordersContainer = document.createElement("div");
    ordersContainer.className = "orders-container";


    /* Keep item order stable */
    tableOrders
        .sort((a, b) => a.index - b.index)
        .forEach(order => {

            const card = createOrderCard(order);
            ordersContainer.appendChild(card);

        });


    /* ---------- Status Buttons ---------- */
    const buttons = createStatusButtons(tableOrders[0]);


    /* ---------- Table Number ---------- */
    const tableTitle = document.createElement("div");
    tableTitle.className = "table-title";
    tableTitle.innerText = "Table " + tableOrders[0].tableNo;


    column.appendChild(orderTitle);
    column.appendChild(ordersContainer);
    column.appendChild(buttons);
    column.appendChild(tableTitle);

    return column;

}


/* ---------- Render Board ---------- */
function renderBoard() {

    const board = document.getElementById("board");
    board.innerHTML = "";

    const groupedOrders = groupOrdersByOrderId();

            Object.keys(groupedOrders)
            .sort((a, b) => {

                const statusA = groupedOrders[a][0].status;
                const statusB = groupedOrders[b][0].status;

                const completedIndex = statusMap["COMPLETED"];

                const aCompleted = statusA === completedIndex;
                const bCompleted = statusB === completedIndex;

                /* Push completed orders to end */
                if (aCompleted && !bCompleted) return 1;
                if (!aCompleted && bCompleted) return -1;

                /* Otherwise sort by order ID */
                return a - b;

            })
            .forEach(orderId => {

            const column = createTableColumn(
                orderId,
                groupedOrders[orderId]
            );

            board.appendChild(column);

        });

}


/* ---------- Initialize ---------- */

loadOrders();

/* Auto refresh kitchen screen every 3 seconds */
setInterval(loadOrders, 3000);