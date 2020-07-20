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
		saveableState: {
			_isBrowsing: false,
		},
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
					if (Game.currency('DWK').getLevel() >= 24){
						desc += '<br/>You feel that browsing the dark web yourself with your current level of knowledge <span class="red">will get you caught</span> in a matter of seconds. There must be another way.';
						desc += '<br/><div class="btn" onclick="gameObjects.Shop.boost(\'oldtv\').startBrowsing()"><i class="fa fa-search digital digital-glow"></i> Browse the dark web anyway <span class="red"> and get caught by the police</span></div>';
					}
					else {
						desc += '<br/><div class="btn" onclick="gameObjects.Shop.boost(\'oldtv\').startBrowsing()"><i class="fa fa-search digital digital-glow"></i> Browse the dark web</div>';
					}
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
			if (Shop.has('sexymouse')) {
				Shop.unlock('giantrat');
			}
			if (Shop.has('hackingfordummies')) {
				Shop.boost('hackingfordummies').saveableState.power++;
				Shop.boost('hackingfordummies').gainXP(1);
			}
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
				Shop.boost('backyard').saveableState.power.nuts++;
			}
			me.lock();
			Loot.addBoostToCategory('bolts', 'ratstomach');
		}
	});
	Boosts.newBoost({
		name: 'Backyard',
        icon: 'cog digital digital-glow',
		category: 'digital',
		power: {
			nuts: 0,
			batteries: 0,
		},
		getDescription: function() {
			let desc = 'Storage for your crap';
			desc += 'You have ' + this.saveableState.power.nuts + ' <i class="fa fa-cog digital digital-glow"></i> nuts and bolts';
			if (Shop.has('batteries')) {
				desc += '<br/>You have ' + this.saveableState.power.batteries + ' <i class="fa fa-battery-full digital digital-glow"></i> batteries'
			}
            return desc;
		},
		onRestoreSave: function(me) {
			if (Number.isInteger(me.saveableState.power))
				me.saveableState.power = {
					nuts: me.saveableState.power,
					batteries: 0
				};
		},
		shortName: 'backyard'
	});
	Boosts.newBoost({
		name: 'Sexy Mouse',
        icon: 'mouse sexy digital-glow',
		category: 'digital',
		getDescription: function() {
            let desc = 'A very sexy mouse for browsing sexy sites on the Dark Web.<br/><small>Caution: can attract rats when browsing.</small>';
            return desc;
		},
		shortName: 'sexymouse',
		cost: {
			xp: {
				DWK: 12,
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'Hacking for Dummies',
        icon: 'book-dead digital',
		category: 'digital',
		hasXP: true,
		xpNeededToBeFull: 50,
		xpBarColor: 'var(--digital-color)',
		getDescription: function() {
			let desc = 'That might help your friends help you with the Dark Web.'
					 + ' Every time you browse the dark web, they learn a bit more and this gives a cummulative'
					 + ' 13.37% bonus to each of your friend\'s output.';
            return desc;
		},
		isFullXP: function() {
			if (!Shop.has('haxxoraldo')) {
				Shop.unlock('haxxoraldo');
				Shop.unlock('haxxorbarnabeus');
			}
		},
		shortName: 'hackingfordummies',
		cost: {
			levels: {
				MM: 300,
				MC: 300,
				DWK: 10,
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'Haxxor Aldo',
        icon: 'user-circle digital',
		category: 'digital',
		getDescription: function() {
			let desc = 'Finally your friend understands the Dark Web.'
					 + ' He will now passively give you a bit of DWK XP every time he activates';
			return desc;
		},
		shortName: 'haxxoraldo',
		cost: {
			levels: {
				MM: 5000,
				MC: 2000,
				DWK: 10,
			}
		}
	});
	Boosts.newBoost({
		name: 'Haxxor Barnabeus',
        icon: 'user-circle fa-lighter digital',
		category: 'digital',
		getDescription: function() {
			let desc = 'Finally your friend understands the Dark Web.'
					 + ' He will now passively give you a bit of DWK XP every time he activates';
			return desc;
		},
		shortName: 'haxxorbarnabeus',
		cost: {
			levels: {
				MM: 2000,
				MC: 5000,
				DWK: 10,
			}
		}
	});
	Boosts.newBoost({
		name: 'Ad Blocker',
        icon: 'shield-alt digital digital-glow',
		category: 'digital',
		isActivable: true,
		getDescription: function() {
			let desc = 'All those sacrifices are annoying. This will hide them for you.';
			if (!this.isBought()) {
				desc += '<br/>When turned on, this boost will prevent all sacrifices from showing. Auto effects still apply';
			} else if (this.isActive()) {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'adblock\')">Turn off</div> Hides all sacrifices.';
			} else {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'adblock\')">Turn on</div> to hide all sacrifices.'
			}
            return desc;
		},
		shortName: 'adblock',
		cost: {
			xp: {
				DWK: 7,
			}
		},
		isLoot: true
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
		xpBarColor: 'var(--police-color)',
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
		hasXP: true,
		xpNeededToBeFull: 30,
		xpBarColor: 'var(--digital-color)',
		batteryPowered: true,
		maxBatteryLife: 5 * 60 * Display.framesPerSecond(),
		getDescription: function() {
			let desc = 'A broken fan.';
			if (this.isRepaired()) {
				desc = 'This will help dissipate heat from the police.';
				if (Shop.has('batteries')) {
					if (this.saveableState.power == 0) {
						desc += ' If you add a battery it might be stronger for a little time.';
						desc += '<br/><div class="btn" onclick="gameObjects.Shop.boost(\'fan\').insertBattery()">Insert a <i class="fa fa-battery-full digital digital-glow"></i> battery</div>';
					} else {
						desc += '<br/>Battery powered:<br/>More heat is dissipated each time.';
					}
				}
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
			if (this.isRepaired()) {
				if (!Shop.has('lasergun'))
					desc = 'A nice toy. But its weapon is missing';
				else
					desc = '"I AM COMPLETE!" he said... You didn\'t know it could talk, and now you\'re scared';
			}
            return desc;
		},
		onRepairComplete: function() {
			if (Shop.has('lasergun')) {
				Shop.unlock('pewpew');
			}
		},
		shortName: 'buzzlightyear',
		cost: {
			xp: {
				DWK: 15,
			}
		}
	});
	Boosts.newBoost({
		name: 'Laser gun',
        icon: 'raygun digital',
		category: 'digital',
		getDescription: function() {
			let desc = 'You found an old toys collector online. He offers to sell you this part.';
			if (this.isBought()) {
				desc = 'A teeny-tiny laser gun.'
				if (!Shop.has('buzzlightyear'))
					desc += ' What are you going to do with it?';
				else
					desc += ' Buzz is really happy!';
			}
            return desc;
		},
		buy: function () {
			if (Shop.hasRepaired('buzzlightyear')) {
				Shop.unlock('pewpew');
			}
		},
		shortName: 'lasergun',
		cost: {
			levels: {
				DWK: 10,
			}
		}
	});
	Boosts.newBoost({
		name: 'Pew pew!!',
        icon: 'raygun digital',
		category: 'digital',
		hasXP: true,
		maxBatteryLife: 5 * 60 * Display.framesPerSecond(),
		batteryPowered: true,
		xpBarColor: 'yellow',
		getDescription: function() {
			let desc = 'You should really get Buzz busy, he looks like he wants to shoot everything. He might as well shoot the rats for you !';
			if (!this.isBought()) {
				desc += '<br/><i><small>BATTERIES NOT INCLUDED</small></i>';
			} else if (this.saveableState.power == 0) {
				desc += ' This needs a battery to work';
				if (Shop.has('batteries')) {
					desc += '<br/><div class="btn" onclick="gameObjects.Shop.boost(\'pewpew\').insertBattery()">Insert a <i class="fa fa-battery-full digital digital-glow"></i> battery</div>';
				}
			} else {
				desc = 'Buzz is killing rats on sight.';
				if (!Shop.has('giantmagnet')) {
					desc += ' You still have to manually buy the nuts and bolts though... Maybe you can find something to help with that.';
				}
			}
            return desc;
		},
		buy: function() {
			if (!Shop.has('batteries')) {
				Shop.unlock('batteries');
			}
		},
		shortName: 'pewpew',
		cost: {
			levels: {
				DWK: 12,
			}
		}
	});
	Boosts.newBoost({
		name: 'Giant Magnet',
        icon: 'magnet digital digital-glow',
		category: 'digital',
		hasXP: true,
		maxBatteryLife: 5 * 60 * Display.framesPerSecond(),
		batteryPowered: true,
		xpBarColor: 'yellow',
		getDescription: function() {
			let desc = 'This will attract nuts and bolts automatically when powered on.';
			if (this.saveableState.power == 0) {
				desc += ' It needs a battery to work';
				if (Shop.has('batteries')) {
					desc += '<br/><div class="btn" onclick="gameObjects.Shop.boost(\'giantmagnet\').insertBattery()">Insert a <i class="fa fa-battery-full digital digital-glow"></i> battery</div>';
				}
			} else {
				desc = 'The magnet is getting all the nuts and bolts it can find for you.';
			}
            return desc;
		},
		shortName: 'giantmagnet',
		cost: {}
	});
	Boosts.newBoost({
		name: 'Batteries',
        icon: 'battery-full digital digital-glow',
		category: 'digital',
		getDescription: function() {
			let desc = 'It\'s amazing what you can do with batteries these days !';
			if (this.isBought()) {
				if (!Shop.has('backyard'))
					desc += '<br/>You will need a backyard to store batteries';
				else
					desc += '<br/><div class="btn" onclick="gameObjects.Shop.boost(\'batteries\').craftBattery()"><i class="fa fa-plus digital digital-glow"></i> Craft a battery with 1 <i class="fa fa-cog digital digital-glow"></i></div>';
			}
            return desc;
		},
		craftBattery: function() {
			if (Shop.boost('backyard').saveableState.power.nuts > 0) {
				Shop.boost('backyard').saveableState.power.nuts--;
				Shop.boost('backyard').saveableState.power.batteries++;
			}
		},
		shortName: 'batteries',
		cost: {
			xp: {
				DWK: 17,
			}
		}
	});
	Boosts.newBoost({
		name: 'Space shuttle',
		repairedName: 'REAL Space shuttle',
        icon: 'user-astronaut digital',
		category: 'digital',
		repairable: true,
		boltsNeededToRepair: 250,
		getDescription: function() {
			let desc = 'A broken toy.';
			if (Shop.has('pewpew') && Shop.has('giantmagnet')) {
				desc += ' The more you repair it, the more it grows !';
			}
            return desc;
		},
		shortName: 'spaceshuttle',
		cost: {
			xp: {
				DWK: 15,
			}
		}
	});
	Boosts.newBoost({
		name: 'Deep Knowledge',
        icon: 'fish digital',
		category: 'digital',
		hasXP: true,
		xpNeededToBeFull: 1000,
		saveableState: {
			_isPhishing: false,
		},
		xpBarColor: 'var(--police-color)',
		isPhishing: function() {
			return this.saveableState._isPhishing;
		},
		getDescription: function() {
			let desc = 'You know so much about the dark web, you could send the police to your competitors and steal what they take from them.';
			if (this.isBought()) {
				if (!this.isPhishing()) {
					desc += '<br/><div class="btn" onclick="gameObjects.Shop.boost(\'deepknowledge\').goPhish()">Go phish a competitor</div><br/>';
				} else {
					desc += '<br/><br/>Phishing...';
				}
			}
            return desc;
		},
		goPhish: function() {
			this.saveableState._isPhishing = true;
		},
		isFullXP: function() {
			this.saveableState.xpGained = 0;
			this.saveableState._isPhishing = false;
			let levels = 1;
			Game.currency('DWK').acquireLevels(levels);
			Display.notify("You had the police steal " + levels + " DWK level" + (levels > 1 ? 's' : '') + " from a competitor");
		},	
		shortName: 'deepknowledge',
		cost: {
			levels: {
				DWK: 30,
			}
		}
	});

})(gameObjects.Game, gameObjects.Boosts, gameObjects.Display, gameObjects.Shop, gameObjects.Loot, gameObjects.Achievements);