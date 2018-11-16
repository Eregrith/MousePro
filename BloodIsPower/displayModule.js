/*
*
* Mouse Pro
*
* Display Module.js
*/

(function (Game, Shop, Display, Currencies) {

    let displayModule = {};
    
    displayModule.refresh = function() {
        displayModule.updateCurrency(Game.currency('blood'));
    }

    displayModule.updateCurrency = function(currency) {
        if (!Shop.has('truekriss')) return;

        displayModule.displayCurrency(currency);

		let xpDiv = document.getElementById('currency-'+currency.shortName+'-xp');
		xpDiv.innerHTML = currency.getXp().toFixed(2) + '%';
		
		let progressBar = document.getElementById('currency-' + currency.shortName + '-bar');
		let progressPercent = currency.getXp();
		progressBar.style = 'height: '+progressPercent+'%;bottom: -'+(100-progressPercent)+'%';
    }
    
    displayModule.displayCurrency = function(currency) {
        let div = document.getElementById('blood');
        div.style.display = '';
    }

    Display.module('bip', displayModule);

})(gameObjects.Game, gameObjects.Shop, gameObjects.Display, gameObjects.Currencies);
