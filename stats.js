/*
*
* Mouse Pro
*
* gameObjects.js
*/


(function (Game, Shop, Display, Stats) {

    Stats.refreshStats = function() {
        let mm = Game.currency('MM');
        let mc = Game.currency('MC');

        document.getElementById('highest-mm').innerHTML = mm.getHighestLevelAttained() || mm.getLevel();
        document.getElementById('highest-mc').innerHTML = mc.getHighestLevelAttained() || mc.getLevel();

        document.getElementById('sacrificed-mm').innerHTML = Shop.boost('sacrifice-mm').getPower();
        document.getElementById('sacrificed-mc').innerHTML = Shop.boost('sacrifice-mc').getPower();

        document.getElementById('ticks-per-second').innerHTML = Display.beautify(Display.framesPerSecond());

        document.getElementById('ephemeralDeaths').innerHTML = Shop.boost('anchor').getPower();
    }

})(gameObjects.Game, gameObjects.Shop, gameObjects.Display, gameObjects.Stats);