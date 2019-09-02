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
        if (Shop.has('tor') && !Achievements.has('tor')) {
            Achievements.gain('tor');
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
        if (Shop.has('newsletter') && gameModule._ticks % (5 * 60 * Display.framesPerSecond()) == 0) {
            gameModule.receiveNewsletter();
        }
        if (Shop.has('police') && Shop.boost('police').saveableState.xpGained > 0 && gameModule._ticks % (30 * Display.framesPerSecond()) == 0) {
            Shop.boost('police').gainXP(-1);
            Display.notify('Heat from the police fades a bit', 'Police');
        }
        if (gameModule._ticks >= 60*60*Display.framesPerSecond()) {
            gameModule._ticks = 0;
        }
    }

    gameModule.buyPackage = function buyPackage() {
        if (!Shop.has('fan') && Shop.has('backyard')) {
            if (Shop.boost('backyard').saveableState.power >= 1) {
                Shop.boost('backyard').saveableState.power--;
                Shop.unlock('fan');
                Shop.boost('fan').saveableState.bought = true;
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
        let boost = Shop.boost(shortName);
        boost.repair();
        if (!boost.isRepaired())
            Display.notify('You repaired ' + boost.name + ' once', 'repair');
        else 
            Display.notify(boost.name + ' is fully repaired !', 'repair');
    }

    Game.module('dd', gameModule);

})(gameObjects.Game, gameObjects.Shop, gameObjects.Achievements, gameObjects.Display, gameObjects.Currencies, gameObjects.Friends, gameObjects.Loot);