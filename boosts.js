/*
*
* Mouse Pro
*
* Shop.js
*/

(function (Shop, Game, Boosts) {

    Boosts.newBoost = function(settings) {
        let boost = {
            ...settings,
            saveableState: {
                buyable: false,
                bought: false,
                power: settings.power || 0,
                active: false,
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
            lock: function() {
                this.saveableState.buyable = false;
                this.saveableState.bought = false;

                if (this.ephemeral)
                    this.lifeDurationInTicks = this.originalLifeDuration * (Shop.has('anchor') ? 2 : 1);
            },
            isUnlocked: function() {
                return this.saveableState.buyable;
            },
            canBuy: settings.canBuy || function() {
                return true;
            },
            isBought: function() {
                return this.saveableState.bought;
            },
            isActivable: settings.isActivable || false,
            isActive: function() {
                return this.saveableState.active;
            },
            deactivate: function() {
                this.saveableState.active = false;
            },
            activate: function() {
                this.saveableState.active = true;
            },
            originalLifeDuration: settings.lifeDurationInTicks,
            tick: function() {
                if (this.ephemeral == true && this.isUnlocked()) {
                    this.lifeDurationInTicks--;
                    if (this.lifeDurationInTicks <= 0) {
                        this.lifeDurationInTicks = this.originalLifeDuration * (Shop.has('anchor') ? 2 : 1);
                        this.lock();
                        Game.ephemeralDeath(this);
                    }
                }
            },
            getEphemeralDescription: function(Display) {
                let lifeInSeconds = Math.round(boost.lifeDurationInTicks / Display.framesPerSecond());
                return 'This boost is ephemeral. It will only stay for '
                        + lifeInSeconds
                        + ' sec before being locked again.';
            }
        }

        Shop.boosts.push(boost);
    }

})(gameObjects.Shop, gameObjects.Game, gameObjects.Boosts);