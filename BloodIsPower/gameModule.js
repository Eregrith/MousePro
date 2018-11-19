/*
*
* Mouse Pro
*
* Game Module.js
*/

(function (Game, Shop, Achievements, Display, Currencies, Friends, Loot) {

    let gameModule = {};

	Currencies.newCurrency({
        name: 'Blood',
        shortName: 'blood',
        color: 'red',
        iconTag: '<i class="fa fa-tint currency-icon"></i>',
        xpLabel: '%',
        xpRequiredForNextLevel: 101,
        xpGained: function(me) {
            if (me.saveableState.xp >= this.xpRequiredForNextLevel) {
                me.saveableState.xp = this.xpRequiredForNextLevel - 1;
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

        let sacrificeMM = Shop.boost('sacrifice-mm');
        let sacrificeMC = Shop.boost('sacrifice-mc');

        if (sacrificeMM.saveableState.power >= 20
            && !Achievements.has('bloodthirst')) {
            Shop.unlock('bloodthirstyaldo');
            Achievements.gain('bloodthirst');
        }
        if (sacrificeMC.saveableState.power >= 20
            && !Achievements.has('bloodthirst')) {
            Shop.unlock('bloodthirstyaldo');
            Achievements.gain('bloodthirst');
        }
        if (Shop.boost('truekriss').getPower() >= 20
            && !Shop.isAvailable('biggerbuckets')) {
            Shop.unlock('biggerbuckets');
        }
        if (Shop.boost('anchor').getPower() >= 300
            && !Shop.isAvailable('unritualisticsacrifice')) {
            Shop.unlock('unritualisticsacrifice');
        }
        if (Friends.friend('aldo').getXpPerActivation() > 10000
           && !Shop.isAvailable('bloodthirstybarnabeus')) {
            Shop.unlock('bloodthirstybarnabeus');
        }
        if ((Friends.friend('aldo').getXpPerActivation() > 5000000
            || Friends.friend('barnabeus').getXpPerActivation() > 5000000)
           && !Shop.isAvailable('ratscavengers')) {
            Shop.unlock('ratscavengers');
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
        if (Shop.has('truekriss')) {
            gameModule.harvestBlood(1);
            Shop.boost('truekriss').saveableState.power++;
        }
    }

    gameModule.harvestBlood = function(blood) {
        if (Shop.has('biggerbuckets')) blood += 1;

        Game.acquireXp('blood', blood);
    }

    gameModule.kill = function(shortName) {
        let boost = Shop.boost(shortName);

        if (boost.ephemeral && boost.isUnlocked()) {
            boost.die();
            gameModule.harvestBlood(1);
            Display.needsRepaintImmediate = true;
        }
    }

    gameModule.toggleBoost = function(shortName) {
        let boost = Shop.boost(shortName);
        if (boost.isActive()) {
            boost.deactivate();
        } else {
            boost.activate();
        }
        Display.needsRepaintImmediate = true;
    }

    Game.module('bip', gameModule);

})(gameObjects.Game, gameObjects.Shop, gameObjects.Achievements, gameObjects.Display, gameObjects.Currencies, gameObjects.Friends, gameObjects.Loot);