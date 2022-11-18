// ==UserScript==
// @name         🐭️ Mousehunt - Shields
// @version      1.1.1
// @description  Choose between Halloween, Birthday, Valentine's, or a random one.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// ==/UserScript==

((function () {
	'use strict';

	/**
	 * Get the current page slug.
	 *
	 * @return {string} The page slug.
	 */
	const getCurrentPage = () => {
		const container = document.getElementById('mousehuntContainer');
		if (! container || container.classList.length <= 0) {
			return null;
		}

		return container.classList[ 0 ].replace('Page', '').toLowerCase();
	};

	/**
	 * Get the saved settings.
	 *
	 * @param {string} key          The key to get.
	 * @param {string} defaultValue The default value.
	 *
	 * @return {Object} The saved settings.
	 */
	const getSetting = (key = null, defaultValue = null) => {
		const settings = JSON.parse(localStorage.getItem('mh-mouseplace-settings')) || {};

		if (key) {
			if (! Object.prototype.hasOwnProperty.call(settings, key)) {
				return defaultValue;
			}

			return settings[ key ];
		}

		return settings;
	};

	/**
	 * Save a setting.
	 *
	 * @param {string}  key   The setting key.
	 * @param {boolean} value The setting value.
	 *
	 */
	const saveSettings = (key, value) => {
		const settings = getSetting();
		settings[ key ] = value;

		localStorage.setItem('mh-mouseplace-settings', JSON.stringify(settings));
	};

	/**
	 * Save a setting.
	 *
	 * @param {Node}    node  The setting node to animate.
	 * @param {string}  key   The setting key.
	 * @param {boolean} value The setting value.
	 */
	const saveSetting = (node, key, value) => {
		node.classList.toggle('active');

		saveSettings(key, value);

		node.parentNode.classList.add('completed');
		setTimeout(() => {
			node.parentNode.classList.remove('completed');
		}, 1000);
	};

	/**
	 * Add a setting to the preferences page.
	 *
	 * @param {string}  name         The setting name.
	 * @param {string}  key          The setting key.
	 * @param {boolean} defaultValue The default value.
	 * @param {string}  description  The setting description.
	 */
	const addSetting = (name, key, defaultValue, description) => {
		if ('preferences' !== getCurrentPage()) {
			return;
		}

		const container = document.querySelector('.mousehuntHud-page-tabContent.game_settings');
		if (! container) {
			return;
		}

		const sectionExists = document.querySelector('#mh-mouseplace-settings');
		if (! sectionExists) {
			const title = document.createElement('div');
			title.id = 'mh-mouseplace-settings';
			title.classList.add('gameSettingTitle');
			title.textContent = 'Userscript Settings';

			container.appendChild(title);

			const seperator = document.createElement('div');
			seperator.classList.add('separator');

			container.appendChild(seperator);
		}

		const settingExists = document.getElementById(`mh-mouseplace-setting-${ key }`);
		if (settingExists) {
			return;
		}

		const settings = document.createElement('div');
		settings.classList.add('settingRowTable');
		settings.id = `mh-mouseplace-setting-${ key }`;

		const settingRow = document.createElement('div');
		settingRow.classList.add('settingRow');

		const settingRowLabel = document.createElement('div');
		settingRowLabel.classList.add('settingRow-label');

		const settingName = document.createElement('div');
		settingName.classList.add('name');
		settingName.innerHTML = name;

		const defaultSettingText = document.createElement('div');
		defaultSettingText.classList.add('defaultSettingText');
		defaultSettingText.textContent = defaultValue ? 'Enabled' : 'Disabled';

		const settingDescription = document.createElement('div');
		settingDescription.classList.add('description');
		settingDescription.innerHTML = description;

		settingRowLabel.appendChild(settingName);
		settingRowLabel.appendChild(defaultSettingText);
		settingRowLabel.appendChild(settingDescription);

		const settingRowAction = document.createElement('div');
		settingRowAction.classList.add('settingRow-action');

		const settingRowInput = document.createElement('div');
		settingRowInput.classList.add('settingRow-action-inputContainer');

		const settingRowInputCheckbox = document.createElement('div');
		settingRowInputCheckbox.classList.add('mousehuntSettingSlider');

		const currentSetting = getSetting(key);
		let isActive = false;
		if (currentSetting) {
			settingRowInputCheckbox.classList.add('active');
			isActive = true;
		} else if (null === currentSetting && defaultValue) {
			settingRowInputCheckbox.classList.add('active');
			isActive = true;
		}

		settingRowInputCheckbox.onclick = (event) => {
			saveSetting(event.target, key, ! isActive);
		};

		// Add the input to the settings row.
		settingRowInput.appendChild(settingRowInputCheckbox);
		settingRowAction.appendChild(settingRowInput);

		// Add the label and action to the settings row.
		settingRow.appendChild(settingRowLabel);
		settingRow.appendChild(settingRowAction);

		// Add the settings row to the settings container.
		settings.appendChild(settingRow);
		container.appendChild(settings);
	};

	/**
	 * Do something when the page or tab changes.
	 *
	 * @param {Object}   callbacks
	 * @param {Function} callbacks.show   The callback to call when the overlay is shown.
	 * @param {Function} callbacks.hide   The callback to call when the overlay is hidden.
	 * @param {Function} callbacks.change The callback to call when the overlay is changed.
	 */
	const onPageChange = (callbacks) => {
		if (callbacks.change) {
			callbacks.change();
		}

		const observer = new MutationObserver(() => {
			if (callbacks.change) {
				callbacks.change();
			}
		});

		const observeTarget = document.getElementById('mousehuntContainer');
		if (observeTarget) {
			observer.observe(observeTarget, {
				attributes: true,
				attributeFilter: ['class']
			});
		}
	};

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
		addSetting('Enable Birthday shield', 'halloween-shield', false, 'Replaces the normal shield with the Birthday shield. If multiple shields are enabled, a random one will be used.');
		addSetting('Enable Halloween shield', 'birthday-shield', false, 'Replaces the normal shield with the Halloween shield. If multiple shields are enabled, a random one will be used.');
		addSetting('Enable Valentine\'s shield', 'valentines-shield', false, 'Replaces the normal shield with the Valentine\'s shield. If multiple shields are enabled, a random one will be used.');
		addSetting('Enable Remembrance Day shield', 'remembrance_day-shield', false, 'Replaces the normal shield with the Remembrance Day shield. If multiple shields are enabled, a random one will be used.');
	};

	const shieldChoices = [
		'halloween',
		'birthday',
		'valentines',
		'remembrance_day',
	];

	onPageChange({ change: changeShield });
	changeShield();

	onPageChange({ change: addShieldSettings });
	addShieldSettings();
})());
