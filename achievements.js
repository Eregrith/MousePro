/*
*
* Mouse Pro
*
* Achievements.js
*/

Achievements = {};

(function (Display, Achievements) {

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
		}
	];
	
	Achievements.achievement = function(shortName) {
		return Achievements.achievements.filter(a => a.shortName == shortName)[0];
	}
	
	Achievements.gain = function(achievementShortName) {
		let ach = Achievements.achievement(achievementShortName);
		ach.acquired = true;
		Display.notifyAchievementGained(ach);
	}
	
	Achievements.has = function(achievementShortName) {
		let ach = Achievements.achievement(achievementShortName);
		return ach.acquired;
	}

})(gameObjects.Display, gameObjects.Achievements);