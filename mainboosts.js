/*
*
* Mouse Pro
*
* Main Boosts.js
*/

(function (Game, Boosts, Friends, Shop, Tabs) {

	Boosts.newBoost({
		name: 'Mouse mover XT-PRO',
		icon: 'mouse-pointer',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' MM XP every 5 points of MM XP' },
		shortName: 'xtpro',
		cost: {
			xp: {
				MM: 110,
				MC: 11
			}
		},
		bonusXp: 3
	});
	Boosts.newBoost({
		name: 'Mouse clicker DM-BLU',
		icon: 'mouse-pointer',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' MC XP every 5 points of MC XP'; },
		shortName: 'dmblu',
		cost: {
			xp: {
				MM: 85,
				MC: 14
			}
		},
		bonusXp: 3
	});
	Boosts.newBoost({
		name: 'Mouse XP transfer ZB-GLO',
		icon: 'exchange-alt fa-rotate-90',
		getDescription: function() { return 'This awesome mouse-addon gives you ' + this.bonusXp + ' XP in the other proficiency when you level up one'; },
		shortName: 'zbglo',
		cost: {
			xp: {
				MM: 299,
				MC: 23
			}
		},
		bonusXp: 20
	});
	Boosts.newBoost({
		name: 'Settings',
		icon: 'cogs',
		getDescription: function() { return 'Let\'s tune this thing'; },
		shortName: 'settings',
		cost: {
			levels: {
				MM: 1,
				MC: 1
			}
		},
		buy: function () {
			Tabs.unlock('game');
			Tabs.unlock('settings');
			Tabs.toggleActiveTabTo('game');
		}
	});
	Boosts.newBoost({
		name: 'Addon Enhancer',
		icon: 'star',
		getDescription: function() {
			return 'This little device multiplies the effects of XT-PRO, DM-BLU and ZB-GLO addons by ' + this.getPower()
				+ (this.canBuy() ? '<br/>When bought, this effect doubles.' : '');
		},
		shortName: 'addonenhancer',
		cost: {
			levels: {
				MM: 10,
				MC: 10
			}
		},
		power: 1,
		buy: function (thisBoost) {
			thisBoost.saveableState.power *= 2;
			if (!Shop.has('friends'))
				Shop.unlock('friends');
		}
	});
	Boosts.newBoost({
		name: 'Friends',
		icon: 'user-friends',
		getDescription: function() { return this.bought ? 'Friends are AWESOOOME!!' : 'It\'s dangerous to go alone. Take this!'; },
		shortName: 'friends',
		cost: {
			levels: {
				MM: 10,
				MC: 10
			}
		},
		buy: function () {
			Friends.unlock('aldo');
		}
	});
	Boosts.newBoost({
		name: 'ZB-GLO Injector - Down',
		icon: 'arrow-down',
		getDescription: function() { return 'Mouse XP transfer ZB-GLO will give MC xp based on the MM level attained when it triggers.'; },
		shortName: 'zbgloinjectordown',
		cost: {
			levels: {
				MM: 15,
				MC: 15
			}
		}
	});
	Boosts.newBoost({
		name: 'ZB-GLO Injector - Up',
		icon: 'arrow-up',
		getDescription: function() { return 'Mouse XP transfer ZB-GLO will give MM xp based on the MC level attained when it triggers.'; },
		shortName: 'zbgloinjectorup',
		cost: {
			levels: {
				MM: 15,
				MC: 15
			}
		}
	});
	Boosts.newBoost({
		name: 'Bootloader',
		icon: 'download',
		getDescription: function() { return 'Kickstarts MM and MC by giving them 10 xp when they level up'; },
		shortName: 'bootloader',
		cost: {
			levels: {
				MM: 2,
				MC: 2
			}
		}
	});
	Boosts.newBoost({
		name: 'Vitrine',
		icon: 'tv',
		getDescription: function() { return 'A nice place to show off what you got'; },
		shortName: 'vitrine',
		cost: {
			levels: {
				MM: 5,
				MC: 5
			}
		},
		buy: function() {
			Tabs.unlock('achievements');
		}
	});
	Boosts.newBoost({
		name: 'Outer GLO',
		icon: 'lightbulb outer-glow fa-lighter',
		getDescription: function() { return 'Multiplies the effect of ZB-GLO by the corresponding friend\'s level. Can only be bought when MC xp is even.'; },
		shortName: 'outerglo',
		cost: {
			levels: {
				MM: 20,
				MC: 20
			}
		},
		canBuy: function() {
			return (Game.currency('MC').saveableState.xp % 2 == 0);
		}
	});
	Boosts.newBoost({
		name: 'Stats',
		icon: 'chart-bar',
		getDescription: function() { return 'You know numbers. Here you can look at them'; },
		shortName: 'stats',
		cost: {
			xp: {
				MM: 123,
				MC: 123
			}
		},
		buy: function() {
			Tabs.unlock('stats');
		}
    });
	Boosts.newBoost({
		name: 'Ephemeral Anchor',
		icon: 'anchor',
		getDescription: function() { return 'Ephemeral boosts live for twice as long before disappearing.'; },
		shortName: 'anchor',
		cost: {
			xp: {
				MM: 1024,
				MC: 1024
			}
		}
    });
    
})(gameObjects.Game, gameObjects.Boosts, gameObjects.Friends, gameObjects.Shop, gameObjects.Tabs);