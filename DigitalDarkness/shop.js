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

})(gameObjects.Shop);