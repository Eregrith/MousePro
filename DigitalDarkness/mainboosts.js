/*
*
* Mouse Pro
*
* DigitalDarkness/Main Boosts.js
*/

(function (Game, Boosts, Display, Shop, Loot) {

	Boosts.newBoost({
		name: 'Old TV',
        icon: 'tv digital digital-glow',
        power: 10,
		getDescription: function() {
            let desc = 'An old TV, maybe you can repair it ?';
            if (this.isBought() && this.power > 0) {
                desc = 'To repair this, you need ' + this.power + ' nuts and bolts';
            } else {
                desc = 'A nice computer screen';
            }
            return desc;
        },
        onRestoreSave: function() {
            if (this.isBought())
			    Loot.addBoostToCategory('bolts', 'ratstomach');
        },
        isRepaired: function() {
            this.repaired = true;
            Display.notify("You repaired the Old TV ! Turns out it was a nice computer screen !");
        },
		shortName: 'oldtv',
		cost: {
			xp: {
				MM: 100,
				MC: 100
			}
		},
		buy: function() {
			Loot.addBoostToCategory('bolts', 'ratstomach');
		}
	});
	Boosts.newBoost({
		name: 'Nuts And Bolts',
        icon: 'cog digital digital-glow',
        power: 10,
		getDescription: function() {
            let desc = 'Nuts and bolts, is it better than repair tape?';
            return desc;
		},
		shortName: 'bolts',
		cost: {
			xp: {
				MM: 200,
				MC: 200
			}
		},
		buy: function() {
            let oldTV = Shop.boost('oldtv');
            oldTV.power--;
            if (oldTV.power = 0)
                oldTV.isRepaired();
			Loot.addBoostToCategory('bolts', 'ratstomach');
		}
	});

})(gameObjects.Game, gameObjects.Boosts, gameObjects.Display, gameObjects.Shop, gameObjects.Loot);