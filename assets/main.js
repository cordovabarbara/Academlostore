
async function getItems(){
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );

        const data1 = await data.json();

        localStorage.setItem("products", JSON.stringify(data1));

        return data1;
    }
        catch (error){
    }
}


function viewProducts(articlesData) {
    const itemsHTML = document.querySelector(".items");

    let html ='';

    for (const item of articlesData.articles) {
        const buttonPlus = item.quantity ? `<i class='bx bx-plus' id='${item.id}'></i>` 
        : "<span class='sold_out'>Sold Out</span>";
        
        html +=`
        <div class="items ${item.category}">
            <div class="item_img"> 
                <img src="${item.image}" alt="Image" />
            </div>
            <div class="item_info"> 
                <h3>$${item.price}.00<span><b> Stock: ${item.quantity}</span></b></h4>${buttonPlus}
                <h4>
                ${item.name} 
                </h4>
            </div>
        </div>
        `;
    }

    itemsHTML.innerHTML = html;
}

function displayBag() {

    const iconBagHTML = document.querySelector (".bx-shopping-bag");
    const bagItemsHTML = document.querySelector (".bag");

    iconBagHTML.addEventListener("click", function(){
    bagItemsHTML.classList.toggle("bag_show")
    
});
    
}

function addToBagFromProducts(articlesData) {
    const itemsHTML = document.querySelector(".items");

    itemsHTML.addEventListener("click", function(add){
        if (add.target.classList.contains("bx-plus")){
            const id = Number(add.target.id);

            const itemFind = articlesData.articles.find(
                (product) => product.id === id
            );
            
        if(articlesData.cart[itemFind.id]){
            if(itemFind.quantity === articlesData.cart[itemFind.id].amount) 
                return alert ('Out of stock');
            articlesData.cart[itemFind.id].amount++;
        } else {
            articlesData.cart[itemFind.id] = {...itemFind, amount:1};
        }

        localStorage.setItem("cart", JSON.stringify(articlesData.cart))
        displayItemsInBag(articlesData);
        totalItemsInsideBag(articlesData);
        CountItemsInBag(articlesData);
        }
    });
    
}

function displayItemsInBag(articlesData) {
    const bagItemsHTML = document.querySelector(".bag_items")

    let html = ''

    for (const item in articlesData.cart) {
        const {quantity, price, name, image, id, amount} = articlesData.cart[item]

        html += `
            <div class="bag_item">
                <div class="bag_item-img">
                    <img src="${image}" alt="imagen"/>
                </div>
                <div class="bag_item-body">
                    <h4>${name}</h4>
                    <p>Stock ${quantity} | $${price}.00</p>
                    <p>${'Subtotal:'} ${price*amount}.00</p>

                    <div class="bag_item-body-op" id='${id}'>
                    <i class='bx bxs-minus-circle'></i>
                    <span>${amount} Unit</span>
                    <i class='bx bxs-plus-circle'></i>
                    <i class='bx bx-trash'></i>
                    </div>
                </div>
            </div>
        `;
}
    bagItemsHTML.innerHTML = html
    
    
}

function addItemsInsideBag(articlesData) {
    
    const bagItemsHTML = document.querySelector(".bag_items");
    
    bagItemsHTML.addEventListener("click", function(add){
        if (add.target.classList.contains("bxs-plus-circle")){
            const id = Number(add.target.parentElement.id);
            const itemFind = articlesData.articles.find(
            (product) => product.id === id
        );

        if(itemFind.quantity === articlesData.cart[itemFind.id].amount) 
        return alert ('Out of stock');
        articlesData.cart[id].amount++; 
    }

        if (add.target.classList.contains("bxs-minus-circle")){
            const id = Number(add.target.parentElement.id);
                if (articlesData.cart[id].amount === 1){
                const answer = confirm('Are you sure you want to delete this product?');
                if(!answer) return;
                delete articlesData.cart[id];
        } else {
            articlesData.cart[id].amount--;
    }
}
        if (add.target.classList.contains("bx-trash")){
            const id = Number(add.target.parentElement.id);
            const answer = confirm('Are you sure you want to cancel this purchase?');
            if(!answer) return;
            delete articlesData.cart[id]
    }   

    localStorage.setItem('cart', JSON.stringify(articlesData.cart));
    displayItemsInBag(articlesData);
    totalItemsInsideBag(articlesData);
    CountItemsInBag(articlesData);
    });
}

function totalItemsInsideBag(articlesData) {
    const infcountItems = document.querySelector('.inf_countitems')
    const infTotal = document.querySelector('.inf_total')

    let totalCountItems = 0;
    let totalAmountItems = 0;

        for (const item in articlesData.cart) {
            const {amount, price} = articlesData.cart[item];
            totalCountItems += amount;
            totalAmountItems += price*amount;
    } 

    infcountItems.textContent = totalCountItems + " units";
    infTotal.textContent = "Total: " + "$" + totalAmountItems + ".00";
    
}

function handleBtnTotal(articlesData) {
    
    const btnBuy = document.querySelector(".btn_buy");

    btnBuy.addEventListener("click", function() {
        if(!Object.values(articlesData.cart).length) 
            return alert("Please add items to make the purchase");

        const response = confirm("Are you sure you want to make the purchase?");
        if (!response) return;
        
        const currentItems = [];

        for (const item of articlesData.articles) {
            const itemCart = articlesData.cart[item.id];
            if(item.id === itemCart?.id){
                currentItems.push({...item,
                quantity: item.quantity - itemCart.amount});

        } else {
            currentItems.push(item);
        }

        }

        articlesData.articles = currentItems;
        articlesData.cart = {};

        localStorage.setItem("articles", JSON.stringify(articlesData.articles));
        localStorage.setItem("cart", JSON.stringify(articlesData.cart));

        totalItemsInsideBag(articlesData);
        displayItemsInBag(articlesData);
        viewProducts(articlesData);
        CountItemsInBag(articlesData);
    });
    
}

function CountItemsInBag(articlesData) {
    const totalProducts = document.querySelector(".totalProducts");
    let amount = 0

    for (const item in articlesData.cart) {
        amount += articlesData.cart[item].amount;
    }
    totalProducts.textContent = amount

}

function showMenuInMediaQ(){
    const bxMenu = document.querySelector(".bx-menu")
    const main = document.querySelector(".main")

    bxMenu.addEventListener('click', function() {
        main.classList.toggle("main__show")
        
    
})
}

function displayNavbar() {
    const navBarHTML = document.querySelector(".navbar")
    window.addEventListener("scroll", function () {
        if(window.scrollY > 200) {
        navBarHTML.classList.add("navbar__display")
    } else {
        navBarHTML.classList.remove("navbar__display");
    }
})
    
}

function displayFilter(){

        mixitup(".items", {
        selectors: {
            target: ".item",
        },
        animation: {
            duration: 300,

        },
    });
        
    }
    

async function main() {
    const articlesData = {
            articles: 
            JSON.parse(window.localStorage.getItem("products")) || (await getItems()),
            cart: JSON.parse(localStorage.getItem("cart")) || {},
    };

    viewProducts(articlesData);
    displayBag ();
    addToBagFromProducts(articlesData);
    displayItemsInBag(articlesData);
    addItemsInsideBag(articlesData);
    totalItemsInsideBag(articlesData);
    handleBtnTotal(articlesData);
    CountItemsInBag(articlesData);
    showMenuInMediaQ();
    displayNavbar();
    displayFilter();


}


main() 

