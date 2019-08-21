/*
*
* Mouse Pro
*
* Loot Module.js
*/

(function (Game, Shop, Loot) {

    Loot.categories.push({
            category: 'ratstomach',
            baseLootChance: 1/3,
            getLootChance: function() { return this.baseLootChance; },
            boosts: []
        },
    );

    let ratStomachContents = [ 'oldtv' ];
    ratStomachContents.forEach(boost => {
        Loot.addBoostToCategory(boost, 'ratstomach');
    });

})(gameObjects.Game, gameObjects.Shop, gameObjects.Loot);