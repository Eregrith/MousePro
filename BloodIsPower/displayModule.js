/*
*
* Mouse Pro
*
* Display Module.js
*/

(function (Game, Shop, Display, Currencies) {

    let displayModule = {};
    
    displayModule.refresh = function() {
        if (Shop.has('truekriss'))
            displayModule.updateCurrency(Game.currency('blood'));
        if (Shop.has('bloodcatalyzer'))
            displayModule.updateCurrency(Game.currency('bloodSpikes'));
    }

    displayModule.updateCurrency = function(currency) {
        displayModule.displayCurrency(currency);

        let xpDiv = document.getElementById('currency-'+currency.shortName+'-xp');
        if (xpDiv) {
		    xpDiv.innerHTML = currency.getXp().toFixed(2) + '%';
        }

        let progressBar = document.getElementById('currency-' + currency.shortName + '-bar');
        if (progressBar) {
            let progressPercent = currency.getXp();
            progressBar.style = 'height: '+progressPercent+'%;bottom: -'+(100-progressPercent)+'%';
        }

        let levels = document.getElementById('currency-' + currency.shortName + '-levels');
        if (levels) {
            levels.innerHTML = currency.getLevel();
        }
    }
    
    displayModule.displayCurrency = function(currency) {
        let div = document.getElementById(currency.shortName);
        div.style.display = '';
    }

    Display.module('bip', displayModule);

})(gameObjects.Game, gameObjects.Shop, gameObjects.Display, gameObjects.Currencies);
