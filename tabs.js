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

})(gameObjects.Display, gameObjects.Tabs);