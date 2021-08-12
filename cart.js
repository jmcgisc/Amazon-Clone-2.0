function getCartItems(){
    db.collection("cart-items").onSnapshot((snapshot) => {
    let cartItems = [];

    snapshot.docs.forEach((doc) => {
        cartItems.push({ 
                id: doc.id,
                ...doc.data()
            })
        })
        generateCartItems(cartItems);
        getTotalCost(cartItems);
    })
}

function getTotalCost(items){
    let totalCost = 0;
    items.forEach((item)=>{
        totalCost += (item.price * item.quantity);
    })
    document.querySelector(".total-cost-number").innerText = 
    numeral(totalCost).format('$0,0.00');
} 

function decreaseCount(itemId) {
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then(function(doc) {
        if(doc.exists){
                if(doc.data().quantity > 1) {
                    cartItem.update({
                        quantity: doc.data().quantity -1
                    })
                }
        }
    })
}

function increaseCount(itemId) {
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then(function(doc) {
        if(doc.exists){
                if(doc.data().quantity > 0) {
                    cartItem.update({
                        quantity: doc.data().quantity +1
                    })
                }
        }
    })
}

function deleteItem(itemId) {
    db.collection("cart-items").doc(itemId).delete();
}

    function  generateCartItems(cartItems){
        let itemsHTML = "";
        cartItems.forEach((item)=>{
            itemsHTML += ` 
                <div class="cart-item flex items-center pb-4 border-b border-gray-100">
                <div class="cart-item-image w-40 h-24 bg-white p-4 roudended-lg">
                    <img class= "object-contain w-full h-full" src="${item.image}">
                </div>
                <div class="cart-item-details flex-grow">
                    <div class="cart-item-title font-bold text-sm text-gray-600">
                    ${item.name}
                    </div>
                    <div class='cart-item-brand text-sm text-gray-400'>
                    ${item.make}
                    </div> 
                </div> 

                    <div class="cart-item-counter w-48 flex items-center">
                        <div data-id="${item.id}"   class ="cart-item-decrease">
                            <svg xmlns="http://www.w3.org/2000/svg" class="hover:text-gray-200 cursor-pointer mr-2 h-5 w-5 text-gray-400 bg-gray-100 rounded" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg> 
                        </div>
                            <h4 class="text-gray-400">${item.quantity}</h4>
                        <div data-id="${item.id}"  class ="cart-item-increase">
                            <svg xmlns="http://www.w3.org/2000/svg" class="hover:text-gray-200 cursor-pointer ml-2 h-5 w-5 f text-gray-400 bg-gray-100 rounded " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>     
                    </div> 

                    <div class="cart-item-total-cost w-48 font-bold text-gray-400">
                    ${numeral(item.price * item.quantity).format('$0,0.00')}
                    </div>      
                    <div  data-id="${item.id}" class="cart-item-delete w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 font-bold text-gray-300 cursor-pointer hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
                      </svg>
                </div>
            </div>  
            `
        })
        document.querySelector(".cart-items").innerHTML = itemsHTML;
        createEventListeners();
    }
    
    function createEventListeners(){
        let decreaseButtons = document.querySelectorAll(".cart-item-decrease");
        let increaseButtons = document.querySelectorAll(".cart-item-increase");
        let deleteButton = document.querySelectorAll(".cart-item-delete");

        decreaseButtons.forEach((button)=>{
            button.addEventListener("click", function(){
                decreaseCount(button.dataset.id);
            })
        })

        increaseButtons.forEach((button)=>{
            button.addEventListener("click", function(){
                increaseCount(button.dataset.id);
            })
        })

        deleteButton.forEach((button) =>{
            button.addEventListener("click",function(){
                deleteItem(button.dataset.id);
            })
        })
        
    }

getCartItems();