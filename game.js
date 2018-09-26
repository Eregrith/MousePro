/*
*
* Mouse Pro
*
* Game.js
*/

(function (Game, Achievements, Shop) {
	
	EventNode = document.getElementById('eventNode');

	Game.currencies = [
		{
			name: 'Mouse Mover',
			shortName: 'MM',
			xp: 0,
			level: 0,
			xpRequiredForNextLevel: 100,
			xpIncreaseFactor: 1.2,
			color: 'gray',
			levelUp: function() {
				this.level++;
				if (this.level >= 1 && !Achievements.has('mover')) {
					Shop.unlock('xtpro');
					Achievements.gain('mover');
				}
			}
		},
		{
			name: 'Mouse Clicker',
			shortName: 'MC',
			xp: 0,
			level: 0,
			xpRequiredForNextLevel: 10,
			xpIncreaseFactor: 1.2,
			color: 'green'
		}
	];
	
	Game.initialize = function() {
		for (var c in Game.currencies) {
			if (Game.currencies.hasOwnProperty(c)) {
				let currency = Game.currencies[c];
				
				currency.levelUp = currency.levelUp || function() { this.level++ };
			}
		}
	}

	Game.currency = function(currencyShortName) {
		return Game.currencies.filter(c => c.shortName == currencyShortName)[0];
	}
	
	Game.currencyProgressPercent = function(currencyShortName) {
		let currency = Game.currency(currencyShortName);
		
		let percent = (currency.xp / currency.xpRequiredForNextLevel) * 100.0;
		return percent;
	}
	
	Game.acquireXp = function(currencyShortName, xpAmount) {
		let currency = Game.currency(currencyShortName);
		currency.xp += xpAmount;
		if (currency.shortName === 'MM') {
			if (Shop.has('xtpro') && currency.xp % 5 === 0) currency.xp++;
		}
		if (currency.xp >= currency.xpRequiredForNextLevel) {
			currency.xp -= currency.xpRequiredForNextLevel;
			currency.xpRequiredForNextLevel = Math.round(currency.xpRequiredForNextLevel * currency.xpIncreaseFactor);
			currency.levelUp();
			Game.triggerEvent('levelUp', { currency: currency });
		}
	}
	
	Game.hasCurrency = function(costs) {
		for (let currency in costs) {
			if (costs.hasOwnProperty(currency)) {
				let cost = costs[currency];
				if (Game.currency(currency).xp < cost) return false;
			}
		}
		return true;
	}
	
	Game.triggerEvent = function(eventCode, data) {
		let event = new CustomEvent(eventCode, { detail: data });
		EventNode.dispatchEvent(event);
	}
	
	Game.lastMouseDown = {};
	
	Game.onclick = function (e) {
		Game.lastMouseDown = { x: e.clientX, y: e.clientY };
		Game.acquireXp('MC', 1);
	}
	
	Game.onmousemove = function(e) {
		if ( e.clientX !== Game.lastMouseDown.x || e.clientY !== Game.lastMouseDown.y) {
			Game.acquireXp('MM', 1);
		}
	}
	
	Game.initialize();

})(gameObjects.Game, gameObjects.Achievements, gameObjects.Shop);