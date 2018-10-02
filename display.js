/*
*
* Mouse Pro
*
* Display.js
*/

Display = {};

(function (Game, Achievements, Shop, Friends, Display) {

	EventNode = document.getElementById('eventNode');

	Display.tickInterval = null;
	Display.tickIntervalValue = 10;
	
	Display.framesPerSecond = function() {
		return 1000.0 / Display.tickIntervalValue;
	}
	
	Display.updateCurrencies = function() {
		for (var c in Game.currencies) {
			if (Game.currencies.hasOwnProperty(c)) {
				this.updateCurrency(Game.currencies[c]);
			}
		}
	}
	
	Display.updateNotifs = function() {
		if (Display.notifQueue.length === 0) return;
		
		let now = new Date();
		if (!Display.nextNotifAvailableOn
		|| now.getTime() >= Display.nextNotifAvailableOn)
		{
			notif = Display.notifQueue.shift();
			Display.animateNotif(notif);
			Display.nextNotifAvailableOn = now.getTime() + 400;
		}
	}
	
	Display.updateCurrency = function(currency) {
		let xpDiv = document.getElementById('currency-'+currency.shortName+'-xp');
		xpDiv.innerHTML = Display.beautify(currency.getXp()) + ' / ' + Display.beautify(currency.xpRequiredForNextLevel());
		
		let currencyLevel = document.getElementById('currency-'+currency.shortName+'-level');
		currencyLevel.innerHTML = '<span>' + currency.shortName + ' (' + currency.getLevel() + ') XP:</span>';
		
		let progressBar = document.getElementById('currency-' + currency.shortName + '-bar');
		let progressPercent = Game.currencyProgressPercent(currency.shortName);
		progressBar.style = 'width: '+progressPercent+'%;--currency-color: ' + currency.color;
	}
	
	Display.beautify = function(value) {
		let negative = value < 0 ? '-' : '';

		value = Math.round(Math.abs(value));
		if (value <= 5000) return negative + value;
		
		let postFixedValue = value.toExponential(2).replace(/e\+/, ' e');
		let postFixes = [
			{ divisor: 1e3,  postFix: 'K'},
			{ divisor: 1e6,  postFix: 'M'},
			{ divisor: 1e9,  postFix: 'B'},
			{ divisor: 1e10, postFix: 'T'},
			{ divisor: 1e11, postFix: 'Qa'},
			{ divisor: 1e12, postFix: 'Qi'},
			{ divisor: 1e13, postFix: 'Sx'},
			{ divisor: 1e14, postFix: 'Sp'},
			{ divisor: 1e15, postFix: 'Oc'},
			{ divisor: 1e16, postFix: 'No'},
			{ divisor: 1e17, postFix: 'Dc'}
		]
		let postFixIndex = 0;
		while (postFixIndex < (postFixes.length - 1)
			&& postFixes[postFixIndex + 1].divisor <= value) {
			 postFixIndex++;
		}
		if (postFixIndex != postFixes.length - 1)
		{
			let postFixData = postFixes[postFixIndex];
			postFixedValue = Math.round(value / postFixData.divisor) + ' ' + postFixData.postFix;
		}

		return negative + postFixedValue;
	}
	
	Display.tick = function() {
		Display.updateCurrencies();
		Display.updateNotifs();
		Game.tick();
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
		EventNode.addEventListener('achievementGained', Display.notifyAchievementGained, false);
		EventNode.addEventListener('refreshShop', Display.refreshShop, false);
		EventNode.addEventListener('refreshBoostsOwned', Display.refreshBoostsOwned, false);
		EventNode.addEventListener('refreshFriends', Display.refreshFriends, false);
		EventNode.addEventListener('levelUp', Display.notifyLevelUp, false);
	}
	
	Display.notifyLevelUp = function(e) {
		let currency = e.detail.currency;
		Display.notify('Level Up ! ' + currency.name + ' is now level ' + currency.getLevel() + '!');
	}
	
	Display.displayCurrencies = function () {
		let ul = document.getElementById('currencies');
		
		for (var c in Game.currencies) {
			if (Game.currencies.hasOwnProperty(c)) {
				let currencyDiv = this.buildDisplayItemForCurrency(Game.currencies[c]);
				ul.appendChild(currencyDiv);
			}
		}
	}
	
	Display.refreshShop = function () {
		let boosts = Shop.boosts.filter(b => b.canBuy());
		if (boosts.length == 0) return;
		
		let ul = document.getElementById('shop');
		ul.parentElement.parentElement.style.display = '';
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
		
		for (var b in boosts) {
			if (boosts.hasOwnProperty(b)) {
				let boostItem = Display.buildDisplayItemForBoost(boosts[b]);
				ul.appendChild(boostItem);
			}
		}
	}
	
	Display.refreshBoostsOwned = function() {
		let boosts = Shop.boosts.filter(b => b.isBought());
		if (boosts.length == 0) return;

		let ul = document.getElementById('owned');
		ul.parentElement.parentElement.style.display = '';
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
		
		for (var b in boosts) {
			if (boosts.hasOwnProperty(b)) {
				let boostItem = Display.buildDisplayItemForBoost(boosts[b]);
				ul.appendChild(boostItem);
			}
		}
	}

	Display.buildDisplayItemForBoost = function(boost) {
		let mainDiv = document.createElement('div');
		mainDiv.className = 'boost';
		mainDiv.id = 'boost-' + boost.shortName;
		
		let titleDiv = document.createElement('div');
		titleDiv.className = 'boost-title';
		titleDiv.innerHTML = boost.name;
		
		let descDiv = document.createElement('div');
		descDiv.className = 'boost-desc';
		descDiv.innerHTML = boost.getDescription();
		
		mainDiv.appendChild(titleDiv);
		mainDiv.appendChild(descDiv);

		if (boost.canBuy()) {
			let costDiv = document.createElement('div');
			costDiv.className = 'boost-cost';
			costDiv.innerHTML = 'Cost:';
			costDiv.appendChild(Display.buildCostListForCost(boost.cost));
			mainDiv.appendChild(costDiv);

			let buyButton = document.createElement('div');
			buyButton.className = 'boost-buy-btn';
			buyButton.innerHTML = 'Buy';
			buyButton.onclick = function() { Shop.buy(boost.shortName) };

			mainDiv.appendChild(buyButton);
		}
		
		return mainDiv;
	}
	
	Display.refreshFriends = function() {
		let friends = Friends.friends.filter(f => f.canBuy());
		if (friends.length == 0) return;

		let ul = document.getElementById('friends');
		ul.parentElement.style.display = '';
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
		
		for (var f in friends) {
			if (friends.hasOwnProperty(f)) {
				let friendItem = Display.buildDisplayItemForFriend(friends[f]);
				ul.appendChild(friendItem);
			}
		}
	}

	Display.buildDisplayItemForFriend = function(friend) {
		let mainDiv = document.createElement('div');
		mainDiv.className = 'friend';
		mainDiv.id = 'friend-' + friend.shortName;

		let titleDiv = document.createElement('div');
		titleDiv.className = 'friend-title';
		titleDiv.innerHTML = friend.getName();
		
		let descDiv = document.createElement('div');
		descDiv.className = 'friend-desc';
		descDiv.innerHTML = friend.getDescription();
		
		let costDiv = document.createElement('div');
		costDiv.className = 'friend-cost';
		costDiv.innerHTML = 'Cost:';
		costDiv.appendChild(Display.buildCostListForCost(friend.getCosts()));
		
		let buyButton = document.createElement('div');
		buyButton.className = 'friend-buy-btn';
		buyButton.innerHTML = 'Buy';
		buyButton.onclick = function() { Friends.buy(friend.shortName) };
		
		mainDiv.appendChild(titleDiv);
		mainDiv.appendChild(descDiv);
		mainDiv.appendChild(costDiv);
		mainDiv.appendChild(buyButton);
		
		return mainDiv;
	}
	
	Display.buildCostListForCost = function(cost) {
		let ul = document.createElement('ul');
		
		if (cost.xp) {
			for (let part in cost.xp) {
				if (cost.xp.hasOwnProperty(part)) {
					let li = document.createElement('li');
					li.innerHTML = part + ': ' + cost.xp[part] + ' xp';
					ul.appendChild(li);
				}
			}
		}
		if (cost.levels) {
			for (let part in cost.levels) {
				if (cost.levels.hasOwnProperty(part)) {
					let li = document.createElement('li');
					li.innerHTML = part + ': ' + cost.levels[part] + ' levels';
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
	
	Display.notifyAchievementGained = function(e) {
		let achievementGainedMsg = "You gained an achievement ! ";
		achievementGainedMsg += e.detail.achievement.name + ": " + e.detail.achievement.description;
		Display.notify(achievementGainedMsg);
	}
	
	Display.notifs = [];
	Display.notifsY = 0;
	Display.notifsX = 0;
	Display.logArchive = {};
	Display.notify = function(msg) {

		let x = Math.floor(window.innerWidth / 2);
		let y = Math.floor(window.innerHeight * 0.95);

		let notif = {
			targetX: x,
			targetY: y - 75,
			opacity: 100,
			x: x,
			y: y,
			frame: 0,
			totalFrames: Display.framesPerSecond() * 3,
			div: document.createElement('div')
		};
		
		notif.div.className = 'notif';
		notif.div.innerHTML = msg;
		notif.div.style.position = 'absolute';
		
		Display.queueNotif(notif);
	}
	
	Display.notifQueue = [];
	Display.nextNotifAvailableOn = undefined;
	Display.queueNotif = function(notif) {
		Display.notifQueue.push(notif);
		if (Display.notifQueue.length > 50)
			Display.notifQueue.shift();
	}
	
	Display.animateNotif = function(notif) {
		
		let xSway = 25;

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
	
	Display.initialize();
	
	Display.startTicking();

})(gameObjects.Game, gameObjects.Achievements, gameObjects.Shop, gameObjects.Friends, gameObjects.Display);