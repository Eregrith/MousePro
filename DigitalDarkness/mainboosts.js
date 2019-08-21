/*
*
* Mouse Pro
*
* DigitalDarkness/Main Boosts.js
*/

(function (Game, Boosts, Display, Shop, Loot) {

	Boosts.newBoost({
		name: 'Old TV',
		icon: 'tv digital',
		getDescription: function() {
			return 'An old TV, maybe you can repair it ?';
		},
		shortName: 'oldtv',
		cost: {
			xp: {
				MM: 100,
				MC: 100
			}
		},
		buy: function() {
			Loot.addBoostToCategory('newscreen', 'ratstomach');
		}
	});

})