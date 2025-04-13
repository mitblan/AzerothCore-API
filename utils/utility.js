import { DataTypes } from "sequelize"

const charClass = {
	1: 'Warrior',
	2: 'Paladin',
	3: 'Hunter',
	4: 'Rogue',
	5: 'Priest',
	6: 'Death Knight',
	7: 'Shaman',
	8: 'Mage',
	9: 'Warlock',
	11: 'Druid',
}

const charRace = {
	1: 'Human',
	2: 'Orc',
	3: 'Dwarf',
	4: 'Night Elf',
	5: 'Undead',
	6: 'Tauren',
	7: 'Gnome',
	8: 'Troll',
	10: 'Blood Elf',
	11: 'Draenei',
	horde: [ 2, 5, 6, 8, 10 ],
	alliance: [1, 3, 4, 7, 11]
}

const uptimeCalculation = ( uptime ) => {
	// uptime is in seconds
	const totalSeconds = Number( uptime )

	// calculate days, hours, minutes, seconds
	var d = Math.floor( totalSeconds / ( 3600 * 24 ) )
	var h = Math.floor( totalSeconds % ( 3600 * 24 ) / 3600 )
	var m = Math.floor( totalSeconds % 3600 / 60 )
	var s = Math.floor( totalSeconds % 60 )

	return { d, h, m, s }

}

const dateFromTimestamp = ( unixTime ) => {
	const localDate = new Date( unixTime * 1000 ).toLocaleDateString()
	const localTime = new Date(unixTime *1000).toLocaleTimeString()
	return {localDate, localTime}
}

export {
  charClass,
	charRace,
	uptimeCalculation,
	dateFromTimestamp
}