/*
 * Script Name: Get Incs for Player
 * Version: v1.5.7-modified
 * Last Updated: 2025-08-15
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: N/A
 * Approved Date: 2021-04-21
 * Mod: JawJaw
 */

/* Copyright (c) RedAlert
By uploading a user-generated mod (script) for use with Tribal Wars, you grant InnoGames a perpetual, irrevocable, worldwide, royalty-free, non-exclusive license to use, reproduce, distribute, publicly display, modify, and create derivative works of the mod. This license permits InnoGames to incorporate the mod into any aspect of the game and its related services, including promotional and commercial endeavors, without any requirement for compensation or attribution to you. InnoGames is entitled but not obligated to name you when exercising its rights. You represent and warrant that you have the legal right to grant this license and that the mod does not infringe upon any third-party rights. You are - with the exception of claims of infringement by third parties â€" not liable for any usage of the mod by InnoGames. German law applies.
*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Script Config
var scriptConfig = {
    scriptData: {
        prefix: 'getIncsForPlayer',
        name: 'Get Incs for Player',
        version: 'v1.5.6',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/get-incomings-for-player.286977/',
    },
    translations: {
        en_DK: {
            'Get Incs for Player': 'Get Incs for Player',
            Help: 'Help',
            'There was an error!': 'There was an error!',
            'Script must be executed from Player Info screen!':
                'Script must be executed from Player Info screen!',
            Fetching: 'Fetching',
            'Fetching incomings for each village...':
                'Fetching incomings for each village...',
            'Error fetching village incomings!':
                'Error fetching village incomings!',
            'Total Attacks:': 'Total Attacks:',
            'Total Large Attacks:': 'Total Large Attacks:',
            'Total Noble Attacks:': 'Total Noble Attacks:',
            'Total Villages:': 'Total Villages:',
            'Average attacks per village:': 'Average attacks per village:',
            'Could not find villages being attacked!':
                'Could not find villages being attacked!',
            'Player:': 'Player:',
            Village: 'Village',
            Coords: 'Coords',
            'Total Medium Attacks:': 'Total Medium Attacks:',
            'Total Small Attacks:': 'Total Small Attacks:',
            Players: 'Players',
            "You can't sort elements if any one is a descendant of another.":
                "You can't sort elements if any one is a descendant of another.",
            'sort this column': 'sort this column',
            'Landing Time': 'Landing Time',
            'Type': 'Type',
            'Copy Export': 'Copy Export',
            'Copied!': 'Copied!',
        },
        fr_FR: {
            'Get Incs for Player':
                'RÃ©cupÃ©rer les attaques entrantes pour le Joueur',
            Help: 'Aide',
            'There was an error!': 'There was an error!',
            'Script must be executed from Player Info screen!':
                "Le script doit Ãªtre executÃ© depuis le profil d'un joueur!",
            Fetching: 'Chargement',
            'Fetching incomings for each village...':
                'Chargement des ordres pour chaque village ...',
            'Error fetching village incomings!':
                'Erreur dans le chargement des ordres!',
            'Total Attacks:': 'Total - Attaque envoyÃ©es:',
            'Total Large Attacks:': 'Total - Attaque de grande envergure:',
            'Total Noble Attacks:': 'Total - Attaque de noble:',
            'Total Villages:': 'Total - Villages:',
            'Average attacks per village:': 'Moyenne - Attaque par village:',
            'Could not find villages being attacked!':
                'Impossible de trouver les villages attaquÃ©s!',
            'Player:': 'Joueur:',
            Village: 'Village',
            Coords: 'CoordonnÃ©es',
            'Total Medium Attacks:': 'Total - Attaque de moyenne envergure:',
            'Total Small Attacks:': 'Total - Attaque de petite envergure::',
            Players: 'Joueurs',
            "You can't sort elements if any one is a descendant of another.":
                "You can't sort elements if any one is a descendant of another.",
            'sort this column': 'sort this column',
            'Landing Time': 'Heure d\'arrivée',
            'Type': 'Type',
            'Copy Export': 'Copier Export',
            'Copied!': 'Copié!',
        },
    },
    allowedMarkets: [],
    allowedScreens: ['info_player'],
    allowedModes: [],
    isDebug: DEBUG,
    enableCountApi: true,
};

window.twSDK = {
    // variables
    scriptData: {},
    translations: {},
    allowedMarkets: [],
    allowedScreens: [],
    allowedModes: [],
    enableCountApi: true,
    isDebug: false,
    isMobile: jQuery('#mobileHeader').length > 0,
    delayBetweenRequests: 200,
    // helper variables
    market: game_data.market,
    units: game_data.units,
    village: game_data.village,
    buildings: game_data.village.buildings,
    sitterId: game_data.player.sitter > 0 ? `&t=${game_data.player.id}` : '',
    coordsRegex: /\d{1,3}\|\d{1,3}/g,
    dateTimeMatch:
        /(?:[A-Z][a-z]{2}\s+\d{1,2},\s*\d{0,4}\s+|today\s+at\s+|tomorrow\s+at\s+)\d{1,2}:\d{2}:\d{2}:?\.?\d{0,3}/,
    worldInfoInterface: '/interface.php?func=get_config',
    unitInfoInterface: '/interface.php?func=get_unit_info',
    buildingInfoInterface: '/interface.php?func=get_building_info',
    worldDataVillages: '/map/village.txt',
    worldDataPlayers: '/map/player.txt',
    worldDataTribes: '/map/ally.txt',
    worldDataConquests: '/map/conquer_extended.txt',
    // game constants
    buildingsList: [
        'main',
        'barracks',
        'stable',
        'garage',
        'church',
        'church_f',
        'watchtower',
        'snob',
        'smith',
        'place',
        'statue',
        'market',
        'wood',
        'stone',
        'iron',
        'farm',
        'storage',
        'hide',
        'wall',
    ],
    // https://help.tribalwars.net/wiki/Points
    buildingPoints: {
        main: [
            10, 2, 2, 3, 4, 4, 5, 6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 44,
            53, 64, 77, 92, 110, 133, 159, 191, 229, 274, 330,
        ],
        barracks: [
            16, 3, 4, 5, 5, 7, 8, 9, 12, 14, 16, 20, 24, 28, 34, 42, 49, 59, 71,
            85, 102, 123, 147, 177, 212,
        ],
        stable: [
            20, 4, 5, 6, 6, 9, 10, 12, 14, 17, 21, 25, 29, 36, 43, 51, 62, 74,
            88, 107,
        ],
        garage: [24, 5, 6, 6, 9, 10, 12, 14, 17, 21, 25, 29, 36, 43, 51],
        chuch: [10, 2, 2],
        church_f: [10],
        watchtower: [
            42, 8, 10, 13, 14, 18, 20, 25, 31, 36, 43, 52, 62, 75, 90, 108, 130,
            155, 186, 224,
        ],
        snob: [512],
        smith: [
            19, 4, 4, 6, 6, 8, 10, 11, 14, 16, 20, 23, 28, 34, 41, 49, 58, 71,
            84, 101,
        ],
        place: [0],
        statue: [24],
        market: [
            10, 2, 2, 3, 4, 4, 5, 6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 44,
            53, 64, 77, 92, 110, 133,
        ],
        wood: [
            6, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27, 32,
            38, 46, 55, 66, 80, 95, 115, 137, 165, 198,
        ],
        stone: [
            6, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27, 32,
            38, 46, 55, 66, 80, 95, 115, 137, 165, 198,
        ],
        iron: [
            6, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27, 32,
            38, 46, 55, 66, 80, 95, 115, 137, 165, 198,
        ],
        farm: [
            5, 1, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27,
            32, 38, 46, 55, 66, 80, 95, 115, 137, 165,
        ],
        storage: [
            6, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27, 32,
            38, 46, 55, 66, 80, 95, 115, 137, 198,
        ],
        hide: [5, 1, 1, 2, 1, 2, 3, 3, 3, 5],
        wall: [
            8, 2, 2, 2, 3, 3, 4, 5, 5, 7, 9, 9, 12, 15, 17, 20, 25, 29, 36, 43,
        ],
    },
    unitsFarmSpace: {
        spear: 1,
        sword: 1,
        axe: 1,
        archer: 1,
        spy: 2,
        light: 4,
        marcher: 5,
        heavy: 6,
        ram: 5,
        catapult: 8,
        knight: 10,
        snob: 100,
    },
    // https://help.tribalwars.net/wiki/Timber_camp
    // https://help.tribalwars.net/wiki/Clay_pit
    // https://help.tribalwars.net/wiki/Iron_mine
    resPerHour: {
        0: 2,
        1: 30,
        2: 35,
        3: 41,
        4: 47,
        5: 55,
        6: 64,
        7: 74,
        8: 86,
        9: 100,
        10: 117,
        11: 136,
        12: 158,
        13: 184,
        14: 214,
        15: 249,
        16: 289,
        17: 337,
        18: 391,
        19: 455,
        20: 530,
        21: 616,
        22: 717,
        23: 833,
        24: 969,
        25: 1127,
        26: 1311,
        27: 1525,
        28: 1774,
        29: 2063,
        30: 2400,
    },
    watchtowerLevels: [
        1.1, 1.3, 1.5, 1.7, 2, 2.3, 2.6, 3, 3.4, 3.9, 4.4, 5.1, 5.8, 6.7, 7.6,
        8.7, 10, 11.5, 13.1, 15,
    ],

    // internal methods
    _initDebug: function () {
        const scriptInfo = this.scriptInfo();
        console.debug(`${scriptInfo} It works!`);
        console.debug(`${scriptInfo} HELP:`, this.scriptData.helpLink);
        if (this.isDebug) {
            console.debug(`${scriptInfo} Market:`, game_data.market);
            console.debug(`${scriptInfo} World:`, game_data.world);
            console.debug(`${scriptInfo} Screen:`, game_data.screen);
            console.debug(
                `${scriptInfo} Game Version:`,
                game_data.majorVersion
            );
            console.debug(`${scriptInfo} Game Build:`, game_data.version);
            console.debug(`${scriptInfo} Locale:`, game_data.locale);
            console.debug(
                `${scriptInfo} PA:`,
                game_data.features.Premium.active
            );
            console.debug(
                `${scriptInfo} LA:`,
                game_data.features.FarmAssistent.active
            );
            console.debug(
                `${scriptInfo} AM:`,
                game_data.features.AccountManager.active
            );
        }
    },

    // public methods
    addGlobalStyle: function () {
        return `
            /* Table Styling */
            .ra-table-container { overflow-y: auto; overflow-x: hidden; height: auto; max-height: 400px; }
            .ra-table th { font-size: 14px; }
            .ra-table th label { margin: 0; padding: 0; }
            .ra-table th,
            .ra-table td { padding: 5px; text-align: center; }
            .ra-table td a { word-break: break-all; }
            .ra-table a:focus { color: blue; }
            .ra-table a.btn:focus { color: #fff; }
            .ra-table tr:nth-of-type(2n) td { background-color: #f0e2be }
            .ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }

            .ra-table-v2 th,
            .ra-table-v2 td { text-align: left; }

            .ra-table-v3 { border: 2px solid #bd9c5a; }
            .ra-table-v3 th,
            .ra-table-v3 td { border-collapse: separate; border: 1px solid #bd9c5a; text-align: left; }

            /* Inputs */
            .ra-textarea { width: 100%; height: 80px; resize: none; }

            /* Popup */
            .ra-popup-content { width: 360px; }
            .ra-popup-content * { box-sizing: border-box; }
            .ra-popup-content input[type="text"] { padding: 3px; width: 100%; }
            .ra-popup-content .btn-confirm-yes { padding: 3px !important; }
            .ra-popup-content label { display: block; margin-bottom: 5px; font-weight: 600; }
            .ra-popup-content > div { margin-bottom: 15px; }
            .ra-popup-content > div:last-child { margin-bottom: 0 !important; }
            .ra-popup-content textarea { width: 100%; height: 100px; resize: none; }

            /* Elements */
            .ra-details { display: block; margin-bottom: 8px; border: 1px solid #603000; padding: 8px; border-radius: 4px; }
            .ra-details summary { font-weight: 600; cursor: pointer; }
            .ra-details p { margin: 10px 0 0 0; padding: 0; }

            /* Helpers */
            .ra-pa5 { padding: 5px !important; }
            .ra-mt15 { margin-top: 15px !important; }
            .ra-mb10 { margin-bottom: 10px !important; }
            .ra-mb15 { margin-bottom: 15px !important; }
            .ra-tal { text-align: left !important; }
            .ra-tac { text-align: center !important; }
            .ra-tar { text-align: right !important; }

            /* RESPONSIVE */
            @media (max-width: 480px) {
                .ra-fixed-widget {
                    position: relative !important;
                    top: 0;
                    left: 0;
                    display: block;
                    width: auto;
                    height: auto;
                    z-index: 1;
                }

                .ra-box-widget {
                    position: relative;
                    display: block;
                    box-sizing: border-box;
                    width: 97%;
                    height: auto;
                    margin: 10px auto;
                }

                .ra-table {
                    border-collapse: collapse !important;
                }

                .custom-close-button { display: none; }
                .ra-fixed-widget h3 { margin-bottom: 15px; }
                .ra-popup-content { width: 100%; }
            }
        `;
    },
    addScriptToQuickbar: function (name, script, callback) {
        let scriptData = `hotkey=&name=${name}&href=${encodeURI(script)}`;
        let action =
            '/game.php?screen=settings&mode=quickbar_edit&action=quickbar_edit&';

        jQuery.ajax({
            url: action,
            type: 'POST',
            data: scriptData + `&h=${csrf_token}`,
            success: function () {
                if (typeof callback === 'function') {
                    callback();
                }
            },
        });
    },
    arraysIntersection: function () {
        var result = [];
        var lists;

        if (arguments.length === 1) {
            lists = arguments[0];
        } else {
            lists = arguments;
        }

        for (var i = 0; i < lists.length; i++) {
            var currentList = lists[i];
            for (var y = 0; y < currentList.length; y++) {
                var currentValue = currentList[y];
                if (result.indexOf(currentValue) === -1) {
                    var existsInAll = true;
                    for (var x = 0; x < lists.length; x++) {
                        if (lists[x].indexOf(currentValue) === -1) {
                            existsInAll = false;
                            break;
                        }
                    }
                    if (existsInAll) {
                        result.push(currentValue);
                    }
                }
            }
        }
        return result;
    },
    buildUnitsPicker: function (
        selectedUnits = [],
        unitsToIgnore,
        type = 'checkbox'
    ) {
        let unitsTable = ``;

        let thUnits = ``;
        let tableRow = ``;

        game_data.units.forEach((unit) => {
            if (!unitsToIgnore.includes(unit)) {
                let checked = '';
                if (selectedUnits.includes(unit)) {
                    checked = `checked`;
                }

                thUnits += `
                    <th class="ra-tac">
                        <label for="unit_${unit}">
                            <img src="/graphic/unit/unit_${unit}.png">
                        </label>
                    </th>
                `;

                tableRow += `
                    <td class="ra-tac">
                        <input name="ra_chosen_units" type="${type}" ${checked} id="unit_${unit}" class="ra-unit-selector" value="${unit}" />
                    </td>
                `;
            }
        });

        unitsTable = `
            <table class="ra-table ra-table-v2" width="100%" id="raUnitSelector">
                <thead>
                    <tr>
                        ${thUnits}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ${tableRow}
                    </tr>
                </tbody>
            </table>
        `;

        return unitsTable;
    },
    calculateCoinsNeededForNthNoble: function (noble) {
        return (noble * noble + noble) / 2;
    },
    calculateDistanceFromCurrentVillage: function (coord) {
        const x1 = game_data.village.x;
        const y1 = game_data.village.y;
        const [x2, y2] = coord.split('|');
        const deltaX = Math.abs(x1 - x2);
        const deltaY = Math.abs(y1 - y2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },
    calculateDistance: function (from, to) {
        const [x1, y1] = from.split('|');
        const [x2, y2] = to.split('|');
        const deltaX = Math.abs(x1 - x2);
        const deltaY = Math.abs(y1 - y2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },
    calculatePercentages: function (amount, total) {
        if (amount === undefined) amount = 0;
        return parseFloat((amount / total) * 100).toFixed(2);
    },
    calculateTimesByDistance: async function (distance) {
        const _self = this;

        const times = [];
        const travelTimes = [];

        const unitInfo = await _self.getWorldUnitInfo();
        const worldConfig = await _self.getWorldConfig();

        for (let [key, value] of Object.entries(unitInfo.config)) {
            times.push(value.speed);
        }

        const { speed, unit_speed } = worldConfig.config;

        times.forEach((time) => {
            let travelTime = Math.round(
                (distance * time * 60) / speed / unit_speed
            );
            travelTime = _self.secondsToHms(travelTime);
            travelTimes.push(travelTime);
        });

        return travelTimes;
    },
    checkValidLocation: function (type) {
        switch (type) {
            case 'screen':
                return this.allowedScreens.includes(
                    this.getParameterByName('screen')
                );
            case 'mode':
                return this.allowedModes.includes(
                    this.getParameterByName('mode')
                );
            default:
                return false;
        }
    },
    checkValidMarket: function () {
        if (this.market === 'yy') return true;
        return this.allowedMarkets.includes(this.market);
    },
    cleanString: function (string) {
        try {
            return decodeURIComponent(string).replace(/\+/g, ' ');
        } catch (error) {
            console.error(error, string);
            return string;
        }
    },
    copyToClipboard: function (string) {
        navigator.clipboard.writeText(string);
    },
    createUUID: function () {
        return crypto.randomUUID();
    },
    csvToArray: function (strData, strDelimiter = ',') {
        var objPattern = new RegExp(
            '(\\' +
                strDelimiter +
                '|\\r?\\n|\\r|^)' +
                '(?:"([^"]*(?:""[^"]*)*)"|' +
                '([^"\\' +
                strDelimiter +
                '\\r\\n]*))',
            'gi'
        );
        var arrData = [[]];
        var arrMatches = null;
        while ((arrMatches = objPattern.exec(strData))) {
            var strMatchedDelimiter = arrMatches[1];
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ) {
                arrData.push([]);
            }
            var strMatchedValue;

            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(
                    new RegExp('""', 'g'),
                    '"'
                );
            } else {
                strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        return arrData;
    },
    decryptAccountManangerTemplate: function (exportedTemplate) {
        const buildings = [];

        const binaryString = atob(exportedTemplate);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const payloadLength = bytes[0] + bytes[1] * 256;
        if (payloadLength <= bytes.length - 2) {
            const payload = bytes.slice(2, 2 + payloadLength);
            for (let i = 0; i < payload.length; i += 2) {
                const buildingId = payload[i];
                const buildingLevel = payload[i + 1];
                if (this.buildingsList[buildingId]) {
                    buildings.push({
                        id: this.buildingsList[buildingId],
                        upgrade: `+${buildingLevel}`,
                    });
                }
            }

            return buildings;
        }
    },
    filterVillagesByPlayerIds: function (playerIds, villages) {
        const playerVillages = [];
        villages.forEach((village) => {
            if (playerIds.includes(parseInt(village[4]))) {
                const coordinate = village[2] + '|' + village[3];
                playerVillages.push(coordinate);
            }
        });
        return playerVillages;
    },
    formatAsNumber: function (number) {
        return parseInt(number).toLocaleString('de');
    },
    formatDateTime: function (dateTime) {
        dateTime = new Date(dateTime);

        // Derive the server's UTC offset by comparing the game's displayed clock
        // against what UTC thinks the time is right now. This automatically
        // handles DST changes without hardcoding any offset value.
        const serverTimeStr = this.getServerDateTime(); // "yyyy-mm-dd hh:mm:ss"
        // Append 'Z' to force parsing as UTC, preventing the browser from
        // applying its own local timezone offset to the server time string.
        const serverNow = new Date(serverTimeStr + 'Z');
        const utcNow = new Date();
        // Offset in ms = difference between what the server clock shows and true UTC
        const serverOffsetMs = serverNow.getTime() - utcNow.getTime();
        // Round to nearest hour to avoid sub-minute drift from page load lag
        const serverOffsetMsRounded = Math.round(serverOffsetMs / 3600000) * 3600000;

        // Apply the offset to the epoch timestamp so we display server-local time
        const adjusted = new Date(dateTime.getTime() + serverOffsetMsRounded);

        return (
            this.zeroPad(adjusted.getUTCDate(), 2) +
            '/' +
            this.zeroPad(adjusted.getUTCMonth() + 1, 2) +
            '/' +
            adjusted.getUTCFullYear() +
            ' ' +
            this.zeroPad(adjusted.getUTCHours(), 2) +
            ':' +
            this.zeroPad(adjusted.getUTCMinutes(), 2) +
            ':' +
            this.zeroPad(adjusted.getUTCSeconds(), 2)
        );
    },
    frequencyCounter: function (array) {
        return array.reduce(function (acc, curr) {
            if (typeof acc[curr] == 'undefined') {
                acc[curr] = 1;
            } else {
                acc[curr] += 1;
            }
            return acc;
        }, {});
    },
    generateRandomCoordinates: function () {
        const x = Math.floor(Math.random() * 1000);
        const y = Math.floor(Math.random() * 1000);
        return `${x}|${y}`;
    },
    getAll: function (
        urls,
        onLoad,
        onDone,
        onError
    ) {
        var numDone = 0;
        var lastRequestTime = 0;
        var minWaitTime = this.delayBetweenRequests;
        loadNext();
        function loadNext() {
            if (numDone == urls.length) {
                onDone();
                return;
            }

            let now = Date.now();
            let timeElapsed = now - lastRequestTime;
            if (timeElapsed < minWaitTime) {
                let timeRemaining = minWaitTime - timeElapsed;
                setTimeout(loadNext, timeRemaining);
                return;
            }
            lastRequestTime = now;
            jQuery
                .get(urls[numDone])
                .done((data) => {
                    try {
                        onLoad(numDone, data);
                        ++numDone;
                        loadNext();
                    } catch (e) {
                        onError(e);
                    }
                })
                .fail((xhr) => {
                    onError(xhr);
                });
        }
    },
    getBuildingsInfo: async function () {
        const TIME_INTERVAL = 60 * 60 * 1000 * 24 * 365;
        const LAST_UPDATED_TIME =
            localStorage.getItem('buildings_info_last_updated') ?? 0;
        let buildingsInfo = [];

        if (LAST_UPDATED_TIME !== null) {
            if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
                const response = await jQuery.ajax({
                    url: this.buildingInfoInterface,
                });
                buildingsInfo = this.xml2json(jQuery(response));
                localStorage.setItem(
                    'buildings_info',
                    JSON.stringify(buildingsInfo)
                );
                localStorage.setItem(
                    'buildings_info_last_updated',
                    Date.parse(new Date())
                );
            } else {
                buildingsInfo = JSON.parse(
                    localStorage.getItem('buildings_info')
                );
            }
        } else {
            const response = await jQuery.ajax({
                url: this.buildingInfoInterface,
            });
            buildingsInfo = this.xml2json(jQuery(response));
            localStorage.setItem('buildings_info', JSON.stringify(buildingsInfo));
            localStorage.setItem(
                'buildings_info_last_updated',
                Date.parse(new Date())
            );
        }

        return buildingsInfo;
    },
    getContinentByCoord: function (coord) {
        let [x, y] = Array.from(coord.split('|')).map((e) => parseInt(e));
        for (let i = 0; i < 1000; i += 100) {
            for (let j = 0; j < 1000; j += 100) {
                if (i >= x && x < i + 100 && j >= y && y < j + 100) {
                    let nr_continent =
                        parseInt(y / 100) + '' + parseInt(x / 100);
                    return nr_continent;
                }
            }
        }
    },
    getContinentsFromCoordinates: function (coordinates) {
        let continents = [];

        coordinates.forEach((coord) => {
            const continent = twSDK.getContinentByCoord(coord);
            continents.push(continent);
        });

        return [...new Set(continents)];
    },
    getCoordFromString: function (string) {
        if (!string) return [];
        return string.match(this.coordsRegex)[0];
    },
    getContinentSectorField: function (coordinate) {
        const continent = this.getContinentByCoord(coordinate);
        let [coordX, coordY] = coordinate.split('|');

        let tempX = Number(coordX);
        let tempY = Number(coordY);

        if (tempX >= 100) tempX = Number(String(coordX).substring(1));
        if (tempY >= 100) tempY = Number(String(coordY).substring(1));

        let xPos = Math.floor(tempX / 5);
        let yPos = Math.floor(tempY / 5);
        let sector = yPos * 20 + xPos;

        if (tempX >= 10) tempX = Number(String(tempX).substring(1));
        if (tempY >= 10) tempY = Number(String(tempY).substring(1));

        if (tempX >= 5) tempX = tempX - 5;
        if (tempY >= 5) tempY = tempY - 5;
        let field = tempY * 5 + tempX;

        let name = continent + ':' + sector + ':' + field;

        return name;
    },
    getGameFeatures: function () {
        const { Premium, FarmAssistent, AccountManager } = game_data.features;
        const isPA = Premium.active;
        const isLA = FarmAssistent.active;
        const isAM = AccountManager.active;
        return { isPA, isLA, isAM };
    },
    getKeyByValue: function (object, value) {
        return Object.keys(object).find((key) => object[key] === value);
    },
    getLandingTimeFromArrivesIn: function (arrivesIn) {
        const currentServerTime = twSDK.getServerDateTimeObject();
        const [hours, minutes, seconds] = arrivesIn.split(':');
        const totalSeconds = +hours * 3600 + +minutes * 60 + +seconds;
        const arrivalDateTime = new Date(
            currentServerTime.getTime() + totalSeconds * 1000
        );
        return arrivalDateTime;
    },
    getLastCoordFromString: function (string) {
        if (!string) return [];
        const regex = this.coordsRegex;
        let match;
        let lastMatch;
        while ((match = regex.exec(string)) !== null) {
            lastMatch = match;
        }
        return lastMatch ? lastMatch[0] : [];
    },
    getPagesToFetch: function () {
        let list_pages = [];

        const currentPage = twSDK.getParameterByName('page');
        if (currentPage == '-1') return [];

        if (
            document
                .getElementsByClassName('vis')[1]
                .getElementsByTagName('select').length > 0
        ) {
            Array.from(
                document
                    .getElementsByClassName('vis')[1]
                    .getElementsByTagName('select')[0]
            ).forEach(function (item) {
                list_pages.push(item.value);
            });
            list_pages.pop();
        } else if (
            document.getElementsByClassName('paged-nav-item').length > 0
        ) {
            let nr = 0;
            Array.from(
                document.getElementsByClassName('paged-nav-item')
            ).forEach(function (item) {
                let current = item.href;
                current = current.split('page=')[0] + 'page=' + nr;
                nr++;
                list_pages.push(current);
            });
        } else {
            let current_link = window.location.href;
            list_pages.push(current_link);
        }
        list_pages.shift();

        return list_pages;
    },
    getParameterByName: function (name, url = window.location.href) {
        return new URL(url).searchParams.get(name);
    },
    getRelativeImagePath: function (url) {
        const urlParts = url.split('/');
        return `/${urlParts[5]}/${urlParts[6]}/${urlParts[7]}`;
    },
    getServerDateTimeObject: function () {
        const formattedTime = this.getServerDateTime();
        return new Date(formattedTime);
    },
    getServerDateTime: function () {
        const serverTime = jQuery('#serverTime').text();
        const serverDate = jQuery('#serverDate').text();
        const [day, month, year] = serverDate.split('/');
        const serverTimeFormatted =
            year + '-' + month + '-' + day + ' ' + serverTime;
        return serverTimeFormatted;
    },
    getTimeFromString: function (timeLand) {
        let dateLand = '';
        let serverDate = document
            .getElementById('serverDate')
            .innerText.split('/');

        let TIME_PATTERNS = {
            today: 'today at %s',
            tomorrow: 'tomorrow at %s',
            later: 'on %1 at %2',
        };

        if (window.lang) {
            TIME_PATTERNS = {
                today: window.lang['aea2b0aa9ae1534226518faaefffdaad'],
                tomorrow: window.lang['57d28d1b211fddbb7a499ead5bf23079'],
                later: window.lang['0cb274c906d622fa8ce524bcfbb7552d'],
            };
        }

        let todayPattern = new RegExp(
            TIME_PATTERNS.today.replace('%s', '([\\d+|:]+)')
        ).exec(timeLand);
        let tomorrowPattern = new RegExp(
            TIME_PATTERNS.tomorrow.replace('%s', '([\\d+|:]+)')
        ).exec(timeLand);
        let laterDatePattern = new RegExp(
            TIME_PATTERNS.later
                .replace('%1', '([\\d+|\\.]+)')
                .replace('%2', '([\\d+|:]+)')
        ).exec(timeLand);

        if (todayPattern !== null) {
            dateLand =
                serverDate[0] +
                '/' +
                serverDate[1] +
                '/' +
                serverDate[2] +
                ' ' +
                timeLand.match(/\d+:\d+:\d+:\d+/)[0];
        } else if (tomorrowPattern !== null) {
            let tomorrowDate = new Date(
                serverDate[1] + '/' + serverDate[0] + '/' + serverDate[2]
            );
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            dateLand =
                ('0' + tomorrowDate.getDate()).slice(-2) +
                '/' +
                ('0' + (tomorrowDate.getMonth() + 1)).slice(-2) +
                '/' +
                tomorrowDate.getFullYear() +
                ' ' +
                timeLand.match(/\d+:\d+:\d+:\d+/)[0];
        } else {
            let on = timeLand.match(/\d+.\d+/)[0].split('.');
            dateLand =
                on[0] +
                '/' +
                on[1] +
                '/' +
                serverDate[2] +
                ' ' +
                timeLand.match(/\d+:\d+:\d+:\d+/)[0];
        }

        return dateLand;
    },
    getTravelTimeInSecond: function (distance, unitSpeed) {
        let travelTime = distance * unitSpeed * 60;
        if (travelTime % 1 > 0.5) {
            return (travelTime += 1);
        } else {
            return travelTime;
        }
    },
    getTribeMembersById: function (tribeIds, players) {
        const tribeMemberIds = [];
        players.forEach((player) => {
            if (tribeIds.includes(parseInt(player[2]))) {
                tribeMemberIds.push(parseInt(player[0]));
            }
        });
        return tribeMemberIds;
    },
    getTroop: function (unit) {
        return parseInt(
            document.units[unit].parentNode
                .getElementsByTagName('a')[1]
                .innerHTML.match(/\d+/),
            10
        );
    },
    getVillageBuildings: function () {
        const buildings = game_data.village.buildings;
        const villageBuildings = [];

        for (let [key, value] of Object.entries(buildings)) {
            if (value > 0) {
                villageBuildings.push({
                    building: key,
                    level: value,
                });
            }
        }

        return villageBuildings;
    },
    getWorldConfig: async function () {
        const TIME_INTERVAL = 60 * 60 * 1000 * 24 * 7;
        const LAST_UPDATED_TIME =
            localStorage.getItem('world_config_last_updated') ?? 0;
        let worldConfig = [];

        if (LAST_UPDATED_TIME !== null) {
            if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
                const response = await jQuery.ajax({
                    url: this.worldInfoInterface,
                });
                worldConfig = this.xml2json(jQuery(response));
                localStorage.setItem(
                    'world_config',
                    JSON.stringify(worldConfig)
                );
                localStorage.setItem(
                    'world_config_last_updated',
                    Date.parse(new Date())
                );
            } else {
                worldConfig = JSON.parse(localStorage.getItem('world_config'));
            }
        } else {
            const response = await jQuery.ajax({
                url: this.worldInfoInterface,
            });
            worldConfig = this.xml2json(jQuery(response));
            localStorage.setItem('world_config', JSON.stringify(worldConfig));
            localStorage.setItem(
                'world_config_last_updated',
                Date.parse(new Date())
            );
        }

        return worldConfig;
    },
    getWorldUnitInfo: async function () {
        const TIME_INTERVAL = 60 * 60 * 1000 * 24 * 7;
        const LAST_UPDATED_TIME =
            localStorage.getItem('units_info_last_updated') ?? 0;
        let unitInfo = [];

        if (LAST_UPDATED_TIME !== null) {
            if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
                const response = await jQuery.ajax({
                    url: this.unitInfoInterface,
                });
                unitInfo = this.xml2json(jQuery(response));
                localStorage.setItem('units_info', JSON.stringify(unitInfo));
                localStorage.setItem(
                    'units_info_last_updated',
                    Date.parse(new Date())
                );
            } else {
                unitInfo = JSON.parse(localStorage.getItem('units_info'));
            }
        } else {
            const response = await jQuery.ajax({
                url: this.unitInfoInterface,
            });
            unitInfo = this.xml2json(jQuery(response));
            localStorage.setItem('units_info', JSON.stringify(unitInfo));
            localStorage.setItem(
                'units_info_last_updated',
                Date.parse(new Date())
            );
        }

        return unitInfo;
    },
    groupArrayByProperty: function (array, property, filter) {
        return array.reduce(function (accumulator, object) {
            const key = object[property];
            if (!accumulator[key]) {
                accumulator[key] = [];
            }
            accumulator[key].push(object[filter]);
            return accumulator;
        }, {});
    },
    isArcherWorld: function () {
        return this.units.includes('archer');
    },
    isChurchWorld: function () {
        return 'church' in this.village.buildings;
    },
    isPaladinWorld: function () {
        return this.units.includes('knight');
    },
    isWatchTowerWorld: function () {
        return 'watchtower' in this.village.buildings;
    },
    loadJS: function (url, callback) {
        let scriptTag = document.createElement('script');
        scriptTag.src = url;
        scriptTag.onload = callback;
        scriptTag.onreadystatechange = callback;
        document.body.appendChild(scriptTag);
    },
    redirectTo: function (location) {
        window.location.assign(game_data.link_base_pure + location);
    },
    removeDuplicateObjectsFromArray: function (array, prop) {
        return array.filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    },
    renderBoxWidget: function (body, id, mainClass, customStyle) {
        const globalStyle = this.addGlobalStyle();

        const content = `
            <div class="${mainClass} ra-box-widget" id="${id}">
                <div class="${mainClass}-header">
                    <h3>${this.tt(this.scriptData.name)}</h3>
                </div>
                <div class="${mainClass}-body">
                    ${body}
                </div>
                <div class="${mainClass}-footer">
                    <small>
                        <strong>
                            ${this.tt(this.scriptData.name)} ${
            this.scriptData.version
        }
                        </strong> -
                        <a href="${
                            this.scriptData.authorUrl
                        }" target="_blank" rel="noreferrer noopener">
                            ${this.scriptData.author}
                        </a> -
                        <a href="${
                            this.scriptData.helpLink
                        }" target="_blank" rel="noreferrer noopener">
                            ${this.tt('Help')}
                        </a>
                    </small>
                </div>
            </div>
            <style>
                .${mainClass} { position: relative; display: block; width: 100%; height: auto; clear: both; margin: 10px 0 15px; border: 1px solid #603000; box-sizing: border-box; background: #f4e4bc; }
                .${mainClass} * { box-sizing: border-box; }
                .${mainClass} > div { padding: 10px; }
                .${mainClass} .btn-confirm-yes { padding: 3px; }
                .${mainClass}-header { display: flex; align-items: center; justify-content: space-between; background-color: #c1a264 !important; background-image: url(/graphic/screen/tableheader_bg3.png); background-repeat: repeat-x; }
                .${mainClass}-header h3 { margin: 0; padding: 0; line-height: 1; }
                .${mainClass}-body p { font-size: 14px; }
                .${mainClass}-body label { display: block; font-weight: 600; margin-bottom: 6px; }
                
                ${globalStyle}

                /* Custom Style */
                ${customStyle}
            </style>
        `;

        if (jQuery(`#${id}`).length < 1) {
            jQuery('#contentContainer').prepend(content);
            jQuery('#mobileContent').prepend(content);
        } else {
            jQuery(`.${mainClass}-body`).html(body);
        }
    },
    renderFixedWidget: function (
        body,
        id,
        mainClass,
        customStyle,
        width,
        customName = this.scriptData.name
    ) {
        const globalStyle = this.addGlobalStyle();

        const content = `
            <div class="${mainClass} ra-fixed-widget" id="${id}">
                <div class="${mainClass}-header">
                    <h3>${this.tt(customName)}</h3>
                </div>
                <div class="${mainClass}-body">
                    ${body}
                </div>
                <div class="${mainClass}-footer">
                    <small>
                        <strong>
                            ${this.tt(customName)} ${this.scriptData.version}
                        </strong> -
                        <a href="${
                            this.scriptData.authorUrl
                        }" target="_blank" rel="noreferrer noopener">
                            ${this.scriptData.author}
                        </a> -
                        <a href="${
                            this.scriptData.helpLink
                        }" target="_blank" rel="noreferrer noopener">
                            ${this.tt('Help')}
                        </a>
                    </small>
                </div>
                <a class="popup_box_close custom-close-button" href="#">&nbsp;</a>
            </div>
            <style>
                .${mainClass} { position: fixed; top: 10vw; right: 10vw; z-index: 99999; border: 2px solid #7d510f; border-radius: 10px; padding: 10px; width: ${
            width ?? '360px'
        }; overflow-y: auto; padding: 10px; background: #e3d5b3 url('/graphic/index/main_bg.jpg') scroll right top repeat; }
                .${mainClass} * { box-sizing: border-box; }

                ${globalStyle}

                /* Custom Style */
                .custom-close-button { right: 0; top: 0; }
                ${customStyle}
            </style>
        `;

        if (jQuery(`#${id}`).length < 1) {
            if (mobiledevice) {
                jQuery('#content_value').prepend(content);
            } else {
                jQuery('#contentContainer').prepend(content);
                jQuery(`#${id}`).draggable({
                    cancel: '.ra-table, input, textarea, button, select, option',
                });

                jQuery(`#${id} .custom-close-button`).on('click', function (e) {
                    e.preventDefault();
                    jQuery(`#${id}`).remove();
                });
            }
        } else {
            jQuery(`.${mainClass}-body`).html(body);
        }
    },
    scriptInfo: function (scriptData = this.scriptData) {
        return `[${scriptData.name} ${scriptData.version}]`;
    },
    secondsToHms: function (timestamp) {
        const hours = Math.floor(timestamp / 60 / 60);
        const minutes = Math.floor(timestamp / 60) - hours * 60;
        const seconds = timestamp % 60;
        return (
            hours.toString().padStart(2, '0') +
            ':' +
            minutes.toString().padStart(2, '0') +
            ':' +
            seconds.toString().padStart(2, '0')
        );
    },
    setUpdateProgress: function (elementToUpdate, valueToSet) {
        jQuery(elementToUpdate).text(valueToSet);
    },
    sortArrayOfObjectsByKey: function (array, key) {
        return array.sort((a, b) => b[key] - a[key]);
    },
    startProgressBar: function (total) {
        const width = jQuery('#content_value')[0].clientWidth;
        const preloaderContent = `
            <div id="progressbar" class="progress-bar" style="margin-bottom:12px;">
                <span class="count label">0/${total}</span>
                <div id="progress">
                    <span class="count label" style="width: ${width}px;">
                        0/${total}
                    </span>
                </div>
            </div>
        `;

        if (this.isMobile) {
            jQuery('#content_value').eq(0).prepend(preloaderContent);
        } else {
            jQuery('#contentContainer').eq(0).prepend(preloaderContent);
        }
    },
    sumOfArrayItemValues: function (array) {
        return array.reduce((a, b) => a + b, 0);
    },
    randomItemPickerString: function (items, splitter = ' ') {
        const itemsArray = items.split(splitter);
        const chosenIndex = Math.floor(Math.random() * itemsArray.length);
        return itemsArray[chosenIndex];
    },
    randomItemPickerArray: function (items) {
        const chosenIndex = Math.floor(Math.random() * items.length);
        return items[chosenIndex];
    },
    timeAgo: function (seconds) {
        var interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' Y';

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' M';

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' D';

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' H';

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' m';

        return Math.floor(seconds) + ' s';
    },
    tt: function (string) {
        if (this.translations[game_data.locale] !== undefined) {
            return this.translations[game_data.locale][string];
        } else {
            return this.translations['en_DK'][string];
        }
    },
    toggleUploadButtonStatus: function (elementToToggle) {
        jQuery(elementToToggle).attr('disabled', (i, v) => !v);
    },
    updateProgress: function (elementToUpate, itemsLength, index) {
        jQuery(elementToUpate).text(`${index}/${itemsLength}`);
    },
    updateProgressBar: function (index, total) {
        jQuery('#progress').css('width', `${((index + 1) / total) * 100}%`);
        jQuery('.count').text(`${index + 1}/${total}`);
        if (index + 1 == total) {
            jQuery('#progressbar').fadeOut(1000);
        }
    },
    xml2json: function ($xml) {
        let data = {};
        const _self = this;
        $.each($xml.children(), function (i) {
            let $this = $(this);
            if ($this.children().length > 0) {
                data[$this.prop('tagName')] = _self.xml2json($this);
            } else {
                data[$this.prop('tagName')] = $.trim($this.text());
            }
        });
        return data;
    },
    worldDataAPI: async function (entity) {
        const TIME_INTERVAL = 60 * 60 * 1000;
        const LAST_UPDATED_TIME = localStorage.getItem(
            `${entity}_last_updated`
        );

        const allowedEntities = ['village', 'player', 'ally', 'conquer'];
        if (!allowedEntities.includes(entity)) {
            throw new Error(`Entity ${entity} does not exist!`);
        }

        const worldData = {};

        const dbConfig = {
            village: {
                dbName: 'villagesDb',
                dbTable: 'villages',
                key: 'villageId',
                url: twSDK.worldDataVillages,
            },
            player: {
                dbName: 'playersDb',
                dbTable: 'players',
                key: 'playerId',
                url: twSDK.worldDataPlayers,
            },
            ally: {
                dbName: 'tribesDb',
                dbTable: 'tribes',
                key: 'tribeId',
                url: twSDK.worldDataTribes,
            },
            conquer: {
                dbName: 'conquerDb',
                dbTable: 'conquer',
                key: '',
                url: twSDK.worldDataConquests,
            },
        };

        const fetchDataAndSave = async () => {
            const DATA_URL = dbConfig[entity].url;

            try {
                const response = await jQuery.ajax(DATA_URL);
                const data = twSDK.csvToArray(response);
                let responseData = [];

                switch (entity) {
                    case 'village':
                        responseData = data
                            .filter((item) => { if (item[0] != '') { return item; } })
                            .map((item) => {
                                return {
                                    villageId: parseInt(item[0]),
                                    villageName: twSDK.cleanString(item[1]),
                                    villageX: item[2],
                                    villageY: item[3],
                                    playerId: parseInt(item[4]),
                                    villagePoints: parseInt(item[5]),
                                    villageType: parseInt(item[6]),
                                };
                            });
                        break;
                    case 'player':
                        responseData = data
                            .filter((item) => { if (item[0] != '') { return item; } })
                            .map((item) => {
                                return {
                                    playerId: parseInt(item[0]),
                                    playerName: twSDK.cleanString(item[1]),
                                    tribeId: parseInt(item[2]),
                                    villages: parseInt(item[3]),
                                    points: parseInt(item[4]),
                                    rank: parseInt(item[5]),
                                };
                            });
                        break;
                    case 'ally':
                        responseData = data
                            .filter((item) => { if (item[0] != '') { return item; } })
                            .map((item) => {
                                return {
                                    tribeId: parseInt(item[0]),
                                    tribeName: twSDK.cleanString(item[1]),
                                    tribeTag: twSDK.cleanString(item[2]),
                                    players: parseInt(item[3]),
                                    villages: parseInt(item[4]),
                                    points: parseInt(item[5]),
                                    allPoints: parseInt(item[6]),
                                    rank: parseInt(item[7]),
                                };
                            });
                        break;
                    case 'conquer':
                        responseData = data
                            .filter((item) => { if (item[0] != '') { return item; } })
                            .map((item) => {
                                return {
                                    villageId: parseInt(item[0]),
                                    unixTimestamp: parseInt(item[1]),
                                    newPlayerId: parseInt(item[2]),
                                    oldPlayerId: parseInt(item[3]),
                                    oldTribeId: parseInt(item[4]),
                                    newTribeId: parseInt(item[5]),
                                    villagePoints: parseInt(item[6]),
                                };
                            });
                        break;
                    default:
                        return [];
                }

                saveToIndexedDbStorage(
                    dbConfig[entity].dbName,
                    dbConfig[entity].dbTable,
                    dbConfig[entity].key,
                    responseData
                );

                localStorage.setItem(
                    `${entity}_last_updated`,
                    Date.parse(new Date())
                );

                return responseData;
            } catch (error) {
                throw Error(`Error fetching ${DATA_URL}`);
            }
        };

        async function saveToIndexedDbStorage(dbName, table, keyId, data) {
            const dbConnect = indexedDB.open(dbName);

            dbConnect.onupgradeneeded = function () {
                const db = dbConnect.result;
                if (keyId.length) {
                    db.createObjectStore(table, { keyPath: keyId });
                } else {
                    db.createObjectStore(table, { autoIncrement: true });
                }
            };

            dbConnect.onsuccess = function () {
                const db = dbConnect.result;
                const transaction = db.transaction(table, 'readwrite');
                const store = transaction.objectStore(table);
                store.clear();
                data.forEach((item) => { store.put(item); });
                UI.SuccessMessage('Database updated!');
            };
        }

        function getAllData(dbName, table) {
            return new Promise((resolve, reject) => {
                const dbConnect = indexedDB.open(dbName);
                dbConnect.onsuccess = () => {
                    const db = dbConnect.result;
                    const dbQuery = db.transaction(table, 'readwrite').objectStore(table).getAll();
                    dbQuery.onsuccess = (event) => { resolve(event.target.result); };
                    dbQuery.onerror = (event) => { reject(event.target.error); };
                };
                dbConnect.onerror = (event) => { reject(event.target.error); };
            });
        }

        function objectToArray(arrayOfObjects, entity) {
            switch (entity) {
                case 'village':
                    return arrayOfObjects.map((item) => [item.villageId, item.villageName, item.villageX, item.villageY, item.playerId, item.villagePoints, item.villageType]);
                case 'player':
                    return arrayOfObjects.map((item) => [item.playerId, item.playerName, item.tribeId, item.villages, item.points, item.rank]);
                case 'ally':
                    return arrayOfObjects.map((item) => [item.tribeId, item.tribeName, item.tribeTag, item.players, item.villages, item.points, item.allPoints, item.rank]);
                case 'conquer':
                    return arrayOfObjects.map((item) => [item.villageId, item.unixTimestamp, item.newPlayerId, item.oldPlayerId, item.oldTribeId, item.newTribeId, item.villagePoints]);
                default:
                    return [];
            }
        }

        if (LAST_UPDATED_TIME !== null) {
            if (Date.parse(new Date()) >= parseInt(LAST_UPDATED_TIME) + TIME_INTERVAL) {
                worldData[entity] = await fetchDataAndSave();
            } else {
                worldData[entity] = await getAllData(dbConfig[entity].dbName, dbConfig[entity].dbTable);
            }
        } else {
            worldData[entity] = await fetchDataAndSave();
        }

        worldData[entity] = objectToArray(worldData[entity], entity);
        return worldData[entity];
    },
    zeroPad: function (num, count) {
        var numZeropad = num + '';
        while (numZeropad.length < count) {
            numZeropad = '0' + numZeropad;
        }
        return numZeropad;
    },

    init: async function (scriptConfig) {
        const {
            scriptData,
            translations,
            allowedMarkets,
            allowedScreens,
            allowedModes,
            isDebug,
            enableCountApi,
        } = scriptConfig;

        this.scriptData = scriptData;
        this.translations = translations;
        this.allowedMarkets = allowedMarkets;
        this.allowedScreens = allowedScreens;
        this.allowedModes = allowedModes;
        this.enableCountApi = enableCountApi;
        this.isDebug = isDebug;

        twSDK._initDebug();
    },
};

(async function () {
    // Initialize Library
    await twSDK.init(scriptConfig);
    const scriptInfo = twSDK.scriptInfo();
    const isValidScreen = twSDK.checkValidLocation('screen');

    // Entry point
    if (isValidScreen) {
        try {
            initGetIncsForPlayer();
        } catch (error) {
            UI.ErrorMessage(twSDK.tt('There was an error!'));
            console.error(`${scriptInfo} Error:`, error);
        }
    } else {
        UI.ErrorMessage(
            twSDK.tt('Script must be executed from Player Info screen!')
        );
    }

    function initGetIncsForPlayer() {
        if (jQuery('#villages_list tr:last a').attr('href') === '#') {
            jQuery('#villages_list tr:last a').trigger('click');
        }

        setTimeout(() => {
            let villagesLinks = [];
            const links = jQuery('#villages_list td a').not('.ctx');

            links.each(function () {
                const hasIncsOrNot = jQuery(this)
                    .parent().parent().parent().parent().parent().parent().parent()
                    .find('> td:eq(1)')
                    .find('span.command-attack-ally, span.command-attack');

                if (hasIncsOrNot.length) {
                    const villageLink = jQuery(this).attr('href');
                    villagesLinks.push(villageLink);
                }
            });

            if (villagesLinks.length) {
                twSDK.startProgressBar(villagesLinks.length);
                UI.SuccessMessage(twSDK.tt('Fetching incomings for each village...'));

                const villageIncs = [];

                twSDK.getAll(
                    villagesLinks,
                    function (index, data) {
                        twSDK.updateProgressBar(index, villagesLinks.length);

                        const htmlDoc = jQuery.parseHTML(data);
                        const commandsOutgoingVillageId = parseInt(
                            jQuery(htmlDoc).find('#commands_outgoings').attr('data-village')
                        );

                        const villageName = jQuery(htmlDoc)
                            .find('#content_value h2').text().trim();

                        // Extract coords by scanning the page text for the first ###|### pattern.
                        // This is robust against layout changes that break nth-child selectors.
                        // We look inside #content_value first; if not found, fall back to full doc.
                        const coordCandidateEl = jQuery(htmlDoc).find('#content_value');
                        const coordCandidateText = coordCandidateEl.length
                            ? coordCandidateEl.text()
                            : jQuery(htmlDoc).text();
                        const coordMatch = coordCandidateText.match(/\d{1,3}\|\d{1,3}/);
                        const villageCoords = coordMatch ? coordMatch[0] : '';

                        // ── MODIFICATION: collect each large/medium command individually
                        //    with its own landing time, attacker name, and size label ──
                        const relevantCommands = [];

                        const commandsEl = jQuery(htmlDoc).find('#commands_outgoings tr.command-row');
                        commandsEl.each(function () {
                            const commandImg = jQuery(this)
                                ?.find('img:eq(0)')?.attr('src')
                                ?.split('/')?.pop()
                                ?.split('#')[0]?.split('?')[0];

                            // Only keep large and medium attacks
                            const isLarge  = commandImg === 'attack_large.webp';
                            const isMedium = commandImg === 'attack_medium.webp';
                            if (!isLarge && !isMedium) return;

                            const attackType = isLarge ? 'large' : 'medium';

                            let attackingPlayer = jQuery(this)
                                .find('.quickedit-label').text().trim();
                            attackingPlayer = attackingPlayer.split(':')[0];

                            // Landing time: the game renders it in .timer or
                            // .arrives_in / data-endtime attributes depending on version.
                            // We try the most common selectors in order of preference.
                            let landingTime = '';

                            // 1. data-endtime (epoch ms) — most reliable when present
                            const endTimeAttr = jQuery(this).find('[data-endtime]').attr('data-endtime');
                            if (endTimeAttr) {
                                const dt = new Date(parseInt(endTimeAttr) * 1000);
                                landingTime = twSDK.formatDateTime(dt);
                            }

                            // 2. Fall back to the visible text of .timer / .arrival_time
                            if (!landingTime) {
                                const timerText = jQuery(this)
                                    .find('.timer, .arrival_time, td:last-child')
                                    .first().text().trim();
                                if (timerText) {
                                    try {
                                        landingTime = twSDK.getTimeFromString(timerText);
                                    } catch (e) {
                                        landingTime = timerText; // store raw if parse fails
                                    }
                                }
                            }

                            relevantCommands.push({
                                attackType,
                                attackingPlayer,
                                landingTime,
                            });
                        });

                        // Only push the village if it has at least one large/medium attack
                        if (relevantCommands.length > 0) {
                            villageIncs.push({
                                villageId: commandsOutgoingVillageId,
                                villageName,
                                villageCoords,
                                commands: relevantCommands,
                            });

                            // Annotate the player-profile village list as before
                            const largeCount  = relevantCommands.filter(c => c.attackType === 'large').length;
                            const mediumCount = relevantCommands.filter(c => c.attackType === 'medium').length;

                            const placeToBeAdded = jQuery(
                                `#villages_list tr span.village_anchor[data-id="${commandsOutgoingVillageId}"]`
                            ).parent().parent().parent().parent().parent().parent().find('> td:eq(1)');

                            let annotation = `<span>(${relevantCommands.length})</span>`;
                            if (largeCount)  annotation += ` <span><img src="/graphic/command/attack_large.webp" style="transform:translateY(2px);"> ${largeCount}</span>`;
                            if (mediumCount) annotation += ` <span><img src="/graphic/command/attack_medium.webp" style="transform:translateY(2px);"> ${mediumCount}</span>`;
                            jQuery(placeToBeAdded).append(annotation);
                        }
                    },
                    function () {
                        // ── onDone ──
                        if (villageIncs.length === 0) {
                            UI.InfoMessage(twSDK.tt('Could not find villages being attacked!'));
                            return;
                        }

                        const playerName = jQuery('#content_value h2').text().trim();

                        // Summary counts
                        let totalLarge = 0, totalMedium = 0;
                        villageIncs.forEach(v => {
                            v.commands.forEach(c => {
                                if (c.attackType === 'large')  totalLarge++;
                                if (c.attackType === 'medium') totalMedium++;
                            });
                        });

                        const summaryTable = `
                            <table class="ra-table ra-table-v3" width="100%">
                                <tbody>
                                    <tr><td><b>${twSDK.tt('Player:')}</b></td><td><b>${playerName}</b></td></tr>
                                    <tr><td><b>${twSDK.tt('Total Villages:')}</b></td><td><b>${villageIncs.length}</b></td></tr>
                                    <tr><td><b>${twSDK.tt('Total Large Attacks:')}</b></td><td><b>${twSDK.formatAsNumber(totalLarge)}</b></td></tr>
                                    <tr><td><b>${twSDK.tt('Total Medium Attacks:')}</b></td><td><b>${twSDK.formatAsNumber(totalMedium)}</b></td></tr>
                                </tbody>
                            </table>`;

                        const detailTable = buildVillageIncomingsTable(villageIncs);

                        const content = `
                            ${summaryTable}
                            <div class="ra-table-container ra-mt15 ra-mb15">
                                ${detailTable}
                            </div>
                            <button class="btn btn-confirm-yes ra-mb10" id="raCopyExport" style="width:100%;">
                                ${twSDK.tt('Copy Export')}
                            </button>`;

                        twSDK.renderFixedWidget(
                            content,
                            scriptConfig.scriptData.prefix,
                            'ra-get-incomings-player',
                            null,
                            '560px'
                        );

                        addIncommingTableSorting();

                        // Copy-to-clipboard: one line per command, tab-separated
                        // Format: Coords | Type | Attacker | Landing Time  (no village name)
                        jQuery('#raCopyExport').on('click', function () {
                            const lines = [];
                            lines.push(['Coords', 'Type', 'Attacker', 'Landing Time'].join('\t'));
                            villageIncs.forEach(v => {
                                v.commands.forEach(c => {
                                    lines.push([
                                        v.villageCoords,
                                        c.attackType,
                                        c.attackingPlayer,
                                        c.landingTime,
                                    ].join('\t'));
                                });
                            });
                            twSDK.copyToClipboard(lines.join('\n'));
                            jQuery(this).text(twSDK.tt('Copied!'));
                            setTimeout(() => jQuery(this).text(twSDK.tt('Copy Export')), 2000);
                        });
                    },
                    function (error) {
                        UI.ErrorMessage(twSDK.tt('Error fetching village incomings!'));
                        console.error(`${scriptInfo} Error:`, error);
                    }
                );
            } else {
                UI.InfoMessage(twSDK.tt('Could not find villages being attacked!'));
            }
        }, 2000);
    }

    function addIncommingTableSorting() {
        jQuery.fn.sortElements = (function () {
            var t = [].sort;
            return function (e, n) {
                n = n || function () { return this; };
                var r = this.map(function () {
                    var t = n.call(this),
                        e = t.parentNode,
                        r = e.insertBefore(document.createTextNode(''), t.nextSibling);
                    return function () {
                        if (e === this) throw Error(twSDK.tt("You can't sort elements if any one is a descendant of another."));
                        e.insertBefore(this, r);
                        e.removeChild(r);
                    };
                });
                return t.call(this, e).each(function (t) { r[t].call(n.call(this)); });
            };
        })();

        var table = $('.ra-table');
        $('.ra-table th').wrapInner(`<span title="${twSDK.tt('sort this column')}"/>`).each(function () {
            var t = $(this), e = t.index(), n = false;
            t.click(function () {
                table.find('td').filter(function () {
                    return $(this).index() === e;
                }).sortElements(function (t, e) {
                    let r, i;
                    isNaN(parseInt($.text([t]).trim()))
                        ? ((r = $.text([t])), (i = $.text([e])))
                        : ((r = parseInt($.text([t]).trim())), (i = parseInt($.text([e]).trim())));
                    return r > i ? (n ? -1 : 1) : n ? 1 : -1;
                }, function () { return this.parentNode; });
                n = !n;
            });
        });
    }

    // ── MODIFIED: one row per individual command, sorted by landing time ──
    function buildVillageIncomingsTable(villages) {
        if (villages.length === 0) return '';

        // Flatten all commands into a single list so we can sort by landing time
        const allCommands = [];
        villages.forEach(v => {
            v.commands.forEach(c => {
                allCommands.push({
                    villageId:   v.villageId,
                    villageName: v.villageName,
                    villageCoords: v.villageCoords,
                    attackType:  c.attackType,
                    attackingPlayer: c.attackingPlayer,
                    landingTime: c.landingTime,
                });
            });
        });

        // Sort ascending by landing time string (ISO-ish dd/mm/yyyy hh:mm:ss sorts lexically)
        allCommands.sort((a, b) => {
            if (!a.landingTime) return 1;
            if (!b.landingTime) return -1;
            return a.landingTime < b.landingTime ? -1 : a.landingTime > b.landingTime ? 1 : 0;
        });

        let tableRows = '';
        allCommands.forEach(cmd => {
            const typeImg = cmd.attackType === 'large'
                ? `<img src="/graphic/command/attack_large.webp" title="Large">`
                : `<img src="/graphic/command/attack_medium.webp" title="Medium">`;

            tableRows += `
                <tr>
                    <td>
                        <a href="/game.php?screen=info_village&id=${cmd.villageId}" target="_blank" rel="noopener noreferrer">
                            ${cmd.villageCoords || '—'}
                        </a>
                    </td>
                    <td class="ra-tac">${typeImg}</td>
                    <td>${cmd.attackingPlayer}</td>
                    <td>${cmd.landingTime || '—'}</td>
                </tr>`;
        });

        return `
            <table class="ra-table ra-table-v3" width="100%">
                <thead>
                    <tr>
                        <th>${twSDK.tt('Coords')}</th>
                        <th>${twSDK.tt('Type')}</th>
                        <th>${twSDK.tt('Players')}</th>
                        <th>${twSDK.tt('Landing Time')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>`;
    }

})();
