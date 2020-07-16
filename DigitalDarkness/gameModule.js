/*
*
* Mouse Pro
*
* Game Module.js
*/

(function (Game, Shop, Achievements, Display, Currencies, Friends, Loot) {

    let gameModule = {};

	Currencies.newCurrency({
		name: 'Dark web knowledge',
        shortName: 'DWK',
        color: 'var(--digital-color)',
        iconTag: '<i class="fa fa-search digital digital-glow currency-icon"></i>',
        icon: 'search digital digital-glow',
		xpRequiredForNextLevel: 5,
        isToBeDisplayedNormally: false,
        order: 3
	});
    
    gameModule.checkUnlocks = function checkUnlocks() {
        if (Game.currency('DWK').getXp() > 0 || Game.currency('DWK').getLevel() > 0) {
            Display.getModule('dd').displayCurrency('DWK');
            if (!Shop.isAvailable('favorites')) {
                Shop.unlock('favorites');
            }
        }
        if (Shop.isFullXP('oldtv') && !Achievements.has('betterthantape')) {
            Achievements.gain('betterthantape');
        }
        if (Game.currency('DWK').getLevel() > 0
            && !Shop.isAvailable('tor')) {
                Shop.unlock('tor');
        }
        if (Game.currency('DWK').getLevel() > 1
            && !Shop.isAvailable('adsl')) {
                Shop.unlock('adsl');
        }
        if (Game.currency('DWK').getLevel() > 5
            && !Shop.isAvailable('fiber')) {
                Shop.unlock('fiber');
        }
        if (Game.currency('DWK').getLevel() > 8
            && !Shop.isAvailable('lasergun')) {
                Shop.unlock('lasergun');
        }
        if (Shop.has('tor') && !Achievements.has('tor')) {
            Achievements.gain('tor');
        }
        if (Shop.has('lasergun') && Shop.hasRepaired('buzzlightyear') && !Shop.has('pewpew')) {
            Shop.unlock('pewpew');
        }
        if (!Shop.has('batteries') && (Shop.boosts.filter(b => b.isBought() && b.batteryPowered).length > 0)) {
            Shop.unlock('batteries');
        }
        if (!isFinite(Game.currency('MM').xpRequiredForNextLevel())
            && !isFinite(Game.currency('MC').xpRequiredForNextLevel())) {
                if (!Achievements.has('buzzlightyear'))
                    Achievements.gain('buzzlightyear');
                if (!Shop.isAvailable('buzzlightyear'))
                    Shop.unlock('buzzlightyear')
            }
        if (!isFinite(Game.currency('MM').getXp())
            && !isFinite(Game.currency('MC').getXp())) {
                if (!Achievements.has('beyondinfinity'))
                    Achievements.gain('beyondinfinity');
                if (!Shop.isAvailable('spaceshuttle'))
                    Shop.unlock('spaceshuttle');
            }
    };

    gameModule._ticks = 0;
    gameModule.tick = function tick() {
        gameModule._ticks++;
        if (Shop.boost('oldtv').isBrowsing()) {
            let baseXP = 1;
            if (Shop.has('adsl')) {
                baseXP += 1;
            }
            if (Shop.has('fiber')) {
                baseXP += 4;
            }
            Shop.boost('oldtv').gainXP(baseXP);
        }
        gameModule.updateBatteryLives();
        if (Shop.boost('giantrat').isUnlocked() && Shop.boost('pewpew').saveableState.power == 1) {
            Shop.boost('giantrat').buy();
        }
        if (Shop.boost('bolts').isUnlocked() && Shop.boost('giantmagnet').saveableState.power == 1) {
            Shop.boost('bolts').buy();
        }
        if (Shop.has('newsletter') && gameModule._ticks % (5 * 60 * Display.framesPerSecond()) == 0) {
            gameModule.receiveNewsletter();
        }
        if ((gameModule._ticks % Display.framesPerSecond() == 0) && Shop.hasRepaired('fan')) {
            Shop.boost('fan').saveableState.xpGained = (gameModule._ticks / Display.framesPerSecond()) % 30;
        }
        if (Shop.has('police') && Shop.boost('police').saveableState.xpGained > 0 && gameModule._ticks % (30 * Display.framesPerSecond()) == 0) {
            let baseXP = -1;
            if (Shop.hasRepaired('fan')) {
                baseXP *= 5;
                if (Shop.boost('fan').saveableState.power == 1) {
                    baseXP *= 3;
                }
                Shop.boost('fan').saveableState.xpGained = 0;
            }
            Shop.boost('police').gainXP(baseXP);
            Display.notify('Heat from the police fades a bit', 'Police');
        }
        if (gameModule._ticks >= 60*60*Display.framesPerSecond()) {
            gameModule._ticks = 0;
        }
    }

    gameModule.updateBatteryLives = function updateBatteryLives() {
        let batteryPoweredBoosts = Shop.boosts.filter(b => b.batteryPowered && b.saveableState.power == 1);
        batteryPoweredBoosts.forEach((boost) => {
            boost.drainBattery(1);
            if (boost.getBatteryLife() == 0) {
                boost.saveableState.power = 0;
                Display.notify("The battery is dead in ", boost.name);
            }
        });
    }

    gameModule.buyPackage = function buyPackage() {
        if (!Shop.has('fan') && Shop.has('backyard')) {
            if (Shop.boost('backyard').saveableState.power.nuts >= 1) {
                Shop.boost('backyard').saveableState.power.nuts--;
                Shop.unlock('fan');
                Shop.buy('fan');
                return;
            }
        }
        if (!Shop.has('syringe') && Shop.has('backyard')) {
            if (Shop.boost('backyard').saveableState.power.nuts >= 1) {
                Shop.boost('backyard').saveableState.power.nuts--;
                Shop.unlock('syringe');
                Shop.buy('syringe');
                return;
            }
        }
        if (!Shop.has('giantmagnet') && Shop.has('backyard')) {
            if (Shop.boost('backyard').saveableState.power.nuts >= 1) {
                Shop.boost('backyard').saveableState.power.nuts--;
                Shop.unlock('giantmagnet');
                Shop.buy('giantmagnet');
                return;
            }
        }
    }

    gameModule.receiveNewsletter = function receiveNewsletter() {
        let baseXP = 10;
        Game.acquireXp('DWK', baseXP);
        Display.notify('<i class="fa fa-envelope digital digital-glow"></i> You received a newsletter ! It gave you ' + baseXP + ' DWK xp !', 'Dark web');
    }

    gameModule.gainPoliceInterest = function gainPoliceInterest(amount) {
        if (!Shop.has('police')) {
            Shop.boost('police').saveableState.bought = true;
        }
        Shop.boost('police').gainXP(amount);
    }

    gameModule.repair = function repair(shortName) {
        if (Shop.boost('backyard').saveableState.power.nuts < 1) return;
        Shop.boost('backyard').saveableState.power.nuts--;
        let boost = Shop.boost(shortName);
        boost.repair();
        if (!boost.isRepaired())
            Display.notify('You repaired ' + boost.name + ' once', 'repair');
        else 
            Display.notify(boost.name + ' is fully repaired !', 'repair');
    }

    Game.module('dd', gameModule);

})(gameObjects.Game, gameObjects.Shop, gameObjects.Achievements, gameObjects.Display, gameObjects.Currencies, gameObjects.Friends, gameObjects.Loot);