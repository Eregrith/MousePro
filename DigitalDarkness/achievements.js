/*
*
* Mouse Pro
*
* Achievements.js
*/

(function (Achievements) {

    Achievements.achievements.push(...[
		{
			name: 'Better than tape',
			shortName: 'betterthantape',
			description: 'But how?!',
			acquired: false
        },
		{
			name: 'Onion-flavored condoms',
			shortName: 'tor',
			description: 'Always use protection.',
			acquired: false
        },
		{
			name: 'THAT\'S A 50 DWK MINUS!',
			shortName: 'badcall',
			description: 'Get caught by the police.',
			acquired: false
        },
		{
			name: 'To infinity ...',
			shortName: 'buzzlightyear',
			description: 'Reach infinite required XP for both proficiencies.',
			acquired: false
        },
		{
			name: '... And beyond',
			shortName: 'beyondinfinity',
			description: 'Reach infinite XP for both proficiencies.',
			acquired: false
        }
    ]);
        
})(gameObjects.Achievements);