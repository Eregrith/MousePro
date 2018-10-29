/*
*
* Mouse Pro
*
* Save.js
*/

(function(Display, Game, Friends, Shop, Achievements, Tabs, Save) {

    Save.toto = "true";

    Save.generateSaveGame = function() {
        
        let saveCurrencies = [];
        Game.currencies.forEach((currency) => {
            saveCurrencies.push({shortName: currency.shortName, saveableState: currency.saveableState });
        });
        let saveTabs = [];
        Tabs.tabs.forEach((tab) => {
            saveTabs.push({shortName: tab.shortName, saveableState: tab.saveableState });
        });
        let saveBoosts = [];
        Shop.boosts.forEach((boost) => {
            saveBoosts.push({shortName: boost.shortName, saveableState: boost.saveableState });
        });
        let saveFriends = [];
        Friends.friends.forEach((friend) => {
            saveFriends.push({shortName: friend.shortName, saveableState: friend.saveableState });
        });
        let acquiredAchievements = [];
        Achievements.achievements.forEach((achievement) => {
            if (achievement.acquired) {
                acquiredAchievements.push(achievement.shortName);
            }
        });

        let saveGame = {
            Tabs: saveTabs,
            Currencies: saveCurrencies,
            Boosts: saveBoosts,
            Friends: saveFriends,
            AcquiredAchievements: acquiredAchievements
        };

        return saveGame;
    }

    Save.saveGame = function() {
        let saveGame = Save.generateSaveGame();

        localStorage.setItem('saveGame', JSON.stringify(saveGame));

        Display.notify('Game saved');
    }

    Save.loadGame = function() {
        let localSave = localStorage.getItem('saveGame')
        if (localSave == undefined) return ;
        
        let saveGame = JSON.parse(localSave);
        Save.applySave(saveGame);

        if (!Achievements.has('bootloader')) {
            Shop.unlock('bootloader');
            Achievements.gain('bootloader');
        }
    }

    Save.applySave = function(saveGame){
        saveGame.Currencies.forEach((savedCurrency) => {
            let currency = Game.currency(savedCurrency.shortName);
            currency.saveableState = savedCurrency.saveableState;
        });
        saveGame.Tabs.forEach((savedTab) => {
            let tab = Tabs.tab(savedTab.shortName);
            tab.saveableState = savedTab.saveableState;
        });
        saveGame.Boosts.forEach((savedBoost) => {
            let boost = Shop.boost(savedBoost.shortName);
            boost.saveableState = savedBoost.saveableState;
        });
        saveGame.Friends.forEach((savedFriend) => {
            let friend = Friends.friend(savedFriend.shortName);
            friend.saveableState = savedFriend.saveableState;
        });
        saveGame.AcquiredAchievements.forEach((acquiredAchievement) => {
            Achievements.achievement(acquiredAchievement).acquired = true;
        });

        Display.refreshShop();
        Display.refreshTabs();
        Display.displayActiveTab();
        Display.refreshFriends();
        Display.refreshBoostsOwned();
        Display.notify('Game loaded');
    }

    Save.resetSave = function() {
        let ok = confirm('Are you sure you want to wipe your save?');
        if (!ok) return;
        
        localStorage.removeItem('saveGame');
        window.location.reload();
    }

    Save.exportSave = function() {
        let saveGame = Save.generateSaveGame();

        let exportSave = btoa(JSON.stringify(saveGame));

        Display.displaySaveExport(exportSave);
    }

    Save.importSave = function() {
        let saveBase64 = prompt("Paste your save:", '');
        if (saveBase64 == null || saveBase64 == '') return;

        let saveGame = JSON.parse(atob(saveBase64));
        Save.applySave(saveGame);
    }

    setInterval(Save.saveGame, 10000);

    Save.loadGame();

})(gameObjects.Display, gameObjects.Game, gameObjects.Friends, gameObjects.Shop, gameObjects.Achievements, gameObjects.Tabs, gameObjects.Save);