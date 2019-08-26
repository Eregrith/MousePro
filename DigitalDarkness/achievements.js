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
        }
    ]);
        
})(gameObjects.Achievements);