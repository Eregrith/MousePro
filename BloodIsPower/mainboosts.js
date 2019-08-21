/*
*
* Mouse Pro
*
* BloodIsPower/Main Boosts.js
*/

(function (Game, Boosts, Display, Shop, Loot) {

	Boosts.newBoost({
		name: 'Sacrificial Kriss',
		icon: 'kriss',
		getDescription: function() { return 'This might come in handy... maybe? What would you buy a sacrificial knife for anyway?'; },
		shortName: 'kriss',
		cost: {
			levels: {
				MM: 12,
				MC: 14
			}
		},
		buy: function() {
			Shop.unlock('sacrifice-mm');
		}
	});
	Boosts.newBoost({
		name: 'MM Sacrifice',
		icon: 'sun',
		getDescription: function() {
			return 'Immediately gain ' + (Game.getModule('bip').getSacrificeRatio() * 100) + '%  of required MC xp for your current MC level '
				+ '(' + Display.beautify(Game.currency('MC').xpRequiredForNextLevel() * Game.getModule('bip').getSacrificeRatio()) + ')';
		},
		shortName: 'sacrifice-mm',
		cost: {
			levels: {
				MM: 1
			}
		},
		getSacrificeRatio: function() {
			let sacrificeRatio = 0.5;
			let knifeparts = [ 'serratedblade', 'rubypommel',  'dragongrip', 'diamondbladetip', 'cheatersscabbard' ];
			knifeparts.forEach((part) => {
				if (Shop.has(part)) sacrificeRatio += 0.1;
			});
			sacrificeRatio = sacrificeRatio.toFixed(2);
			return sacrificeRatio;
		},
		buy: function(me) {
			Game.getModule('bip').sacrifice(me, 'MC');
		},
		ephemeral: true,
		lifeDurationInTicks: 1000
	});
	Boosts.newBoost({
		name: 'MC Sacrifice',
		icon: 'moon',
		getDescription: function() {
			return 'Immediately gain ' + (Game.getModule('bip').getSacrificeRatio() * 100)+ '% of required MM xp for your current MM level '
				+ '(' + Display.beautify(Game.currency('MM').xpRequiredForNextLevel() * Game.getModule('bip').getSacrificeRatio()) + ')';
		},
		shortName: 'sacrifice-mc',
		cost: {
			levels: {
				MC: 1
			}
		},
		buy: function(me) {
			Game.getModule('bip').sacrifice(me, 'MM');
		},
		ephemeral: true,
		lifeDurationInTicks: 1000
	});
	Boosts.newBoost({
		name: 'Recruitment posters',
		icon: 'portrait',
		getDescription: function() { return 'This will help you find lambs to slaughter. Doubles the chance to have a ready sacrifice.'; },
		shortName: 'posters',
		cost: {
			levels: {
				MM: 5, 
				MC: 5
			}
		}
	});
	Boosts.newBoost({
		name: 'Serrated blade',
		icon: 'serratedblade',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'serratedblade',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'Ruby pommel',
		icon: 'rubypommel',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'rubypommel',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'Sculpted Dragon Grip',
		icon: 'dragongrip',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'dragongrip',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'Diamond Blade-Tip',
		icon: 'diamondbladetip',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'diamondbladetip',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'Cheater\'s scabbard',
		icon: 'cheatersscabbard',
		getDescription: function() { return 'A part of a nice knife. Your sacrifices yield +10% of xp required for next level.'; },
		shortName: 'cheatersscabbard',
		cost: {
			levels: {
				MM: 18, 
				MC: 18
			}
		},
		isLoot: true
	});
	Boosts.newBoost({
		name: 'True kriss',
		icon: 'truekriss',
		getDescription: function() { return 'A nice knife. I bet you can <i>harvest</i> things with it.'; },
		shortName: 'truekriss',
		cost: {
			levels: {
				MM: 22, 
				MC: 22
			}
		}
	});
	Boosts.newBoost({
		name: 'Aldo the Bloodthirsty',
		icon: 'user-circle red',
		isActivable: true,
		getDescription: function() {
			let desc = 'It looks like your friend gets high on a viscous red substance.';
			if (!this.isBought()) {
				desc += '<br/>When turned on, this boost allows aldo to double its output at the cost of 1 blood per 100 activations.';
			} else if (this.isActive()) {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'bloodthirstyaldo\')">Turn off</div> Allows aldo to double its output at the cost of 1 blood per 100 activations.';
			} else {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'bloodthirstyaldo\')">Turn on</div> to allow aldo to double its output at the cost of 1 blood per 100 activations.'
			}
			return desc;
		},
		shortName: 'bloodthirstyaldo',
		cost: {
			xp: {
				blood: 20,
			}
		}
	});
	Boosts.newBoost({
		name: 'Bloodthirsty Barnabeus',
		icon: 'user-circle fa-lighter red red-glow',
		isActivable: true,
		getDescription: function() {
			let desc = 'It looks like your other friend gets high on a viscous red substance.';
			if (!this.isBought()) {
				desc += '<br/>When turned on, this boost allows barnabeus to double its output at the cost of 1 blood per 10 activations.';
			} else if (this.isActive()) {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'bloodthirstybarnabeus\')">Turn off</div> Allows barnabeus to double its output at the cost of 1 blood per 10 activations.';
			} else {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'bloodthirstybarnabeus\')">Turn on</div> to allow barnabeus to double its output at the cost of 1 blood per 10 activations.'
			}
			return desc;
		},
		shortName: 'bloodthirstybarnabeus',
		cost: {
			xp: {
				blood: 10,
			}
		}
	});
	Boosts.newBoost({
		name: 'Bloodfull aldo',
		icon: 'user-circle red red-glow',
		getDescription: function() {
			let desc = 'It looks like your friend has eaten well.<br/>'
				+ 'Aldo gains a multiplicative ' + (this.getPower()*100) + '% bonus to output per MM sacrifice you have committed.<br/>';
			return desc;
		},
		power: 0.10,
		shortName: 'bloodfullaldo',
		cost: {
			xp: {
				blood: 20,
			}
		}
	});
	Boosts.newBoost({
		name: 'Bloodfull barnabeus',
		icon: 'user-circle fa-lighter red red-glow',
		getDescription: function() {
			let desc = 'It looks like your friend has eaten well.<br/>'
				+ 'Barnabeus gains a multiplicative ' + (this.getPower()*100) + '% bonus to output per MC sacrifice you have committed.<br/>';
			return desc;
		},
		power: 0.10,
		shortName: 'bloodfullbarnabeus',
		cost: {
			xp: {
				blood: 20,
			}
		}
	});
	Boosts.newBoost({
		name: 'Bigger blood buckets',
		icon: 'fill red',
		getDescription: function() {
			let desc = 'This will help you transporting blood from the sacrifice place to your storage.<br/>You get 1 more blood unit per sacrifice';
			return desc;
		},
		shortName: 'biggerbuckets',
		cost: {
			xp: {
				blood: 10,
			}
		}
	});
	Boosts.newBoost({
		name: 'Unritualistic Sacrifice',
		icon: '',
		getDescription: function() {
			let desc = 'These annoying little lambs are using up the space in your warehouse and you don\'t want to sacrifice them ?<br/>'
					 + 'Why don\'t you just go on simply killing them for their blood ?';
			return desc;
		},
		shortName: 'unritualisticsacrifice',
		cost: {
			xp: {
				blood: 10,
			}
		}
	});
	Boosts.newBoost({
		name: 'Otto Von Sacrifice',
		icon: '',
		isActivable: true,
		getDescription: function() {
			let desc = 'This gentleman will herd the lambs to the "correct" house.';
			if (!this.isBought()) {
				desc += '<br/>When turned on, this boost will trigger sacrifice just before an ephemeral boost dies out.';
			} else if (this.isActive()) {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'ottovonsacrifice\')">Turn off</div> Triggers sacrifice just before an ephemeral boost dies out.';
			} else {
				desc += '<div class="btn" onclick="gameObjects.Game.getModule(\'bip\').toggleBoost(\'ottovonsacrifice\')">Turn on</div> to trigger sacrifice just before an ephemeral boost dies out.'
			}
			return desc;
		},
		shortName: 'ottovonsacrifice',
		cost: {
			xp: {
				blood: 50
			},
			levels: {
				MM: 30, 
				MC: 30
			}
		}
	});
	Boosts.newBoost({
		name: 'Rat scavengers',
		icon: 'rat',
		power: 0,
		getDescription: function() {
			let desc = 'You could use these little creatures to get the blood in these lambs after they\'re done for.'
				+ '<br/>These will scavenge a bit of blood after an ephemeral boost dies.';
			return desc;
		},
		shortName: 'ratscavengers',
		eatsBlood: true,
		bloodNeededToBeFull: 50,
		isFullOfBlood: function() {
			if (!Shop.has('giantbloodrats')) {
				Shop.unlock('giantbloodrats');
			}
		},
		cost: {
			xp: {
				blood: 13,
			}
		}
	});
	Boosts.newBoost({
		name: 'Redudant Blood injector',
		icon: 'exchange-alt fa-rotate-90 red red-glow',
		power: 0.10,
		getDescription: function() {
			let desc = 'Blood exchange is a good way to improve your efficacy.'
				+ '<br/>Improves Redundant XP Transfer effect by a multiplicative ' + (this.getPower()*100) + '% bonus per corresponding sacrifice you have committed.';
			return desc;
		},
		shortName: 'rxtbloodinjector',
		cost: {
			xp: {
				blood: 30,
			}
		}
	});
	Boosts.newBoost({
		name: 'Deep Cuts',
		icon: 'tint red',
		getDescription: function() {
			let desc = 'If you cut your friends good, they will bleed nicely. They have a chance to leak blood each time they activate.';
			return desc;
		},
		shortName: 'deepcuts',
		cost: {
			xp: {
				blood: 42,
			}
		}
	});
	Boosts.newBoost({
		name: 'So Much Blood',
		icon: 'tint red red-glow',
		getDescription: function() {
			let desc = '<span class="red red-glow">Blood is power</span><br/>Each 1% of blood you have adds to the output multiplier of your bloodfull friends';
			return desc;
		},
		shortName: 'somuchblood',
		cost: {
			xp: {
				blood: 100,
			}
		}
	});
	Boosts.newBoost({
		name: 'Blut Loader',
		icon: 'download red red-glow',
		getDescription: function() {
			let desc = '<span class="red red-glow">Blood is power</span><br/>Each 1% of blood you have adds to the multiplier of Bootloader';
			return desc;
		},
		shortName: 'blutloader',
		cost: {
			xp: {
				blood: 10,
			},
			levels:{
				MM: 70,
				MC: 70
			}
		}
	});
	Boosts.newBoost({
		name: 'Digital Sacrifice',
		icon: 'bezier-curve digital red-glow',
		getDescription: function() {
			let desc = '<span class="red red-glow">Blood is power</span><br/>Corresponding sacrifices give a cummulative 10% bonus to Bootloader for same currency';
			return desc;
		},
		shortName: 'digitalsacrifice',
		cost: {
			xp: {
				blood: 10,
			},
			levels: {
				MM: 90,
				MC: 90
			}
		}
	});
	Boosts.newBoost({
		name: 'Giant Blood Rats',
		icon: 'rat red red-glow',
		getDescription: function() {
			let desc = '<span class="red red-glow">Blood is power</span><br/>Rats so big you could sacrifice them... Is that a good idea? Who knows what rat eats nowadays, maybe there are things in them better left unfound.';
			return desc;
		},
		shortName: 'giantbloodrats',
		cost: {
			xp: {
				blood: 99,
			},
			levels: {
				MM: 99,
				MC: 99
			}
		}
	});
	Boosts.newBoost({
		name: 'Giant Rat',
		icon: 'rat giant-rat red',
		getDescription: function() {
			let desc = 'A rat so big you could kill and loot it.';
			return desc;
		},
		buyButtonLabel: 'Kill',
		shortName: 'giantrat',
		cost: {
			levels: {
				bloodSpikes: 1,
			}
		},
		buy: function(me) {
			Game.getModule('bip').killGiantRat(me);
		},
	});
	Boosts.newBoost({
		name: 'Blood Catalyzer',
		icon: 'bolt red red-glow',
		getDescription: function() {
			let desc = 'You\'re going to need a weapon if you want to kill those big rats.';
			if (this.isBought()) {
				desc += '<br/>You have ' + Game.currency('bloodSpikes').getLevel() + ' blood spikes.';
				desc += '<br/><div class="btn ' + (!Game.hasCurrency({xp: { blood: 20} }) ? "disabled" : "") + '" onclick="gameObjects.Shop.boost(\'bloodcatalyzer\').makeSpike()">Make one with 20 blood</div>'
			}
			return desc;
		},
		makeSpike: function () {
			let costForOneSpike = {xp: { blood: 20} };
			if (Game.hasCurrency(costForOneSpike)) {
				Game.spend(costForOneSpike);
				let currency = Game.currency('bloodSpikes');
				currency.levelUp();
			}
		},
		shortName: 'bloodcatalyzer',
		cost: {
			xp: {
				blood: 50,
			}
		}
	});
	
})(gameObjects.Game, gameObjects.Boosts, gameObjects.Display, gameObjects.Shop, gameObjects.Loot);