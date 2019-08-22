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
                active: false
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
                this.lifeDurationInTicks = this.originalLifeDuration * ((Shop.has('anchor') && Shop.boost('anchor').isActive()) ? 2 : 1);
                this.saveableState.buyable = true;
            },
            lock: function() {
                this.saveableState.buyable = false;
                this.saveableState.bought = false;
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
            xpBarColor: settings.xpBarColor || 'lightgray',
            hasXP: settings.hasXP || false,
            gainXP: function(amount) {
                if (this.saveableState.xpGained == null) this.saveableState.xpGained = 0;
                this.saveableState.xpGained += amount;
                let isFull = this.saveableState.xpGained >= this.xpNeededToBeFull;
                if (isFull && typeof(settings.isFullXP) === typeof(Function)) {
                    settings.isFullXP(this);
                }
            },
            getFullnessPercent: function() {
                if (!this.saveableState.xpGained) return 0;
                if (!this.xpNeededToBeFull) return 0;
                if (this.saveableState.xpGained >= this.xpNeededToBeFull) return 100;
                return (this.saveableState.xpGained / this.xpNeededToBeFull) * 100;
            },
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
                        this.die();
                    }
                }
            },
            die: function(manual) {
                this.lock();
                Game.ephemeralDeath(this, manual);
            },
            getEphemeralDescription: function(Display) {
                let lifeInSeconds = Math.round(boost.lifeDurationInTicks / Display.framesPerSecond());
                let desc = 'This boost is ephemeral. It will only stay for '
                        + lifeInSeconds
                        + ' sec before being locked again.';

                if (Shop.has('unritualisticsacrifice')) {
                    desc += '<br/>Or, you can just <a class="kill-ethereal red-glow" onclick="gameObjects.Game.getModule(\'bip\').kill(\'' + this.shortName + '\')">kill it</a> now for its blood.';
                }
                
                return desc;
            },
            isLoot: settings.isLoot || false,
            buyButtonLabel: settings.buyButtonLabel || 'Buy'
        }

        Shop.boosts.push(boost);
    }

})(gameObjects.Shop, gameObjects.Game, gameObjects.Boosts);