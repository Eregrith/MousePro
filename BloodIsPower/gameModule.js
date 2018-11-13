/*
*
* Mouse Pro
*
* Game Module.js
*/

(function (Game, Shop, Achievements, Display, Currencies, Loot) {

    let gameModule = {};

	Currencies.newCurrency({
        name: 'Blood',
        shortName: 'blood',
        color: 'red',
        iconTag: '<i class="fa fa-tint currency-icon"></i>',
        xpRequiredForNextLevel: 101,
        acquireXp: function(me) {
            if (me.saveableState.xp >= xpRequiredForNextLevel) {
                me.saveableState.xp = xpRequiredForNextLevel - 1;
            }
        },
        isToBeDisplayedNormally: false
    });

    gameModule.checkUnlocks = function() {
        if (Shop.has('rubypommel')
         && Shop.has('diamondbladetip')
         && Shop.has('dragongrip')
         && Shop.has('serratedblade')
         && Shop.has('cheatersscabbard')
         && !Achievements.has('truekriss')) {
            Shop.unlock('truekriss');
            Achievements.gain('truekriss');
        }
    }

    gameModule.getSacrificeRatio = function() {
        let sacrificeRatio = 0.5;
        let knifeparts = [ 'serratedblade', 'rubypommel',  'dragongrip', 'diamondbladetip', 'cheatersscabbard' ];
        knifeparts.forEach((part) => {
            if (Shop.has(part)) sacrificeRatio += 0.1;
        });
        sacrificeRatio = sacrificeRatio.toFixed(2);
        return sacrificeRatio;
    };

    gameModule.sacrifice = function(boost, currency) {
        boost.saveableState.power++;
        let sacrificeRatio = 0.5;
        let knifeparts = [ 'serratedblade', 'rubypommel',  'dragongrip', 'diamondbladetip', 'cheatersscabbard' ];
        knifeparts.forEach((part) => {
            if (Shop.has(part)) sacrificeRatio += 0.1;
        });
        sacrificeRatio = sacrificeRatio.toFixed(2);
        Game.acquireXp(currency, Game.currency(currency).xpRequiredForNextLevel() * sacrificeRatio);
        Display.notify('You won ' + (sacrificeRatio * 100) + '% required ' + currency + ' xp', 'generic');
        Shop.lock('sacrifice-mm');
        Shop.lock('sacrifice-mc');
        Loot.tryLootCategory('knifepart');
        if (Shop.has('truekriss'))
            Game.acquireXp('blood', 1);
    }

    Game.module('bip', gameModule);

})(gameObjects.Game, gameObjects.Shop, gameObjects.Achievements, gameObjects.Display, gameObjects.Currencies, gameObjects.Loot);