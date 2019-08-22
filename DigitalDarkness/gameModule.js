/*
*
* Mouse Pro
*
* Game Module.js
*/

(function (Game, Shop, Achievements, Display, Currencies, Friends, Loot) {

    let gameModule = {};

    
    gameModule.checkUnlocks = function() {
        if (Shop.isFullXP('oldtv') && !Achievements.has('betterthantape')) {
            Achievements.gain('betterthantape');
        }
    };

    Game.module('dd', gameModule);

})(gameObjects.Game, gameObjects.Shop, gameObjects.Achievements, gameObjects.Display, gameObjects.Currencies, gameObjects.Friends, gameObjects.Loot);