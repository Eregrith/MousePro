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
				if (Shop.has('zbglo')) {
					Game.acquireXp('MC', 5 * (Shop.has('addonenhancer') ? 2 : 1));
				}
				if (this.level >= 1 && !Achievements.has('mover')) {
					Shop.unlock('xtpro');
					Achievements.gain('mover');
				}
				if (this.level >= 5 && Game.currency('MC').level >= 5 && !Achievements.has('together')) {
					Shop.unlock('zbglo');
					Achievements.gain('together');
				}
				if (this.level >= 10 && Game.currency('MC').level >= 10 && !Achievements.has('42')) {
					Shop.unlock('addonenhancer');
					Achievements.gain('42');
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
			color: 'green',
			levelUp: function() {
				this.level++;
				if (Shop.has('zbglo')) {
					Game.acquireXp('MM', 5 * (Shop.has('addonenhancer') ? 2 : 1));
				}
				if (this.level >= 1 && !Achievements.has('clicker')) {
					Shop.unlock('dmblu');
					Achievements.gain('clicker');
				}
				if (this.level >= 5 && Game.currency('MM').level >= 5 && !Achievements.has('together')) {
					Shop.unlock('zbglo');
					Achievements.gain('together');
				}
				if (this.level >= 10 && Game.currency('MM').level >= 10 && !Achievements.has('42')) {
					Shop.unlock('addonenhancer');
					Achievements.gain('42');
				}
			}
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
		let bonusXp = 0;
		if (currency.shortName === 'MM') {
			if (Shop.has('xtpro') && currency.xp % 5 === 0) bonusXp = 1* (Shop.has('addonenhancer') ? 2 : 1);
		}
		if (currency.shortName === 'MC') {
			if (Shop.has('dmblu') && currency.xp % 5 === 0) bonusXp = 1 * (Shop.has('addonenhancer') ? 2 : 1);
		}
		currency.xp += bonusXp;
		if (currency.xp >= currency.xpRequiredForNextLevel) {
			currency.xp -= currency.xpRequiredForNextLevel;
			currency.xpRequiredForNextLevel = Math.round(currency.xpRequiredForNextLevel * currency.xpIncreaseFactor);
			currency.levelUp();
			Game.triggerEvent('levelUp', { currency: currency });
		}
	}
	
	Game.hasCurrency = function(costs) {
		for (let currency in costs.xp) {
			if (costs.xp.hasOwnProperty(currency)) {
				let cost = costs.xp[currency];
				if (Game.currency(currency).xp < cost) return false;
			}
		}
		for (let currency in costs.levels) {
			if (costs.levels.hasOwnProperty(currency)) {
				let cost = costs.levels[currency];
				if (Game.currency(currency).level < cost) return false;
			}
		}
		return true;
	}
	
	Game.spend = function(costs) {
		for (let currency in costs.xp) {
			if (costs.xp.hasOwnProperty(currency)) {
				let cost = costs.xp[currency];
				Game.currency(currency).xp -= cost;
			}
		}
		for (let currency in costs.levels) {
			if (costs.levels.hasOwnProperty(currency)) {
				let cost = costs.levels[currency];
				Game.currency(currency).level -= cost;
			}
		}
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