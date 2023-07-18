/*
*
* Mouse Pro
*
* Loot Module.js
*/

(function (Game, Shop, Loot) {

    Loot.categories.push({
        category: 'darkweb',
        baseLootChance: 1/5,
        getLootChance: function() { return this.baseLootChance; },
        boosts: []
    });

    let darkWebContents = [ 'dealer', 'newsletter', 'sexymouse', 'adblock', 'hackingfordummies'];
    darkWebContents.forEach(boost => {
        Loot.addBoostToCategory(boost, 'darkweb');
    });

})(gameObjects.Game, gameObjects.Shop, gameObjects.Loot);