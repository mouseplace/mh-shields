// ==UserScript==
// @name         🐭️ Mousehunt - Shields
// @version      1.3.0
// @description  Change your MouseHunt shield to an event shield, like the Halloween shield.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/gh/mouseplace/mousehunt-utils/mousehunt-utils.js
// ==/UserScript==

((function () {
	'use strict';

	const changeShield = () => {
		const classesToUse = [];

		shieldChoices.forEach((shield) => {
			const setting = getSetting(`${ shield }-shield`);
			if (setting) {
				classesToUse.push(shield);
			}
		});

		const shieldEl = document.querySelector('.mousehuntHud-shield');
		if (! shieldEl) {
			return;
		}

		// Remove all shield classes.
		shieldEl.classList.remove(...shieldChoices);

		if (classesToUse.length > 1) {
			// If there are multiple shields, use a random one.
			const randomShield = classesToUse[ Math.floor(Math.random() * classesToUse.length) ];
			shieldEl.classList.add(randomShield);
		} else if (classesToUse.length === 1) {
			// If there is only one shield, use that one.
			shieldEl.classList.add(classesToUse[ 0 ]);
		}
	};

	/**
	 * Add the settings for Simple Travel.
	 */
	const addShieldSettings = () => {
		addSetting('Enable Birthday shield', 'birthday-shield', false, 'Replaces the normal shield with the Birthday shield. If multiple shields are enabled, a random one will be used.');
		addSetting('Enable Halloween shield', 'halloween-shield', false, 'Replaces the normal shield with the Halloween shield. If multiple shields are enabled, a random one will be used.');
		addSetting('Enable Remembrance Day shield', 'remembrance_day-shield', false, 'Replaces the normal shield with the Remembrance Day shield. If multiple shields are enabled, a random one will be used.');
		addSetting('Enable Valentine\'s shield', 'valentines-shield', false, 'Replaces the normal shield with the Valentine\'s shield. If multiple shields are enabled, a random one will be used.');
		addSetting('Enable Great Winter Hunter shield', 'winter_hunt-shield', false, 'Replaces the normal shield with the Great Winter Hunt shield. If multiple shields are enabled, a random one will be used.');
	};

	const shieldChoices = [
		'halloween',
		'birthday',
		'valentines',
		'remembrance_day',
		'winter_hunt'
	];

	onPageChange({ change: changeShield });
	changeShield();

	onPageChange({ change: addShieldSettings });
	addShieldSettings();
})());
