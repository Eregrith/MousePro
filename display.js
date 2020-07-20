/*
*
* Mouse Pro
*
* Display.js
*/

(function (Game, Achievements, Shop, Friends, Tabs, Stats, Display, BoostCategories, Log) {

	Display.tickInterval = null;
	Display.tickIntervalValue = 10;
	Display.ticks = 0;
	
	Display.framesPerSecond = function() {
		return 1000.0 / Display.tickIntervalValue;
	}
	
	Display.updateCurrencies = function() {
		Game.currencies.filter(c => c.isToBeDisplayedNormally).forEach(Display.updateCurrency);
	}
	
	Display.updateCurrency = function(currency) {
		let xpDiv = document.getElementById('currency-'+currency.shortName+'-xp');
		if (xpDiv) {
			xpDiv.innerHTML = Display.beautify(currency.getXp()) + ' / ' + Display.beautify(currency.xpRequiredForNextLevel());
		}

		let currencyLevel = document.getElementById('currency-'+currency.shortName+'-level');
		if (currencyLevel) {
			currencyLevel.innerHTML = '<span>' + currency.iconTag + '&nbsp;' + currency.shortName + ' (' + currency.getLevel() + ') XP:</span>';
		}

		let progressBar = document.getElementById('currency-' + currency.shortName + '-bar');
		if (progressBar) {
			let progressPercent = Game.currencyProgressPercent(currency.shortName);
			progressBar.style = 'width: '+progressPercent+'%;--currency-color: ' + currency.color;
		}
	}
	
	Display.beautify = function(value) {
		let negative = value < 0 ? '-' : '';
		if (isNaN(value)) return 'Borked';
		if (!isFinite(value)) return 'Infinity';

		value = Math.floor(Math.abs(value));
		if (value <= 5000) return negative + value;
		
		let postFixedValue = value.toExponential(2).replace(/e\+/, ' e');
		let postFixes = [
			{ divisor: 1e3,  postFix: 'K'},
			{ divisor: 1e6,  postFix: 'M'},
			{ divisor: 1e9,  postFix: 'B'},
			{ divisor: 1e12, postFix: 'T'},
			{ divisor: 1e15, postFix: 'Qa'},
			{ divisor: 1e18, postFix: 'Qi'},
			{ divisor: 1e21, postFix: 'Sx'},
			{ divisor: 1e24, postFix: 'Sp'},
			{ divisor: 1e27, postFix: 'Oc'},
			{ divisor: 1e30, postFix: 'No'},
			{ divisor: 1e33, postFix: 'Dc'}
		]
		let postFixIndex = 0;
		while (postFixIndex < (postFixes.length - 1)
			&& postFixes[postFixIndex + 1].divisor <= value) {
			 postFixIndex++;
		}
		if (postFixIndex != postFixes.length - 1)
		{
			let postFixData = postFixes[postFixIndex];
			postFixedValue = (value / postFixData.divisor).toFixed(2) + ' ' + postFixData.postFix;
		}

		return negative + postFixedValue;
	}

	const markerNameA = "example-marker-a"
	const markerNameB = "example-marker-b"
	let loops = 0;
	let loopTime = 0;
	let perfs;

	function initPerfs() {
		perfs = {
			updateCurrencies: [],
			updateNotifs: [],
			refreshDisplayModules: [],
			refreshShop: [],
			refreshTabs: [],
			refreshFriends: [],
			refreshExistingBoosts: [],
			refreshCategories: [],
			refreshAchievements: [],
			refreshStats: [],
			GameTick: [],
		};
	}
	initPerfs();

	function measurePerfOf(func) {
		let start = performance.now();
		func();
		let end = performance.now();
		return end - start;
	}

	Display.tick = function() {
		perfs.updateCurrencies.push(measurePerfOf(Display.updateCurrencies));
		perfs.updateNotifs.push(measurePerfOf(Display.updateNotifs));
		perfs.refreshDisplayModules.push(measurePerfOf(Display.refreshDisplayModules));
		Display.ticks++;
		loops++;
		if (loops == 50) loops = 0;
		if (Display.ticks == 50) {
			Display.ticks = 0;
			if (Tabs.getActiveTab() == 'achievements') {
				perfs.refreshAchievements.push(measurePerfOf(Display.refreshAchievements));
			} else if (Tabs.getActiveTab() == 'stats') {
				perfs.refreshStats.push(measurePerfOf(Stats.refreshStats));
			} else if (Tabs.getActiveTab() == 'game') {
				perfs.refreshShop.push(measurePerfOf(Display.refreshShop));
				perfs.refreshFriends.push(measurePerfOf(Display.refreshFriends));
				Display.refreshBoostsOwned();
				perfs.refreshCategories.push(measurePerfOf(Display.refreshCategories));
			}
			perfs.refreshTabs.push(measurePerfOf(Display.refreshTabs));
		}
		perfs.GameTick.push(measurePerfOf(Game.tick));
		if (graph != undefined && loops == 0) {
			Display.refreshPerfGraph();
			initPerfs();
		}
	}
	
	Display.startTicking = function() {
		this.tickInterval = setInterval(this.tick, Display.tickIntervalValue);
	}
	
	Display.initialize = function() {
		this.bindEvents();
		this.displayCurrencies();
	}
	
	Display.bindEvents = function() {
		document.onmousedown = Game.onclick;
		document.onmousemove = Game.onmousemove;
	}
	
	Display.notifyLevelUp = function(currency) {
		if (Shop.boost('ottovonsacrifice').isActive() && (currency.shortName == 'MM' || currency.shortName == 'MC')) return;

		let msg = 'Level Up ! ' + currency.name + ' is now level ' + currency.getLevel() + '!';
		if (currency.getLevel() <= currency.getHighestLevelAttained())
		{
			if (!Achievements.has('again'))
				Achievements.gain('again');
			msg += ' ... again';
		}
		Display.notify(msg, 'levelup'+currency.shortName);
	}
	
	Display.displayCurrencies = function () {
		let ul = document.getElementById('currencies');
		
		Game.currencies.filter(c => c.isToBeDisplayedNormally).sort((a,b) => a.order - b.order).forEach((currency) => {
			let currencyDiv = this.buildDisplayItemForCurrency(currency);
			ul.appendChild(currencyDiv);
		});
	}
	
	Display.refreshShop = function () {
		let ul = document.getElementById('shop');
		let shopBoosts = [...ul.getElementsByClassName('boost')];

		let boosts = Shop.boosts.filter(b => b.isUnlocked());
		if (Shop.boost('adblock').isActive()) {
			boosts = boosts.filter(b => b.shortName != 'sacrifice-mm' && b.shortName != 'sacrifice-mc');
		}
		if (boosts.length == 0)
			ul.parentElement.parentElement.style.display = 'none';

		shopBoosts.forEach((shopBoost) => {
			let boost = boosts.filter(b => 'boost-' + b.shortName == shopBoost.id);
			if (boost.length == 0) {
				ul.removeChild(shopBoost);
				return;
			}
		});
		boosts.forEach((boost) => {
			let shopBoost = shopBoosts.filter(sb => sb.id == 'boost-' + boost.shortName);
			if (shopBoost.length == 0) {
				let boostItem = Display.buildDisplayItemForBoost(boost);
				ul.appendChild(boostItem);
			} else {
				shopBoost = shopBoost[0];
				let descDiv = shopBoost.getElementsByClassName('boost-desc')[0];
				let desc = boost.getDescription();
				if (desc != descDiv.innerHTML)
					descDiv.innerHTML = desc;
				let ephemeralDiv = shopBoost.getElementsByClassName('boost-ephemeral');
				if (ephemeralDiv.length > 0){
					ephemeralDiv = ephemeralDiv[0];
					let ephemeralDescription = boost.getEphemeralDescription(Display);
					if (ephemeralDescription != ephemeralDiv.innerHTML)
						ephemeralDiv.innerHTML = ephemeralDescription;
				}
				let lifeDiv = shopBoost.getElementsByClassName('boost-life-in-seconds');
				if (lifeDiv.length > 0){
					lifeDiv = lifeDiv[0];
					let lifeInSeconds = boost.getLifeInSeconds(Display);
					if (lifeInSeconds != lifeDiv.innerHTML)
						lifeDiv.innerHTML = lifeInSeconds;
				}
				let buyButton = shopBoost.getElementsByClassName('boost-buy-btn')[0];
				if (!Game.hasCurrency(boost.getCost()) || !boost.canBuy()) {
					if (!buyButton.classList.contains('disabled'))
						buyButton.classList.add('disabled');
				}
				else if (buyButton.classList.contains('disabled'))
					buyButton.classList.remove('disabled');
			}
		});
	}
	
	Display.refreshAchievements = function() {
		let ul = document.getElementById('achievements');
		let tabAchievements = [...ul.getElementsByClassName('achievement')];
		
		let ach = Achievements.achievements;
		if (ach.length == 0) return;

		tabAchievements.forEach((tabAchievement) => {
			let achievement = ach.filter(b => 'achievement-' + b.shortName == tabAchievement.id);
			if (achievement.length == 0) {
				ul.removeChild(tabAchievement);
				return;
			}
		});
		ach.forEach((achievement) => {
			let tabAchievement = tabAchievements.filter(ta => ta.id == 'achievement-' + achievement.shortName);
			if (tabAchievement.length == 0) {
				let achievementItem = Display.buildDisplayItemForAchievement(achievement);
				ul.appendChild(achievementItem);
			} else {
				tabAchievement = tabAchievement[0];
				if (!achievement.acquired) {
					if (!tabAchievement.classList.contains('locked'))
						tabAchievement.classList.add('locked');
				}
				else {
					if (tabAchievement.classList.contains('locked'))
						tabAchievement.classList.remove('locked');
				}
			}
		});
	}

	Display.refreshDisplayModules = function() {
		Display.modules.filter(m => typeof(m.displayModule.refresh) === typeof(Function)).forEach((mod) => {
			mod.displayModule.refresh();
		})
	}

	Display.buildDisplayItemForAchievement = function(achievement) {
		let mainDiv = document.createElement('div');
		mainDiv.classList = ['achievement'];
		if (!achievement.acquired)
			mainDiv.classList.add('locked');
		mainDiv.id = 'achievement-' + achievement.shortName;
		
		let titleDiv = document.createElement('div');
		titleDiv.className = 'achievement-title';
		titleDiv.innerHTML = achievement.name;
		
		let descDiv = document.createElement('div');
		descDiv.className = 'achievement-desc';
		descDiv.innerHTML = achievement.description;
		
		mainDiv.appendChild(titleDiv);
		mainDiv.appendChild(descDiv);

		return mainDiv;
	}
	
	let boostsOwned = 0;
	Display.refreshBoostsOwned = function() {
		let boosts = Shop.boosts.filter(b => b.isBought() && !b.isUnlocked());
		let ul = document.getElementById('owned');
		if (boostsOwned != boosts.length) {
			ul.innerHTML = '';
		}
		boostsOwned = boosts.length;
		let ownedBoosts = [...ul.getElementsByClassName('boost')];

		if (BoostCategories.getActiveCategory().name !== '*') {
			boosts = boosts.filter(b => b.category === BoostCategories.getActiveCategory().name);
		}
		if (boosts.length == 0)
			ul.parentElement.parentElement.style.display = 'none';
		else
			ul.parentElement.parentElement.style.display = '';
		perfs.refreshExistingBoosts.push(measurePerfOf(() => Display.refreshExistingBoosts(ownedBoosts, boosts)));
		Display.createNewBoostsDivs(ownedBoosts, boosts, ul);
	}

	Display.createNewBoostsDivs = function(ownedBoosts, boosts, ul){
		boosts.sort((a, b) => { if (a.isActivable) return -1; if (b.isActivable) return 1; if (a.hasXP) return -1; if (b.hasXP) return 1; return 0; } ).forEach((boost) => {
			let ownedBoost = ownedBoosts.filter(sb => sb.id == 'boost-' + boost.shortName);
			if (ownedBoost.length == 0) {
				let boostItem = Display.buildDisplayItemForBoost(boost);
				ul.appendChild(boostItem);
			}
		});
	}

	Display.refreshExistingBoosts = function(ownedBoosts, boosts) {
		ownedBoosts.forEach((ownedBoost) => {
			let boost = boosts.filter(b => 'boost-' + b.shortName == ownedBoost.id);
			if (boost.length == 0) {
				ownedBoost.style.display = 'none';
				return;
			} else {
				boost = boost[0];
				if (ownedBoost.style.display != '')
					ownedBoost.style.display = '';
				let titleDiv = ownedBoost.getElementsByClassName('boost-title')[0];
				let title = boost.name;
				if (title != titleDiv.innerHTML)
					titleDiv.innerHTML = title;
				let descDiv = ownedBoost.getElementsByClassName('boost-desc')[0];
				let desc = boost.getDescription();
				if (desc != descDiv.innerHTML) {
					descDiv.innerHTML = desc;
				}
				if (boost.isActive()) {
					if (ownedBoost.classList.contains('inactive') >= 0) {
						ownedBoost.classList.remove('inactive');
						ownedBoost.classList.add('active');
					}
				} else {
					if (ownedBoost.classList.contains('active') >= 0) {
						ownedBoost.classList.add('inactive');
						ownedBoost.classList.remove('active');
					}
				}

				if (boost.hasXP) {
					let xpDiv = ownedBoost.getElementsByClassName('boost-xp')[0];
					let fullnessPercent = boost.getFullnessPercent();
					if (xpDiv.style.width != fullnessPercent + '%')
						xpDiv.style.width = fullnessPercent + '%';
				}

				if (boost.repairable) {
					let repairDiv = ownedBoost.getElementsByClassName('boost-repair')[0];
					let repairDesc = boost.getRepairDescription();
					if (repairDesc != repairDiv.innerHTML)
						repairDiv.innerHTML = repairDesc;
				}

				if (boost.batteryPowered) {
					let batteryLifeDiv = ownedBoost.getElementsByClassName('battery-life')[0];
					let batteryFullness = Math.round(boost.getBatteryLifePercent(), 0);
					if (batteryFullness > 0) {
						if (batteryLifeDiv.style.height != batteryFullness + '%') {
							batteryLifeDiv.style.height = batteryFullness + '%';
							batteryLifeDiv.parentElement.setAttribute('data-percent', batteryFullness + '%');
						}
						if (batteryLifeDiv.parentElement.classList.contains('battery-dead') >= 0)
							batteryLifeDiv.parentElement.classList.remove('battery-dead');
					} else {
						if (batteryLifeDiv.parentElement.classList.contains('battery-dead') < 0)
							batteryLifeDiv.parentElement.classList.add('battery-dead');
					}
				}
			}
		});
	}

	Display.buildDisplayItemForBoost = function(boost) {
		let mainDiv = document.createElement('div');
		mainDiv.classList = [ 'boost' ];
		if (boost.isActivable) {
			mainDiv.classList.add('activable');
		}
		if (boost.ephemeral) {
			mainDiv.classList.add('ephemeral');
		}
		if (boost.isLoot) {
			mainDiv.classList.add('isLoot');
		}
		if (boost.batteryPowered) {
			mainDiv.classList.add('batteryPowered');
		}
		mainDiv.id = 'boost-' + boost.shortName;
		
		let titleDiv = document.createElement('div');
		titleDiv.className = 'boost-title';
		titleDiv.innerHTML = boost.name;
		mainDiv.appendChild(titleDiv);

		if (boost.getIcon() != undefined) {
			let iconDiv = document.createElement('div');
			iconDiv.className = 'boost-icon fa fa-' + boost.getIcon();
			mainDiv.appendChild(iconDiv);
		}
		
		let descDiv = document.createElement('div');
		descDiv.className = 'boost-desc';
		descDiv.innerHTML = boost.getDescription();
		mainDiv.appendChild(descDiv);

		if (boost.ephemeral) {
			let ephemeralDiv = document.createElement('div');
			ephemeralDiv.className = 'boost-ephemeral';
			ephemeralDiv.innerHTML = boost.getEphemeralDescription(Display);
			mainDiv.appendChild(ephemeralDiv);
		}

		if (boost.isUnlocked()) {
			let costDiv = document.createElement('div');
			costDiv.className = 'boost-cost';
			costDiv.innerHTML = 'Cost:';
			costDiv.appendChild(Display.buildCostListForCost(boost.cost));
			mainDiv.appendChild(costDiv);

			let buyButton = document.createElement('div');
			buyButton.classList = ['boost-buy-btn'];
			buyButton.innerHTML = boost.buyButtonLabel;
			if (!Game.hasCurrency(boost.getCost()) || !boost.canBuy())
				buyButton.classList.add('disabled');
			buyButton.addEventListener('click', function() { Shop.buy(boost.shortName) });

			mainDiv.appendChild(buyButton);
		}
		
		if (boost.isActive()) {
			mainDiv.classList.remove('inactive');
			mainDiv.classList.add('active');
		} else {
			mainDiv.classList.add('inactive');
			mainDiv.classList.remove('active');
		}

		if (boost.repairable) {
			repairDiv = document.createElement('div');
			repairDiv.className = 'boost-repair';
			repairDiv.innerHTML = boost.getRepairDescription(Display);
			mainDiv.appendChild(repairDiv);
		}

		if (boost.ephemeral) {
			let lifeCounter = document.createElement('div');
			lifeCounter.className = 'boost-heart';
			let ephemeralHeartDiv = document.createElement('div');
			ephemeralHeartDiv.className = 'heart';
			let secondsDiv = document.createElement('div');
			secondsDiv.className = 'boost-life-in-seconds';
			secondsDiv.innerHTML = boost.getLifeInSeconds(Display);
			lifeCounter.appendChild(secondsDiv);
			lifeCounter.appendChild(ephemeralHeartDiv);
			mainDiv.appendChild(lifeCounter);
		}
		if (boost.isLoot) {
			let lootLabel = document.createElement('div');
			lootLabel.classList = ['boost-loot-label'];
			lootLabel.innerHTML = '<i class="fa-loot"></i> Loot!';
			mainDiv.appendChild(lootLabel);
		}

		if (boost.batteryPowered) {
			let batteryDiv = document.createElement('div');
			batteryDiv.classList = [ 'boost-battery' ];
			let batteryLife = document.createElement('div');
			batteryLife.className = 'battery-life';
			let batteryFullness = Math.round(boost.getBatteryLifePercent(), 0);
			if (batteryFullness > 0) {
				batteryLife.style.height = batteryFullness + '%';
				batteryDiv.setAttribute('data-percent', batteryFullness + '%');
			} else {
				batteryDiv.classList.add('battery-dead');
			}
			batteryDiv.appendChild(batteryLife);
			mainDiv.appendChild(batteryDiv);
		}

		if (boost.hasXP) {
			let xpDiv = document.createElement('div');
			xpDiv.className = 'boost-xp';
			xpDiv.style.width = boost.getFullnessPercent() + '%';
			xpDiv.style.backgroundColor = boost.xpBarColor;
			mainDiv.appendChild(xpDiv);
		}
		
		return mainDiv;
	}

	Display.showBloodFull = function(iconDiv, shortName) {
		if (Shop.has('bloodfull' + shortName)) {
			iconDiv.classList.add('red');
			iconDiv.classList.add('red-glow');
			Display.showBloodFulls[shortName] = () => {};
		}
	}
	Display.showHaxxor = function(iconDiv, shortName) {
		if (Shop.has('haxxor' + shortName)) {	
			iconDiv.classList.remove('red');
			iconDiv.classList.remove('red-glow');
			iconDiv.classList.add('digital');
			iconDiv.classList.add('digital-glow');
			Display.showHaxxors[shortName] = () => {};
		}
	}
	
	Display.showBloodFulls = [];
	Display.showHaxxors = [];

	Display.refreshFriends = function() {
		let friends = Friends.friends.filter(f => f.canBuy());
		if (friends.length == 0) return;

		let ul = document.getElementById('friends');
		let unlockedFriends = [...ul.getElementsByClassName('friend')];
		ul.parentElement.parentElement.style.display = '';
		
		unlockedFriends.forEach((unlockedFriend) => {
			let friend = friends.filter(f => 'friend-' + f.shortName == unlockedFriend.id);
			if (friend.length == 0) {
				unlockedFriend.style.display = 'none';
				return;
			}
			friend = friend[0];
			let costDiv = unlockedFriend.getElementsByClassName('friend-cost')[0];
			let costList = costDiv.getElementsByClassName('cost-list')[0];
			costDiv.removeChild(costList);
			costDiv.appendChild(Display.buildCostListForCost(friend.getCosts()));
		});
		friends.forEach((friend) => {
			let unlockedFriend = unlockedFriends.filter(sb => sb.id == 'friend-' + friend.shortName);
			if (unlockedFriend.length == 0) {
				let friendItem = Display.buildDisplayItemForFriend(friend);
				ul.appendChild(friendItem);
			} else {
				unlockedFriend = unlockedFriend[0];
				unlockedFriend.style.display = '';
				let title = unlockedFriend.getElementsByClassName('friend-title')[0];
				let name = friend.getName();
				if (name != title.innerHTML)
					title.innerHTML = name;

				Display.showBloodFulls[friend.shortName](friend.shortName);
				Display.showHaxxors[friend.shortName](friend.shortName);

				let descDiv = unlockedFriend.getElementsByClassName('friend-desc')[0];
				let desc = friend.getDescription();
				if (desc != descDiv.innerHTML)
					descDiv.innerHTML = desc;
				
				let buyButton = unlockedFriend.getElementsByClassName('friend-buy-btn')[0];
				if (!Game.hasCurrency(friend.getCosts())) {
					if (!buyButton.classList.contains('disabled'))
						buyButton.classList.add('disabled');
				}
				else if (buyButton.classList.contains('disabled'))
					buyButton.classList.remove('disabled');

				let bloodDiv = unlockedFriend.getElementsByClassName('friend-blood-xp')[0];
				let fullnessPercent = friend.getFullnessPercent() + '%';
				if (fullnessPercent != bloodDiv.style.width)
					bloodDiv.style.width = fullnessPercent;
			}
		});
	}

	Display.buildDisplayItemForFriend = function(friend) {
		let mainDiv = document.createElement('div');
		mainDiv.className = 'friend';
		mainDiv.id = 'friend-' + friend.shortName;

		let titleDiv = document.createElement('div');
		titleDiv.className = 'friend-title';
		titleDiv.innerHTML = friend.getName();
		mainDiv.appendChild(titleDiv);

		if (friend.icon != undefined) {
			let iconDiv = document.createElement('div');
			iconDiv.className = 'friend-icon fa fa-' + friend.icon;
			if (Shop.has('bloodfull' + friend.shortName)) {
				iconDiv.className += ' red red-glow';
				Display.showBloodFulls[friend.shortName] = () => {};
			} else {
				Display.showBloodFulls[friend.shortName] = (shortName) => Display.showBloodFull(iconDiv, shortName);
			}
			if (Shop.has('haxxor' + friend.shortName)) {
				iconDiv.className = iconDiv.className.replace('red red-glow', '');
				iconDiv.className += ' digital digital-glow';
				Display.showHaxxors[friend.shortName] = () => {};
			} else {
				Display.showHaxxors[friend.shortName] = (shortName) => Display.showHaxxor(iconDiv, shortName);
			}
			mainDiv.appendChild(iconDiv);
		}
		
		let descDiv = document.createElement('div');
		descDiv.className = 'friend-desc';
		descDiv.innerHTML = friend.getDescription();
		mainDiv.appendChild(descDiv);
		
		let costDiv = document.createElement('div');
		costDiv.className = 'friend-cost';
		costDiv.innerHTML = 'Cost:';
		costDiv.appendChild(Display.buildCostListForCost(friend.getCosts()));
		mainDiv.appendChild(costDiv);
		
		let buyButton = document.createElement('div');
		buyButton.classList = ['friend-buy-btn'];
		buyButton.innerHTML = 'Buy';
		if (!Game.hasCurrency(friend.getCosts()))
			buyButton.classList.add('disabled');
		buyButton.onclick = function() { Friends.buy(friend.shortName) };
		mainDiv.appendChild(buyButton);

		let bloodDiv = document.createElement('div');
		bloodDiv.className = 'friend-blood-xp';
		bloodDiv.style.width = friend.getFullnessPercent() + '%';
		mainDiv.appendChild(bloodDiv);
		
		return mainDiv;
	}
	
	Display.buildCostListForCost = function(cost) {
		let ul = document.createElement('ul');
		ul.className = 'cost-list';
		
		if (cost.xp) {
			for (let part in cost.xp) {
				if (cost.xp.hasOwnProperty(part)) {
					let li = document.createElement('li');
					let currency = Game.currency(part);
					li.innerHTML = currency.iconTag + '&nbsp;' + part + ': ' + cost.xp[part] + ' ' + currency.xpLabel;
					ul.appendChild(li);
				}
			}
		}
		if (cost.levels) {
			for (let part in cost.levels) {
				if (cost.levels.hasOwnProperty(part)) {
					let li = document.createElement('li');
					let currency = Game.currency(part);
					li.innerHTML = currency.iconTag + '&nbsp;' +part + ': ' + cost.levels[part] + ' ' + currency.levelsLabel;
					ul.appendChild(li);
				}
			}
		}
		
		return ul;
	}
	
	Display.buildDisplayItemForCurrency = function(currency) {
		let div = document.createElement('div');
		div.className = 'currency';
		div.id = 'currency-' + currency.shortName;
		
		let progressBar = document.createElement('div');
		progressBar.style = 'width: 0%;--currency-color: ' + currency.color;
		progressBar.className = 'currency-progressBar';
		progressBar.id = 'currency-' + currency.shortName + '-bar';
		
		div.appendChild(progressBar);
		
		let currencyData = document.createElement('div');
		currencyData.className = 'currency-data';
		
		let currencyLevel = document.createElement('div');
		currencyLevel.id = 'currency-'+currency.shortName+'-level';
		currencyLevel.className = 'currency-level';
		currencyLevel.innerHTML = '<span>' + currency.shortName + ' (' + currency.getLevel() + ')</span>';
		
		currencyData.appendChild(currencyLevel);
		
		let xpDiv = document.createElement('div');
		xpDiv.id = 'currency-'+currency.shortName+'-xp';
		xpDiv.innerHTML = currency.getXp() + ' / ' + currency.xpRequiredForNextLevel();
		xpDiv.className = 'currency-xp';
		
		currencyData.appendChild(xpDiv);
		
		div.appendChild(currencyData);
		let listItem = document.createElement('li');
		listItem.appendChild(div);
		
		return listItem;
	}

	Display.refreshTabs = function() {
		let ul = document.getElementById('tabs');

		let tabs = Tabs.tabs.filter(t => t.isUnlocked());
		if (tabs.length == 0) return;

		let tabBtns = [...ul.getElementsByClassName('tab-btn')];
		ul.parentElement.style.display = '';

		tabBtns.forEach((tabBtn) => {
			if (tabs.filter(t => t.shortName == tabBtn.getAttribute('data-target')).length == 0)
				ul.removeChild(tabBtn);
		});
		tabs.forEach((tab) => {
			if (tabBtns.filter(t => t.getAttribute('data-target') == tab.shortName).length == 0) {
				let div = document.createElement('div');
				div.className = 'tab-btn' + (tab.isActive() ? ' tab-active' : '');
				div.setAttribute('data-target', tab.shortName);
				div.innerHTML = tab.label;
				div.onclick = (function (shortName) {
					return function() { 
						Tabs.toggleActiveTabTo(shortName);
						Display.displayActiveTab();
					};
				})(tab.shortName);
				ul.appendChild(div);
			}
		});
	}

	Display.displayActiveTab = function() {
		let shortName = Tabs.getActiveTab();
		let tabs = document.getElementsByClassName('tab');

		[...tabs].forEach((tabDiv) => {
			if (tabDiv.id == 'tab-' + shortName) {
				tabDiv.classList.add('tab-active');
			} else {
				tabDiv.classList.remove('tab-active');
			}
		});

		let tabBtns = document.getElementsByClassName('tab-btn');

		[...tabBtns].forEach((tabBtnDiv) => {
			if (tabBtnDiv.getAttribute('data-target') == shortName) {
				tabBtnDiv.classList.add('tab-active');
			} else {
				tabBtnDiv.classList.remove('tab-active');
			}
		});
	}

	Display.refreshCategories = function refreshCategories() {
		let ul = document.getElementById('categories');
		if (Shop.has('favorites')) {
			ul.style.display = '';
			let categories = [...ul.getElementsByClassName('boost-category')];
			let activeCat = BoostCategories.getActiveCategory();
			categories.forEach(cat => {
				if (activeCat.name == cat.getAttribute('data-category-name')) {
					cat.classList.add('active');
				} else {
					cat.classList.remove('active');
				}
			});

			let boostCategories = BoostCategories.categories;
			boostCategories.forEach(cat => {
				let catButton =  categories.filter(c => c.getAttribute('data-category-name') === cat.name);
				if (catButton.length === 0) {
					catButton = Display.createCategoryButton(cat);
					ul.appendChild(catButton);
				}
			});
		}
	}

	Display.createCategoryButton = function createCategoryButton(category) {
		let div = document.createElement('div');
		div.className = 'boost-category';
		div.setAttribute('data-category-name', category.name);
		div.innerHTML = category.label;
		if (category.icon !== '') {
			div.innerHTML = '<div style="display:inline-block;width:20px;text-align:center;"><i class="fa fa-' + category.icon + '"></i></div> ' + div.innerHTML;
		}
		div.setAttribute('onclick', 'gameObjects.Display.showCategory("' + category.name + '")');
		return div;
	}

	Display.showCategory = function showCategory(categoryName) {
		if (!BoostCategories.category(categoryName).active) {
			BoostCategories.activate(categoryName);
		}
	}
	
	Display.notifyAchievementGained = function(ach) {
		let achievementGainedMsg = "You gained an achievement ! ";
		achievementGainedMsg += ach.name + ": " + ach.description;
		Display.notify(achievementGainedMsg, 'achievement');
	}
	
	Display.notifyLoot = function(lootedBoost) {
		Display.notify('You found something', 'loot');
		Display.notify(Shop.boost(lootedBoost).name + ' unlocked', 'loot');
	}
	
	Display.notifs = [];
	Display.notifsY = 0;
	Display.notifsX = 0;
	Display.logArchive = {};
	Display.notify = function(msg, category) {

		Log.log(msg, category);

		let x = Math.floor(window.innerWidth / 2);
		let y = Math.floor(window.innerHeight * 0.95);

		let notif = {
			category: category,
			targetX: x,
			targetY: y - 750,
			opacity: 100,
			x: x,
			y: y,
			frame: 0,
			totalFrames: Display.framesPerSecond() * 4,
			div: document.createElement('div')
		};
		
		notif.div.className = 'notif';
		notif.div.innerHTML = msg;
		notif.div.style.position = 'absolute';
		
		Display.queueNotif(notif);
	}
	
	Display.notifQueue = [];
	Display.animatedNotifs = [];
	Display.nextNotifAvailableOn = undefined;
	Display.queueNotif = function(notif) {
		Display.notifQueue = Display.notifQueue.filter(n => n.category != notif.category);
		Display.animatedNotifs = Display.animatedNotifs.filter(n => n.category != notif.category);
		Display.notifQueue.push(notif);
		if (Display.notifQueue.length > 50)
			Display.notifQueue.shift();
	}
	
	Display.updateNotifs = function() {
		if (Display.notifQueue.length === 0) return;
		
		let now = new Date();
		if (!Display.nextNotifAvailableOn
			|| now.getTime() >= Display.nextNotifAvailableOn)
		{
			notif = Display.notifQueue.shift();
			Display.animatedNotifs.push(notif);
			Display.animateNotif(notif);
			Display.nextNotifAvailableOn = now.getTime() + 150;
		}
	}
	
	Display.animateNotif = function(notif) {

		if (Display.animatedNotifs.indexOf(notif) == -1) {
			document.getElementsByTagName('body')[0].removeChild(notif.div);
			return;
		}
		
		let xSway = 5;

		if (notif.frame === 0) {
			notif.moveVector = { x: notif.x, y: 0, targetY: notif.y-notif.targetY };
			notif.moveVector.y = (notif.targetY - notif.y) / notif.totalFrames;
			notif.opacityVector = -notif.opacity / notif.totalFrames;
			document.getElementsByTagName('body')[0].appendChild(notif.div);
		}
		
		notif.frame++;
		notif.x = notif.moveVector.x + (xSway * Math.sin((3*(notif.targetY - notif.y)*Math.PI)/notif.moveVector.targetY));
		notif.y += notif.moveVector.y;
		notif.opacity += notif.opacityVector;
		notif.div.style.top = notif.y + 'px';
		notif.div.style.left = notif.x + 'px';
		notif.div.style.opacity = notif.opacity / 100.0;
		
		if (notif.frame < notif.totalFrames)
		{
			setTimeout(function() { Display.animateNotif(notif); }, Display.tickIntervalValue);
		} else {
			notif.div.remove();
		}
	}

    Display.switchMode = function() {
		let body =  document.getElementsByTagName('body')[0];
		if (body.className == 'dark-theme') {
			body.className = 'origin-theme';
		} else {
			body.className = 'dark-theme';
		}
	}
	
	Display.displaySaveExport = function(save) {
		let mainDiv = document.getElementById('saveExport');
		mainDiv.style.display = '';
		let textArea = document.getElementById('saveExportText');
		textArea.value = save;
	}
	
	Display.closeSaveExport = function() {
		let mainDiv = document.getElementById('saveExport');
		mainDiv.style.display = 'none';
	}
	
	Display.changeFont = function() {
		let body = document.getElementsByTagName('body')[0];

		let gameFont = document.getElementById('gameFont').value;

		body.setAttribute('gameFont', gameFont);
	}

	let graph = undefined;
	Display.stopGraph = function() {
		graph = undefined;
	}

	Display.createGraph = function() {
		var ctx = document.getElementById('perf-chart').getContext('2d');
		let options = {
			scales: {
				yAxes: [{
					ticks: {
						max: 20,
						min: 0,
						stepSize: 0.5
					},
					stacked: true
				}]
			}
		};
		graph = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [
					{ backgroundColor: 'red', borderColor: 'red', label: 'updateCurrencies', data: [] },
					{ backgroundColor: 'yellow', borderColor: 'yellow', label: 'updateNotifs', data: [] },
					{ backgroundColor: 'orange', borderColor: 'orange', label: 'refreshDisplayModules', data: [] },
					{ backgroundColor: 'green', borderColor: 'green', label: 'refreshShop', data: [] },
					{ backgroundColor: 'blue', borderColor: 'blue', label: 'refreshTabs', data: [] },
					{ backgroundColor: 'darkgreen', borderColor: 'darkgreen', label: 'refreshFriends', data: [] },
					{ backgroundColor: 'purple', borderColor: 'purple', label: 'refreshExistingBoosts', data: [] },
					{ backgroundColor: 'cyan', borderColor: 'cyan', label: 'refreshCategories', data: [] },
					{ backgroundColor: 'darkred', borderColor: 'darkred', label: 'refreshAchievements', data: [] },
					{ backgroundColor: 'white', borderColor: 'white', label: 'refreshStats', data: [] },
					{ backgroundColor: 'black', borderColor: 'black', label: 'GameTick', data: [] }
				]
			},
			options: options
		});
	}

	function pushData(chart, dataset, data) {
		chart.data.datasets.filter(d => d.label == dataset)[0].data.push(data);
	}
	
	function popData(chart) {
		chart.data.datasets.forEach(ds => ds.data.shift());
		chart.data.labels.shift();
	}

	Display.refreshPerfGraph = function() {
		graph.data.labels.push('');
		for (let i in perfs) {
			if (perfs.hasOwnProperty(i)) {
				const p = perfs[i];
				const sum = p.reduce((a, b) => a + b, 0);
				const avg = (sum / p.length) || 0;
				pushData(graph, i, Math.round(avg * 100, 2) / 100);
			}
		}
		if (graph.data.datasets[0].data.length > 20)
			popData(graph);
		graph.update();
	}

})(gameObjects.Game, gameObjects.Achievements, gameObjects.Shop, gameObjects.Friends, gameObjects.Tabs, gameObjects.Stats, gameObjects.Display, gameObjects.BoostCategories, gameObjects.Log);