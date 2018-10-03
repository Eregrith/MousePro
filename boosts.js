/*
*
* Mouse Pro
*
* Shop.js
*/

(function (Shop, Boosts) {

    Boosts.newBoost = function(settings) {
        let boost = {
            ...settings,
            saveableState: {
                buyable: false,
                bought: false,
            },
            getCost: function () {
                return this.cost;
            },
            buy: function () {
                if (!this.saveableState.buyable) return;

                this.saveableState.buyable = false;
                this.saveableState.bought = true;

                if (settings.buy)
                    settings.buy(this);
            },
            unlock: function() {
                this.saveableState.buyable = true;
            },
            canBuy: settings.canBuy || function() {
                return this.saveableState.buyable;
            },
            isBought: function() {
                return this.saveableState.bought;
            }
        }

        Shop.boosts.push(boost);
    }

})(gameObjects.Shop, gameObjects.Boosts);