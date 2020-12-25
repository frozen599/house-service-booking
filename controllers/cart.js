'use strict';

module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.address = oldCart.address || {};
    this.paymentMethod = oldCart.paymentMethod || "COD";

    this.totalQuantity = () => {
        var quantity = 0;
        for(var id in this.items){
            quantity += parseInt(this.items[id].quantity);
        }
        return quantity;
    };

    this.totalPrice = () => {
        var price = 0;
        for(var id in this.items){
            price += parseInt(this.items[id].price);
        }
        price = parseInt(price);
        return price;
    };

    this.add = (item,id) => {
        var storedItem = this.items[id];
        if(!storedItem){
            this.items[id] = { item: item, quantity: 0, price: 0};
            storedItem = this.items[id];
        }
        storedItem.item.price = parseInt(storedItem.item.price);
        storedItem.quantity++;
        storedItem.price = parseInt(storedItem.quantity * storedItem.item.price);
    };

    this.remove = (id) => {
        var storedItem = this.items[id];
        if(storedItem){
            this.items[id] = undefined;
        }
    };

    this.update = (id,quantity) => {
        var storedItem = this.items[id];
        if(storedItem && quantity >= 1){
            storedItem.quantity = quantity;
            storedItem.price = parseInt(storedItem.quantity * storedItem.item.price);
        }
        else{
            alert("fail!");
        }
    };

    this.empty = () => {
        this.items = {};
    };

    this.generateArray = () => {
        var arr = [];
        for( var id in this.items){
            this.items[id].item.price = parseInt(this.items[id].item.price);
            this.items[id].price = parseInt(this.items[id].price);
            arr.push(this.items[id]);
        }
        return arr;
    };
};