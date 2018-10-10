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
        }
    ];

    Tabs.unlock = function(shortName) {
        let tab = Tabs.tab(shortName);
        tab.saveableState.unlocked = true;
        Display.needsRepaintImmediate = true;
    }

    Tabs.tab = function(shortName) {
        return Tabs.tabs.filter(t => t.shortName == shortName)[0];
    }

    Tabs.toggleActiveTabTo = function(shortName) {
        for (t in Tabs.tabs) {
            if (Tabs.tabs.hasOwnProperty(t)) {
                Tabs.tabs[t].saveableState.active = false;
            }
        }
        Tabs.tab(shortName).saveableState.active = true;
    }

    Tabs.getActiveTab = function() {
        return Tabs.tabs.filter(t => t.isActive())[0].shortName;
    }

})(gameObjects.Display, gameObjects.Tabs);