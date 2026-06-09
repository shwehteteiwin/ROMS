const statusList = ["Received","Cooking","Ready","Completed"];

const statusMap = {
    RECEIVED: 0,
    COOKING: 1,
    READY: 2,
    COMPLETED: 3
};

let orders = [];

async function loadOrders(){

    try{

        const response = await fetch("/api/orders/customer");
        const data = await response.json();

        orders = data;

        renderBoard();

    }catch(error){
        console.error("Failed to load orders:", error);
    }

}

/* ---------- Create Order Card ---------- */

function createOrderCard(item){

    const card = document.createElement("div");
    card.className = "order-card";

    const itemName = document.createElement("div");
    itemName.className = "item-name";
    itemName.innerText = item.name;

    const qty = document.createElement("div");
    qty.className = "qty";
    qty.innerText = "Qty : " + item.qty;

    const bill = document.createElement("div");
    bill.className = "bill";
    bill.innerText = item.price * item.qty + " Ks";

    card.appendChild(itemName);
    card.appendChild(qty);
    card.appendChild(bill);

    return card;
}

/* ---------- Create Order Column ---------- */

function createOrderColumn(order){

    const column = document.createElement("div");
    column.className = "table-column";

    const orderId = document.createElement("div");
    orderId.className = "order-id";
    orderId.innerText = "Order ID : " + order.orderId;

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "orders-container";

    const completeBtn = createCompleteButton(order);

    order.items.forEach(item => {

        const card = createOrderCard(item);
        itemsContainer.appendChild(card);

    });

    const status = document.createElement("div");
    status.className = "status";
    status.innerText = "Status : " + order.status;

    const tableTitle = document.createElement("div");
    tableTitle.className = "table-title";

    tableTitle.innerHTML = `
        <span>Table : ${order.tableId}</span>
        <span>Total : ${order.totalAmount} Ks</span>
    `;

    column.appendChild(orderId);
    column.appendChild(itemsContainer);
    column.appendChild(status);
    column.appendChild(tableTitle);
    if(completeBtn){
        column.appendChild(completeBtn);
    }

    return column;
}
//------------create completed btn-----------------
function createCompleteButton(order){

    if(order.status !== "READY"){
        return null;
    }

    const btn = document.createElement("button");
    btn.className = "complete-btn";
    btn.innerText = "Completed";

    btn.onclick = async () => {

        try{

            await fetch(`/api/orders/${order.orderId}/status`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    status:"COMPLETED"
                })
            });

            loadOrders();

        }catch(error){
            console.error("Failed to update status:",error);
        }

    };

    return btn;
}
/* ---------- Render Board ---------- */

function renderBoard(){

    const board = document.getElementById("board");
    board.innerHTML = "";

    orders.forEach(order => {

        const column = createOrderColumn(order);
        board.appendChild(column);

    });

}

/* ---------- Initialize ---------- */

loadOrders();
setInterval(loadOrders,3000);