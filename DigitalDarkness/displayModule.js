/*
*
* Mouse Pro
*
* Display Module.js
*/

(function (Game, Display, Shop) {

    let displayModule = {};

    displayModule.refresh = function() {
        if (Shop.has('backyard')){
            displayModule.updateBolts();
            if (Shop.has('batteries'))
                displayModule.updateBatteries();
        }
    }

    displayModule.updateBolts = function() {
        let div = document.getElementById('bolts');
        div.style.display = '';
        let amount = document.getElementById('bolts-amount');
        amount.innerHTML = Shop.boost('backyard').saveableState.power.nuts;
    }

    displayModule.updateBatteries = function() {
        let div = document.getElementById('batteries');
        div.style.display = '';
        let amount = document.getElementById('batteries-amount');
        amount.innerHTML = Shop.boost('backyard').saveableState.power.batteries;
    }

    displayModule.displayCurrency = function(currencyShortName) {
		let currency = Game.currency(currencyShortName);
        if (currency.isToBeDisplayedNormally) return;

        currency.isToBeDisplayedNormally = true;
		let ul = document.getElementById('currencies');
		
        let currencyDiv = Display.buildDisplayItemForCurrency(currency);
        ul.appendChild(currencyDiv);
    }

    Display.module('dd', displayModule);

})(gameObjects.Game, gameObjects.Display, gameObjects.Shop);
