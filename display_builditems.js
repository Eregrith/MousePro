/*
*
* Mouse Pro
*
* Display_BuildItems.js
*/

(function (Game, Shop, Friends, Display) {

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

})(gameObjects.Game, gameObjects.Shop, gameObjects.Friends, gameObjects.Display);