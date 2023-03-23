// ==UserScript==
// @name         🐭️ Mousehunt - Shields
// @version      1.5.0
// @description  Change your MouseHunt shield to an event shield, like the Halloween shield.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.4.0/mousehunt-utils.js
// ==/UserScript==

((function () {
  'use strict';

  const addClass = (el, shieldClass) => {
    const classToAdd = shieldClass.replace('.', ' ');

    classToAdd.split(' ').forEach((className) => {
      el.classList.add(className);
    });
  };

  const changeShield = () => {
    const classesToUse = [];

    shieldChoices.forEach((shield) => {
      const setting = getSetting(`${shield}-shield`);
      if (setting) {
        classesToUse.push(shield);
      }
    });

    const shieldEl = document.querySelector('.mousehuntHud-shield');
    if (!shieldEl) {
      return;
    }

    // Remove all shield classes.
    shieldEl.classList.remove(...shieldChoices);

    if (classesToUse.length > 1) {
      // If there are multiple shields, use a random one.
      const randomShield = classesToUse[Math.floor(Math.random() * classesToUse.length)];
      addClass(shieldEl, randomShield);
    } else if (classesToUse.length === 1) {
      // If there is only one shield, use that one.
      addClass(shieldEl, classesToUse[0]);
    }
  };

  /**
   * Add the settings for Simple Travel.
   */
  const addShieldSettings = () => {
    const settingSection = {
      id: 'mh-shields',
      name: 'MouseHunt Shields',
    };

    addSetting('Birthday', 'birthday-shield', false, '', settingSection);
    addSetting('Birthday (Year 10)', 'birthday.year10-shield', false, '', settingSection);
    addSetting('Birthday (Year 11)', 'birthday.year11-shield', false, '', settingSection);
    addSetting('Birthday (Year 12)', 'birthday.year12-shield', false, '', settingSection);
    addSetting('Birthday (Year 13)', 'birthday.year13-shield', false, '', settingSection);
    addSetting('Birthday (Year 14)', 'birthday.year14-shield', false, '', settingSection);
    addSetting('Birthday (Year 15)', 'birthday.year15-shield', false, '', settingSection);
    addSetting('Halloween', 'halloween-shield', false, '', settingSection);
    addSetting('Remembrance Day', 'remembrance_day-shield', false, '', settingSection);
    addSetting('Valentine\'s', 'valentines-shield', false, '', settingSection);
    addSetting('Great Winter Hunter', 'winter_hunt-shield', false, '', settingSection);
    addSetting('Larry\'s Football Challenge', 'larrys_football_challenge-shield', false, '', settingSection);
    addSetting('Jerry ', 'jerry-shield', false, 'Custom shield with Jerry', settingSection);

    const settingsSection = document.querySelector('#mh-shields');
    if (!settingsSection) {
      return;
    }

    const seperator = settingsSection.querySelector('.separator');
    const settingSubHeader = document.createElement('h4');
    settingSubHeader.classList.add('settings-subheader');
    settingSubHeader.innerText = 'Replaces the default shield. If multiple shields are enabled, a random one will be used.';

    // append the subheader before the separator.
    settingsSection.insertBefore(settingSubHeader, seperator);
  };

  const shieldChoices = [
    'remembrance_day',
    'winter_hunt',
    'valentines',
    'birthday',
    'birthday.year10',
    'birthday.year11',
    'birthday.year12',
    'birthday.year13',
    'birthday.year14',
    'birthday.year15',
    'larrys_football_challenge',
    'halloween',
    'jerry'
  ];

  onPageChange({ change: changeShield });
  changeShield();

  onPageChange({ change: addShieldSettings });
  addShieldSettings();

  addStyles(`#mh-shields .defaultSettingText {
    display: none;
  }

  #mh-shields .settings-subheader {
    color: #848484;
    font-size: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #mh-shields .settingRowTable {
    display: inline-block;
    width: 300px;
    margin-right: 50px;
  }

  #mh-shields .settingRow {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
  }

  .mousehuntHud-shield.larrys_football_challenge.golden {
    background-image: url(https://www.mousehuntgame.com/images/ui/elements/header_world_cup_golden_shield.png?asset_cache_version=2);
  }

  .mousehuntHud-shield.jerry.golden {
    background-image: url(https://brrad.com/mh/shield-jerry.png?10), url(https://www.mousehuntgame.com/images/ui/elements/header_golden_shield.gif?asset_cache_version=2);
  }
  .mousehuntHud-shield.jerry {
    background-image: url(https://brrad.com/mh/shield-jerry.png?10);
  }`);
})());
