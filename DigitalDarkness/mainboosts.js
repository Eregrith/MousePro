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
		hasXP: true,
		xpNeededToBeFull: 10,
		power: 0,
		xpBarColor: 'var(--digital-color)',
		getDescription: function() {
            let desc = 'An old TV, maybe you can repair it ?';
            if (this.isBought() && this.saveableState.power === 0) {
                desc = 'To repair this, you need ' + (this.xpNeededToBeFull - (this.saveableState.xpGained || 0))  + ' nuts and bolts';
            } else {
                desc = 'A nice computer screen';
            }
            return desc;
        },
        onRestoreSave: function() {
            if (this.isBought())
			    Loot.addBoostToCategory('bolts', 'ratstomach');
        },
        isFullXP: function(me) {
			me.saveableState.power = 1;
			Display.notify("You repaired the Old TV ! Turns out it was a nice computer screen !");
			Achievements.gain('betterthantape');
        },
		shortName: 'oldtv',
		cost: {
			levels: {
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
			levels: {
				MM: 200,
				MC: 200
			}
		},
		buy: function(me) {
            let oldTV = Shop.boost('oldtv');
            oldTV.gainXP(1);
			me.lock();
			Loot.addBoostToCategory('bolts', 'ratstomach');
		}
	});

})(gameObjects.Game, gameObjects.Boosts, gameObjects.Display, gameObjects.Shop, gameObjects.Loot);