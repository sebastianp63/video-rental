module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0; 
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item,id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, price: 0};
        }
    
         this.totalQty++;
         this.totalPrice += storedItem.item.sale_price;

    }

    this.isExist = function(id) {
        const item = this.items[id];
        if(item){
            return true;
        } 
        return false;
    }

    this.deleteItem = function(id){
        this.totalPrice -= this.items[id].item.sale_price;
        this.totalQty--;
        delete this.items[id];

    }

    this.generateArray = function(){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};