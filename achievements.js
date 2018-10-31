/*
*
* Mouse Pro
*
* Achievements.js
*/

Achievements = {};

(function (Display, Shop, Achievements) {

	Achievements.achievements = [
		{
			name: 'Mover Noob',
			shortName: 'mover',
			description: 'Reach level 1 in Mouse Mover',
			acquired: false
		},
		{
			name: 'Clicker Noob',
			shortName: 'clicker',
			description: 'Reach level 1 in Mouse Clicker',
			acquired: false
		},
		{
			name: 'General Noob',
			shortName: 'together',
			description: 'Reach level 5 in both proficiencies',
			acquired: false
		},
		{
			name: '101010(b) = 42',
			shortName: '42',
			description: 'Reach level 10 in both proficiencies',
			acquired: false
		},
		{
			name: 'Battle of Marignan',
			shortName: 'marignan',
			description: 'Reach level 15 in both proficiencies',
			acquired: false
		},
		{
			name: 'Pro tuner',
			shortName: 'jacky',
			description: 'Reach level 1 in both proficiencies',
			acquired: false
		},
		{
			name: 'Bootloader',
			shortName: 'bootloader',
			description: 'Load a saved game',
			acquired: false
		},
		{
			name: 'Quarter of a century',
			shortName: 'quartercentury',
			description: 'Reach level 25 in both proficiencies',
			acquired: false
		},
		{
			name: 'Say Cheese',
			shortName: 'saycheese',
			description: 'Get cheese',
			acquired: false
		},
		{
			name: 'Glowing proficiency',
			shortName: 'glowing',
			description: 'Reach level 30 in both proficiencies',
			acquired: false
		},
		{
			name: 'Statistician',
			shortName: 'statistician',
			description: 'Have any xp at 123',
			acquired: false
		},
		{
			name: '20/20 MODE',
			shortName: 'fnafMaster',
			description: 'Reach level 20 in both proficiencies',
			acquired: false
		},
		{
			name: 'Cutting down to business',
			shortName: 'cutting',
			description: 'Made 5 sacrifices',
			acquired: false
		},
		{
			name: 'OCD Hell',
			shortName: 'ocd',
			description: 'You\'ll never get this one. <span style="font-size:2pt">Thank you /u/jverity</span>',
			acquired: false
		}
	];
	
	Achievements.achievement = function(shortName) {
		return Achievements.achievements.filter(a => a.shortName == shortName)[0];
	}
	
	Achievements.gain = function(achievementShortName) {
		let ach = Achievements.achievement(achievementShortName);
		ach.acquired = true;
		Display.notifyAchievementGained(ach);
		if (!Shop.has('vitrine') && Shop.has('settings')) Shop.unlock('vitrine');
	}
	
	Achievements.has = function(achievementShortName) {
		let ach = Achievements.achievement(achievementShortName);
		return ach.acquired;
	}

})(gameObjects.Display, gameObjects.Shop, gameObjects.Achievements);