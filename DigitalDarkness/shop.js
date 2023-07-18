/*
*
* Mouse Pro
*
* Shop.js
*/

(function (Shop) {

    Shop.hasRepaired = function hasRepaired(shortName) {
        return Shop.has(shortName) && Shop.boost(shortName).isRepaired();
    }

    Shop.getDealerBoosts = function() {
        return Shop.boosts.filter(b => b.fromDealer);
    }

})(gameObjects.Shop);