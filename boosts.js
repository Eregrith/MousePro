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
                power: settings.power || 0
            },
            getCost: function () {
                if (this.cost.xp == undefined)
                    this.cost.xp = {};
                if (this.cost.levels == undefined)
                    this.cost.levels = {};
                return this.cost;
            },
            getPower: function() {
                return this.saveableState.power;
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
            isUnlocked: function() {
                return this.saveableState.buyable;
            },
            canBuy: settings.canBuy || function() {
                return true;
            },
            isBought: function() {
                return this.saveableState.bought;
            }
        }

        Shop.boosts.push(boost);
    }

})(gameObjects.Shop, gameObjects.Boosts);