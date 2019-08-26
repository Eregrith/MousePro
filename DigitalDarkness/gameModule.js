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
    
    gameModule.checkUnlocks = function() {
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
    };

    gameModule._ticks = 0;
    gameModule.tick = function() {
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
        if (gameModule._ticks >= 30 * Display.framesPerSecond()) {
            if (Shop.has('police')) Shop.boost('police').gainXP(-1);
            Display.notify('Heat from the police fades a bit');
            gameModule._ticks = 0;
        }
    }

    gameModule.gainPoliceInterest = function gainPoliceInterest(amount) {
        if (!Shop.has('police')) {
            Shop.boost('police').saveableState.bought = true;
        }
        Shop.boost('police').gainXP(amount);
    }

    Game.module('dd', gameModule);

})(gameObjects.Game, gameObjects.Shop, gameObjects.Achievements, gameObjects.Display, gameObjects.Currencies, gameObjects.Friends, gameObjects.Loot);