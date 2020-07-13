/*
*
* Mouse Pro
*
* DigitalDarkness/Main Boosts.js
*/

(function (Game, Boosts, Display, Shop, Loot, Achievements) {

	Boosts.newBoost({
		name: 'Old TV',
        icon: 'tv digital digital-glow',
		hasXP: true,
		category: 'digital',
		xpNeededToBeFull: 10,
		power: 0,
		xpBarColor: 'var(--digital-color)',
		_isBrowsing: true,
		isBrowsing: function() {
			return this.saveableState._isBrowsing;
		},
		getDescription: function() {
            let desc = 'An old TV, maybe you can repair it ?';
            if (this.isBought() && this.saveableState.power === 0) {
                desc = 'To repair this, you need ' + (this.xpNeededToBeFull - (this.saveableState.xpGained || 0))  + ' nuts and bolts';
            } else {
				desc = 'A nice computer screen.';
				if (!this.isBrowsing()) {
					desc += '<br/><div class="btn" onclick="gameObjects.Shop.boost(\'oldtv\').startBrowsing()"><i class="fa fa-search digital digital-glow"></i> Browse the dark web</div>';
				} else {
					desc += '<br/>Browsing...';
				}
            }
            return desc;
		},
		startBrowsing: function() {
			this.xpNeededToBeFull = 1000;
			this.saveableState._isBrowsing = true;
		},
		finishBrowsing: function() {
			if (!this.saveableState._isBrowsing) return;
			this.saveableState.xpGained = 0;
			Display.notify("Browsing finished !", 'Dark Web');
			if (Game.currency('DWK').getLevel() > 4) {
				if (!Shop.has('police'))
					Display.notify("The police is starting to get some interest in you", 'Police');
				else
					Display.notify("Police interest in you grows", 'Police');
				Game.getModule('dd').gainPoliceInterest(Game.currency('DWK').getLevel() - 4);
			} else {
				Display.notify("You found disturbing things and knowledge on the dark web !", 'Dark Web');
			}
			Loot.tryLootCategory('darkweb');
			this.saveableState._isBrowsing = false;
			let baseXP = 1;
			if (Shop.has('tor')) {
				baseXP += 1;
			}
			if (Shop.hasRepaired('syringe')) {
				let police = Shop.boost('police');
				baseXP *= 1 + (police.getFullnessPercent() / 50)
			}
			Game.acquireXp('DWK', baseXP);
		},
        onRestoreSave: function(me) {
            if (me.isBought())
				Loot.addBoostToCategory('bolts', 'ratstomach');
			if (me.saveableState.power > 0)
				me.isFullXP = me.finishBrowsing;
		},
        isFullXP: function(me) {
			this.saveableState.xpGained = 0;
			me.saveableState.power = 1;
			Display.notify("You repaired the Old TV ! Turns out it was a nice computer screen !", 'Dark Web');
			Achievements.gain('betterthantape');
			me.isFullXP = me.finishBrowsing;
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
		category: 'digital',
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
			if (oldTV.saveableState.power === 0)
				oldTV.gainXP(1);
			else {
				Shop.boost('backyard').saveableState.bought = true;
				Shop.boost('backyard').saveableState.power++;
			}
			me.lock();
			Loot.addBoostToCategory('bolts', 'ratstomach');
		}
	});
	Boosts.newBoost({
		name: 'Backyard',
        icon: 'cog digital digital-glow',
		category: 'digital',
		power: 0,
		getDescription: function() {
			let desc = 'Storage for your crap';
			desc += 'You have ' + this.saveableState.power + ' <i class="fa fa-cog digital digital-glow"></i> nuts and bolts';
            return desc;
		},
		shortName: 'backyard'
	});
	Boosts.newBoost({
		name: 'Favorites',
        icon: 'star digital digital-glow',
		category: 'digital',
		getDescription: function() {
            let desc = 'Your knowledge of the darkweb is starting to get messy. Let\'s add some order to all of this';
            return desc;
		},
		shortName: 'favorites',
		cost: {
			xp: {
				DWK: 5,
			}
		}
	});
	Boosts.newBoost({
		name: 'The Onion Router',
        icon: 'onion',
		category: 'digital',
		getDescription: function() {
            let desc = 'You can browse deeper and safer, gainin 1 more Dark Web Knowledge XP per browsing.';
            return desc;
		},
		shortName: 'tor',
		cost: {
			levels: {
				DWK: 1,
			}
		}
	});
	Boosts.newBoost({
		name: 'The police',
        icon: 'car digital digital-glow',
		category: 'digital',
		hasXP: true,
		xpNeededToBeFull: 20,
		xpBarColor: 'orange',
		isFullXP: function(me) {
			Display.notify("The police found you and took all your hard drives !!!", 'Police');
			Game.currency('DWK').saveableState.xp = 0;
			Game.currency('DWK').saveableState.level = 0;
			me.saveableState.xpGained = 0;
			if (!Achievements.has('badcall'))
				Achievements.gain('badcall');
		},
		getDescription: function() {
            let desc = 'The police is on your tracks. Better let the heat cool down or they might take all your knowledge...';
            return desc;
		},
		shortName: 'police'
	});
	Boosts.newBoost({
		name: 'ADSL',
        icon: 'plug digital',
		category: 'digital',
		getDescription: function() {
            let desc = 'This will help you browse a bit faster.';
            return desc;
		},
		shortName: 'adsl',
		cost: {
			levels: {
				DWK: 5,
			}
		}
	});
	Boosts.newBoost({
		name: 'Optic Fiber',
        icon: 'eye digital',
		category: 'digital',
		getDescription: function() {
            let desc = 'This will help you browse a lot faster.';
            return desc;
		},
		shortName: 'fiber',
		cost: {
			levels: {
				DWK: 10,
			}
		}
	});
	Boosts.newBoost({
		name: '2nd Hand Tech-Dealer',
        icon: 'user digital',
		category: 'digital',
		getDescription: function() {
			let desc = 'Shady dude you met online. He sells surprise tech packages that he ... got from ... somewhere...';
			if (this.isBought())
				desc += '<br/><div class="btn" onclick="gameObjects.Game.getModule(\'dd\').buyPackage()">Buy a surprise package for 1<i class="fa fa-cog digital digital-glow"></i></div><br/>';
            return desc;
		},
		shortName: 'dealer',
		cost: {
			xp: {
				DWK: 10,
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'Dark Web Newsletter',
        icon: 'envelope digital',
		category: 'digital',
		getDescription: function() {
			let desc = 'Subscribe to our newsletter and get some knowledge about the dark web from time to time.';
			if (this.isBought())
				desc += '<br/>&nbsp;';
            return desc;
		},
		shortName: 'newsletter',
		cost: {
			xp: {
				DWK: 15,
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'Broken Fan',
		repairedName: 'Cooling Fan',
        icon: 'fan digital',
		category: 'digital',
		repairable: true,
		boltsNeededToRepair: 10,
		getDescription: function() {
			let desc = 'A broken fan.';
			if (this.isRepaired()) {
				desc = 'This will help dissipate heat from the police.'
			}
            return desc;
		},
		shortName: 'fan',
		cost: {}
	});
	Boosts.newBoost({
		name: 'Broken Syringe',
		repairedName: 'Adrenaline Catalyst',
        icon: 'syringe digital',
		category: 'digital',
		repairable: true,
		boltsNeededToRepair: 10,
		getDescription: function() {
			let desc = 'A broken syringe.';
			if (this.isRepaired()) {
				desc = 'With this syringe you can inject yourself with adrenaline. Browsing will give more dark web XP when the police is closer to catching you.'
			}
            return desc;
		},
		shortName: 'syringe',
		cost: {}
	});
	Boosts.newBoost({
		name: 'Buzz Lightyear',
        icon: 'user-astronaut digital',
		category: 'digital',
		repairable: true,
		boltsNeededToRepair: 10,
		getDescription: function() {
			let desc = 'A broken toy.';
            return desc;
		},
		shortName: 'buzzlightyear',
		cost: {
			xp: {
				DWK: 15,
			}
		}
	});
	Boosts.newBoost({
		name: 'Space shuttle',
        icon: 'user-astronaut digital',
		category: 'digital',
		getDescription: function() {
			let desc = 'A broken toy.';
            return desc;
		},
		shortName: 'spaceshuttle',
		cost: {
			xp: {
				DWK: 15,
			}
		}
	});

})(gameObjects.Game, gameObjects.Boosts, gameObjects.Display, gameObjects.Shop, gameObjects.Loot, gameObjects.Achievements);