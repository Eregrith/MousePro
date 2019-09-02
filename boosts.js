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
                boltsUsedToRepair: 0
            },
            category: settings.category || 'common',
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
                this.lifeDurationInTicks = this.originalLifeDuration
                * ((Shop.has('anchor') && Shop.boost('anchor').isActive())
                    ? 2
                    : (Shop.has('noxiousfumes') ? 0.2 : 1));
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
            getIcon: settings.getIcon || function() { return this.icon; },
            isActivable: settings.isActivable || false,
            xpBarColor: settings.xpBarColor || 'lightgray',
            hasXP: settings.hasXP || false,
            gainXP: function(amount) {
                if (this.saveableState.xpGained == null) this.saveableState.xpGained = 0;
                this.saveableState.xpGained += amount;
                if (this.saveableState.xpGained < 0) return this.saveableState.xpGained = 0;
                let isFull = this.saveableState.xpGained >= this.xpNeededToBeFull;
                if (isFull) {
                    this.isFullXP(this);
                }
            },
            _isFullXP: settings.isFullXP || function () {},
            isFullXP: function() {
                this._isFullXP(this);
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
            buyButtonLabel: settings.buyButtonLabel || 'Buy',
            repairable: settings.repairable || false,
            repairedName: settings.repairedName || settings.name,
            boltsNeededToRepair: settings.boltsNeededToRepair || 0,
            isRepaired: function() {
                return this.repairable && this.saveableState.boltsUsedToRepair == this.boltsNeededToRepair;
            },
            getRepairDescription: function() {
                let desc = '';
                if (this.isBought() && Shop.has('backyard') && !this.isRepaired()) {
                    desc += '<br/>You will need ' + (this.boltsNeededToRepair - (this.saveableState.boltsUsedToRepair || 0)) + ' <i class="fa fa-cog digital digital-glow"></i> to fix this.';
                    if (Shop.boost('backyard').saveableState.power >= 1) {
                        desc += '<br/><div class="btn repair" onclick="gameObjects.Game.getModule(\'dd\').repair(\'' + this.shortName + '\')">Use 1 <i class="fa fa-cog digital digital-glow"></i> to repair</div>';
                    }
                }
                return desc;
            },
            repair: function() {
                if (this.isBought() && Shop.has('backyard') && !this.isRepaired()) {
                    this.saveableState.boltsUsedToRepair++;
                }
                if (this.isRepaired()) {
                    this.name = this.repairedName;
                }   
            },
            onRestoreSave: function() {
                if (this.repairable && this.isRepaired()) {
                    this.name = this.repairedName;
                }
                if (typeof(settings.onRestoreSave) == typeof(Function)) {
                    settings.onRestoreSave(this);
                }
            },
        }

        Shop.boosts.push(boost);
    }

})(gameObjects.Shop, gameObjects.Game, gameObjects.Boosts);