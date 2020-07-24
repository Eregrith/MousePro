/*
*
* Mouse Pro
*
* Tabs.js
*/

(function (Display, Tabs) {

    Tabs.tabs = [ 
        {
            label: 'Game',
            shortName: 'game',
            saveableState: {
                unlocked: false,
                active: false
            },
            isActive: function() {
                return this.saveableState.active;
            },
            isUnlocked: function() {
                return this.saveableState.unlocked;
            }
        },
        {
            label: 'Settings',
            shortName: 'settings',
            saveableState: {
                unlocked: false,
                active: false
            },
            isActive: function() {
                return this.saveableState.active;
            },
            isUnlocked: function() {
                return this.saveableState.unlocked;
            }
        },
        {
            label: 'Achievements',
            shortName: 'achievements',
            saveableState: {
                unlocked: false,
                active: false
            },
            isActive: function() {
                return this.saveableState.active;
            },
            isUnlocked: function() {
                return this.saveableState.unlocked;
            }
        },
        {
            label: 'Stats',
            shortName: 'stats',
            saveableState: {
                unlocked: false,
                active: false
            },
            isActive: function() {
                return this.saveableState.active;
            },
            isUnlocked: function() {
                return this.saveableState.unlocked;
            }
        },
        {
            label: 'Log',
            shortName: 'log',
            saveableState: {
                unlocked: false,
                active: false
            },
            isActive: function() {
                return this.saveableState.active;
            },
            isUnlocked: function() {
                return this.saveableState.unlocked;
            }
        },
        {
            label: 'Performance',
            shortName: 'perfs',
            saveableState: {
                unlocked: false,
                active: false
            },
            isActive: function() {
                return this.saveableState.active;
            },
            isUnlocked: function() {
                return this.saveableState.unlocked;
            }
        }
    ];

    Tabs.unlock = function(shortName) {
        let tab = Tabs.tab(shortName);
        tab.saveableState.unlocked = true;
    }

    Tabs.tab = function(shortName) {
        return Tabs.tabs.filter(t => t.shortName == shortName)[0];
    }

    Tabs.toggleActiveTabTo = function(shortName) {
        Tabs.tabs.forEach((tab) => { tab.saveableState.active = false; });
        Tabs.tab(shortName).saveableState.active = true;
    }

    Tabs.getActiveTab = function() {
        let tab = Tabs.tabs.filter(t => t.isActive())[0];
        if (tab == undefined) return '';
        return tab.shortName;
    }

    Tabs.toggleActiveTabTo('game');

})(gameObjects.Display, gameObjects.Tabs);