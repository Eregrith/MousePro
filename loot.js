/*
*
* Mouse Pro
*
* loot.js
*/

(function (Shop, Display, Loot) {

    Loot.categories = [
        {
            category: 'knifepart',
            baseLootChance: 1/5,
            getLootChance: function() { return this.baseLootChance; },
            boosts: []
        },
    ];

    Loot.category = function(category) {
        return Loot.categories.filter(c => c.category == category)[0];
    }

    Loot.addBoostToCategory = function(boost, category) {
        if (!Shop.has(boost)) {
            let lootCategory = Loot.category(category);
            lootCategory.boosts.push(boost);
        }
    }

    let knifeparts = [ 'serratedblade', 'rubypommel',  'dragongrip', 'diamondbladetip', 'cheatersscabbard' ];
    knifeparts.forEach(boost => {
        if (!Shop.has(boost)) {
            Loot.addBoostToCategory(boost, 'knifepart');
        }
    });

    Loot.tryLootCategory = function(category) {
        let lootCategory = Loot.category(category);
        if (lootCategory.boosts.length == 0) return;

        let lootChance = lootCategory.getLootChance();
        let roll = Math.random();

        if (roll <= lootChance) {

            let looted = false;
            while (!looted && lootCategory.boosts.length != 0) {
                let lootedBoost = lootCategory.boosts[Math.floor(Math.random()*lootCategory.boosts.length)];
                lootCategory.boosts = lootCategory.boosts.filter(b => b != lootedBoost);
                if (Shop.boost(lootedBoost) == undefined){
                    console.debug('invalid loot', lootedBoost);
                }
                else if (!Shop.has(lootedBoost)) {
                    Display.notifyLoot(lootedBoost);
                    Shop.unlock(lootedBoost);
                    looted = true;
                }
            }
        }
    }

})(gameObjects.Shop, gameObjects.Display, gameObjects.Loot);