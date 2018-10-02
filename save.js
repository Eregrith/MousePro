/*
*
* Mouse Pro
*
* Save.js
*/

(function(Display, Game, Friends, Shop, Achievements, Save) {

    Save.toto = "true";

    Save.saveGame = function() {
        let saveCurrencies = [];
        for (c in Game.currencies) {
            if (Game.currencies.hasOwnProperty(c)) {
                saveCurrencies.push({shortName: Game.currencies[c].shortName, saveableState: Game.currencies[c].saveableState });
            }
        }
        let saveBoosts = [];
        for (b in Shop.boosts) {
            if (Shop.boosts.hasOwnProperty(b)) {
                saveBoosts.push({shortName: Shop.boosts[b].shortName, saveableState: Shop.boosts[b].saveableState });
            }
        }
        let saveFriends = [];
        for (f in Friends.friends) {
            if (Friends.friends.hasOwnProperty(f)) {
                saveFriends.push({shortName: Friends.friends[f].shortName, saveableState: Friends.friends[f].saveableState });
            }
        }
        let acquiredAchievements = [];
        for (a in Achievements.achievements) {
            if (Achievements.achievements.hasOwnProperty(a)) {
                if (Achievements.achievements[a].acquired) {
                    acquiredAchievements.push(Achievements.achievements[a].shortName);
                }
            }
        }

        let saveGame = {
            Currencies: saveCurrencies,
            Boosts: saveBoosts,
            Friends: saveFriends,
            AcquiredAchievements: acquiredAchievements
        };

        localStorage.setItem('saveGame', JSON.stringify(saveGame));

        Display.notify('Game saved');
    }

    Save.loadGame = function() {
        let localSave = localStorage.getItem('saveGame')
        if (localSave == undefined) return ;
        
        let saveGame = JSON.parse(localSave);

        let saveCurrencies = saveGame.Currencies;
        for (c in saveCurrencies) {
            if (saveCurrencies.hasOwnProperty(c)) {
                let currency = Game.currency(saveCurrencies[c].shortName);
                currency.saveableState = saveCurrencies[c].saveableState;
            }
        }
        let saveBoosts = saveGame.Boosts;
        for (b in saveBoosts) {
            if (saveBoosts.hasOwnProperty(b)) {
                let boost = Shop.boost(saveBoosts[b].shortName);
                boost.saveableState = saveBoosts[b].saveableState;
            }
        }
        let saveFriends = saveGame.Friends;
        for (f in saveFriends) {
            if (saveFriends.hasOwnProperty(c)) {
                let friend = Friends.friend(saveFriends[f].shortName);
                friend.saveableState = saveFriends[f].saveableState;
            }
        }
        let acquiredAchievements = saveGame.AcquiredAchievements;
        for (a in acquiredAchievements) {
            if (acquiredAchievements.hasOwnProperty(a)) {
                Achievements.achievement(acquiredAchievements[a]).acquired = true;
            }
        }

        Display.refreshShop();
        Display.refreshFriends();
        Display.refreshBoostsOwned();
        Display.notify('Game loaded');
    }

    Save.resetSave = function() {
        localStorage.removeItem('saveGame');
    }

    setInterval(Save.saveGame, 10000);

    Save.loadGame();

})(gameObjects.Display, gameObjects.Game, gameObjects.Friends, gameObjects.Shop, gameObjects.Achievements, gameObjects.Save);