/**
 * @name CustomBadge
 * @author NinjaPanic
 * @authorLink https://github.com/NinjaPanic
 * @version 4.0.0
 * @invite K3pdByqGRD
 * @source https://github.com/NinjaPanic/CustomBadge
 * @updateUrl https://raw.githubusercontent.com/NinjaPanic/CustomBadge/main/CustomBadge.plugin.js
 * @description Unlock all Discord badges with customizable dates and automatic tier calculation.
 */
module.exports = (() => {
  const config = {
    info: {
      name: "CustomBadge",
      authors: [
        {
          name: "NinjaPanic",
          discord_id: "1200195920923463700",
          github_username: "NinjaPanic"
        }
      ],
      version: "4.0.0",
      description: "Unlock all Discord badges with customizable dates and automatic tier calculation",
      github: "https://github.com/NinjaPanic/CustomBadge",
      github_raw: "https://raw.githubusercontent.com/NinjaPanic/CustomBadge/main/CustomBadge.plugin.js"
    },
    main: "CustomBadge.plugin.js"
  };

  return !global.ZeresPluginLibrary ? class {
    constructor() { this._config = config; }
    load() {
      BdApi.showConfirmationModal("Library Missing", `The library required for ${config.info.name} is missing. Click Download to install it.`, {
        confirmText: "Download",
        cancelText: "Cancel",
        onConfirm: () => {
          require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (e, b) => {
            if (e) return require("electron").shell.openExternal("https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
            await new Promise(res => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), b, res));
          });
        }
      });
    }
    start() {}
    stop() {}
  } : (([Plugin, Api]) => {
    const { WebpackModules, PluginUpdater } = Api;

    return class CustomProfileBadge extends Plugin {
      
      constructor() {
        super();
        this.defaultSettings = {
          nitroDate: "15 Jul 2018",
          boostDate: "15 Jul 2018",
          legacyUsername: "Username#0000",
          badges: {
            staff: true,
            partner: true,
            mod: true,
            hypesquad_events: true,
            hypesquad_bravery: true,
            hypesquad_brilliance: true,
            hypesquad_balance: true,
            bug_hunter_1: true,
            bug_hunter_2: true,
            early: true,
            verified_bot_dev: true,
            active_dev: true,
            nitro: true,
            boost: true,
            legacy_username: true,
            bot_commands: true,
            automod: true,
            guild_shop: true,
            quest_completed: true
          }
        };
        this.settings = BdApi.Data.load(config.info.name, "settings") || this.defaultSettings;
      }

      calculateMonthsDifference(startDate) {
        try {
          const parts = startDate.split(' ');
          const day = parseInt(parts[0]);
          const month = parts[1];
          const year = parseInt(parts[2]);
          
          const monthMap = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
          };
          
          const start = new Date(year, monthMap[month], day);
          const now = new Date();
          
          const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
          return Math.max(0, months);
        } catch (e) {
          return 0;
        }
      }

      getNitroTier(months) {
        if (months >= 72) return { tier: 'Opal (6 years)', icon: '5b154df19c53dce2af92c9b61e6be5e2', text: 'Subscriber since' };
        if (months >= 60) return { tier: 'Ruby (5 years)', icon: 'cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4', text: 'Subscriber since' };
        if (months >= 36) return { tier: 'Emerald (3 years)', icon: '11e2d339068b55d3a506cff34d3780f3', text: 'Subscriber since' };
        if (months >= 24) return { tier: 'Diamond (2 years)', icon: '0d61871f72bb9a33a7ae568c1fb4f20a', text: 'Subscriber since' };
        if (months >= 12) return { tier: 'Platinum (1 year)', icon: '0334688279c8359120922938dcb1d6f8', text: 'Subscriber since' };
        if (months >= 6) return { tier: 'Gold (6 months)', icon: '2895086c18d5531d499862e41d1155a6', text: 'Subscriber since' };
        if (months >= 3) return { tier: 'Silver (3 months)', icon: '4514fab914bdbfb4ad2fa23df76121a6', text: 'Subscriber since' };
        if (months >= 1) return { tier: 'Bronze (1 month)', icon: '4f33c4a9c64ce221936bd256c356f91f', text: 'Subscriber since' };
        return { tier: 'Basic', icon: '2ba85e8026a8614b640c2837bcdfe21b', text: 'Subscriber since' };
      }

      getBoostTier(months) {
        if (months >= 24) return { tier: 'Level 9 (24 months)', icon: 'ec92202290b48d0879b7413d2dde3bab', text: 'Server Boosting since' };
        if (months >= 18) return { tier: 'Level 8 (18 months)', icon: '7142225d31238f6387d9f09efaa02759', text: 'Server Boosting since' };
        if (months >= 15) return { tier: 'Level 7 (15 months)', icon: 'cb3ae83c15e970e8f3d410bc62cb8b99', text: 'Server Boosting since' };
        if (months >= 12) return { tier: 'Level 6 (12 months)', icon: '991c9f39ee33d7537d9f408c3e53141e', text: 'Server Boosting since' };
        if (months >= 9) return { tier: 'Level 5 (9 months)', icon: '996b3e870e8a22ce519b3a50e6bdd52f', text: 'Server Boosting since' };
        if (months >= 6) return { tier: 'Level 4 (6 months)', icon: 'df199d2050d3ed4ebf84d64ae83989f8', text: 'Server Boosting since' };
        if (months >= 3) return { tier: 'Level 3 (3 months)', icon: '72bed924410c304dbe3d00a6e593ff59', text: 'Server Boosting since' };
        if (months >= 2) return { tier: 'Level 2 (2 months)', icon: '0e4080d1d333bc7ad29ef6528b6f2fb7', text: 'Server Boosting since' };
        if (months >= 1) return { tier: 'Level 1 (1 month)', icon: '51040c70d4f20a921ad6674ff86fc95c', text: 'Server Boosting since' };
        return { tier: 'Level 1', icon: '51040c70d4f20a921ad6674ff86fc95c', text: 'Server Boosting since' };
      }

      getSettingsPanel() {
        const panel = document.createElement("div");
        panel.style.padding = "20px";
        panel.style.color = "var(--text-normal)";

        const style = document.createElement("style");
        style.textContent = `
          .custombadge-section {
            margin-bottom: 30px;
          }
          .custombadge-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--header-primary);
            margin-bottom: 15px;
            border-bottom: 1px solid var(--background-modifier-accent);
            padding-bottom: 8px;
          }
          .custombadge-setting {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 15px;
            margin: 8px 0;
            background: #2f3136;
            border-radius: 8px;
            border: 2px solid #202225;
            transition: all 0.2s ease;
          }
          .custombadge-setting:hover {
            background: #36393f;
            border-color: #5865f2;
            transform: translateX(4px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          .custombadge-label {
            display: flex;
            flex-direction: column;
          }
          .custombadge-name {
            font-weight: 500;
            color: var(--header-primary);
          }
          .custombadge-note {
            font-size: 12px;
            color: var(--text-muted);
            margin-top: 3px;
          }
          .custombadge-input {
            background: var(--input-background);
            border: 1px solid var(--input-border);
            color: var(--text-normal);
            padding: 8px 12px;
            border-radius: 3px;
            width: 200px;
            font-size: 14px;
          }
          .custombadge-input:focus {
            border-color: var(--brand-experiment);
            outline: none;
          }
          .custombadge-switch {
            width: 44px;
            height: 24px;
            background: #72767d;
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: background 0.2s;
            border: 2px solid #4f545c;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
          }
          .custombadge-switch.active {
            background: #3ba55d;
            border-color: #2d7d46;
          }
          .custombadge-switch::after {
            content: "";
            position: absolute;
            width: 18px;
            height: 18px;
            background: #ffffff;
            border-radius: 50%;
            top: 1px;
            left: 1px;
            transition: left 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          .custombadge-switch.active::after {
            left: 21px;
          }
          .custombadge-info {
            background: #5865f2;
            padding: 14px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 13px;
            color: #ffffff;
            border-left: 4px solid #4752c4;
          }
        `;
        panel.appendChild(style);

        const infoSection = document.createElement("div");
        infoSection.className = "custombadge-info";
        infoSection.innerHTML = `
          <strong>ℹ️ Information:</strong><br>
          • Nitro and Boost tiers are automatically calculated based on your dates<br>
          • The badges will change automatically as time passes<br>
          • Each tier has its own unique icon and appearance<br>
          • You can customize your legacy username (Format: Username#0000)
        `;
        panel.appendChild(infoSection);

        const datesSection = document.createElement("div");
        datesSection.className = "custombadge-section";
        
        const datesTitle = document.createElement("div");
        datesTitle.className = "custombadge-title";
        datesTitle.textContent = "📅 Badge Dates Configuration";
        datesSection.appendChild(datesTitle);

        const nitroMonths = this.calculateMonthsDifference(this.settings.nitroDate);
        const nitroTier = this.getNitroTier(nitroMonths);
        const nitroSetting = this.createInputSetting(
          "Nitro Subscription Date",
          `Format: DD MMM YYYY - Current: ${nitroMonths} months (${nitroTier.tier})`,
          this.settings.nitroDate,
          (value) => {
            this.settings.nitroDate = value;
            this.saveSettings();
          }
        );
        datesSection.appendChild(nitroSetting);

        const boostMonths = this.calculateMonthsDifference(this.settings.boostDate);
        const boostTier = this.getBoostTier(boostMonths);
        const boostSetting = this.createInputSetting(
          "Server Boost Date",
          `Format: DD MMM YYYY - Current: ${boostMonths} months (${boostTier.tier})`,
          this.settings.boostDate,
          (value) => {
            this.settings.boostDate = value;
            this.saveSettings();
          }
        );
        datesSection.appendChild(boostSetting);

        const legacySetting = this.createInputSetting(
          "Legacy Username",
          "Format: Username#0000 (for 'Originally known as' badge)",
          this.settings.legacyUsername || "Username#0000",
          (value) => {
            this.settings.legacyUsername = value;
            this.saveSettings();
          }
        );
        datesSection.appendChild(legacySetting);

        panel.appendChild(datesSection);

        const badgesSection = document.createElement("div");
        badgesSection.className = "custombadge-section";
        
        const badgesTitle = document.createElement("div");
        badgesTitle.className = "custombadge-title";
        badgesTitle.textContent = "🎖️ Badge Selection";
        badgesSection.appendChild(badgesTitle);

        const badgesList = [
          { id: "staff", name: "Discord Staff", note: "Discord Staff badge" },
          { id: "partner", name: "Partnered Server Owner", note: "Partner badge" },
          { id: "mod", name: "Moderator Program Alumni", note: "Moderator Alumni badge" },
          { id: "hypesquad_events", name: "HypeSquad Events", note: "HypeSquad Events badge" },
          { id: "hypesquad_bravery", name: "HypeSquad Bravery", note: "HypeSquad Bravery badge" },
          { id: "hypesquad_brilliance", name: "HypeSquad Brilliance", note: "HypeSquad Brilliance badge" },
          { id: "hypesquad_balance", name: "HypeSquad Balance", note: "HypeSquad Balance badge" },
          { id: "bug_hunter_1", name: "Bug Hunter Level 1", note: "Bug Hunter badge (green)" },
          { id: "bug_hunter_2", name: "Bug Hunter Level 2", note: "Bug Hunter Gold badge (gold)" },
          { id: "early", name: "Early Supporter", note: "Early Supporter badge" },
          { id: "verified_bot_dev", name: "Early Verified Bot Developer", note: "Verified Bot Developer badge" },
          { id: "active_dev", name: "Active Developer", note: "Active Developer badge" },
          { id: "nitro", name: "Nitro Subscriber", note: "Nitro subscription badge (auto tier)" },
          { id: "boost", name: "Server Booster", note: "Server boosting badge (auto tier)" },
          { id: "legacy_username", name: "Originally known as...", note: "Legacy username badge" },
          { id: "bot_commands", name: "Supports Commands", note: "Bot commands badge" },
          { id: "automod", name: "Uses AutoMod", note: "AutoMod badge" },
          { id: "guild_shop", name: "Server Shop", note: "Server shop badge" },
          { id: "quest_completed", name: "Quest Completed", note: "Quest completion badge" }
        ];

        badgesList.forEach(badge => {
          const setting = this.createSwitchSetting(
            badge.name,
            badge.note,
            this.settings.badges[badge.id] !== false,
            (value) => {
              this.settings.badges[badge.id] = value;
              this.saveSettings();
            }
          );
          badgesSection.appendChild(setting);
        });

        panel.appendChild(badgesSection);

        return panel;
      }

      createInputSetting(name, note, value, onChange) {
        const setting = document.createElement("div");
        setting.className = "custombadge-setting";

        const label = document.createElement("div");
        label.className = "custombadge-label";

        const nameEl = document.createElement("div");
        nameEl.className = "custombadge-name";
        nameEl.textContent = name;
        label.appendChild(nameEl);

        const noteEl = document.createElement("div");
        noteEl.className = "custombadge-note";
        noteEl.textContent = note;
        label.appendChild(noteEl);

        const input = document.createElement("input");
        input.className = "custombadge-input";
        input.type = "text";
        input.value = value;
        input.addEventListener("change", (e) => onChange(e.target.value));

        setting.appendChild(label);
        setting.appendChild(input);

        return setting;
      }

      createSwitchSetting(name, note, value, onChange) {
        const setting = document.createElement("div");
        setting.className = "custombadge-setting";

        const label = document.createElement("div");
        label.className = "custombadge-label";

        const nameEl = document.createElement("div");
        nameEl.className = "custombadge-name";
        nameEl.textContent = name;
        label.appendChild(nameEl);

        const noteEl = document.createElement("div");
        noteEl.className = "custombadge-note";
        noteEl.textContent = note;
        label.appendChild(noteEl);

        const toggle = document.createElement("div");
        toggle.className = "custombadge-switch" + (value ? " active" : "");
        toggle.addEventListener("click", () => {
          const newValue = !toggle.classList.contains("active");
          toggle.classList.toggle("active");
          onChange(newValue);
        });

        setting.appendChild(label);
        setting.appendChild(toggle);

        return setting;
      }

      saveSettings() {
        BdApi.Data.save(config.info.name, "settings", this.settings);
        BdApi.Patcher.unpatchAll("CustomProfileBadge");
        setTimeout(() => {
          this.patchUserProfile();
          const userProfileStore = WebpackModules.getByProps("getUserProfile");
          if (userProfileStore && userProfileStore.getUserProfile) {
            const currentUserId = WebpackModules.getByProps("getCurrentUser").getCurrentUser().id;
            userProfileStore.getUserProfile(currentUserId);
          }
        }, 100);
      }

      onStart() {
        PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), this._config.info.github_raw);
        this.patchUserProfile();
      }

      onStop() {
        BdApi.Patcher.unpatchAll("CustomProfileBadge");
      }

      patchUserProfile() {
        const userProfileMod = WebpackModules.getByProps("getUserProfile");
        const currentUserId = WebpackModules.getByProps("getCurrentUser").getCurrentUser().id;

        BdApi.Patcher.after("CustomProfileBadge", userProfileMod, "getUserProfile", (_, args, ret) => {
          if (ret?.userId !== currentUserId) return;

          const customBadgeIds = [
            "staff", "partner", "mod", "hypesquad_events", "hypesquad_bravery", 
            "hypesquad_brilliance", "hypesquad_balance", "bug_hunter_1", "bug_hunter_2",
            "early", "verified_bot_dev", "active_dev", "nitro", "boost", 
            "legacy_username", "bot_commands", "automod", "guild_shop", "quest_completed"
          ];

          ret.badges = ret.badges.filter(b => !customBadgeIds.includes(b.id));

          const addBadge = (id, icon, description, enabled = true) => {
            if (!enabled) return;
            ret.badges.push({ id, icon, description, link: "https://github.com/NinjaPanic/CustomBadge" });
          };

          const nitroDate = this.settings.nitroDate || "15 Jul 2018";
          const boostDate = this.settings.boostDate || "15 Jul 2018";
          const legacyUsername = this.settings.legacyUsername || "Username#0000";
          const badges = this.settings.badges;

          const nitroMonths = this.calculateMonthsDifference(nitroDate);
          const boostMonths = this.calculateMonthsDifference(boostDate);
          const nitroTier = this.getNitroTier(nitroMonths);
          const boostTier = this.getBoostTier(boostMonths);

          addBadge("staff", "5e74e9b61934fc1f67c65515d1f7e60d", "Discord Staff", badges.staff);
          addBadge("partner", "3f9748e53446a137a052f3454e2de41e", "Partnered Server Owner", badges.partner);
          addBadge("mod", "fee1624003e2fee35cb398e125dc479b", "Moderator Program Alumni", badges.mod);
          addBadge("hypesquad_events", "bf01d1073931f921909045f3a39fd264", "HypeSquad Events", badges.hypesquad_events);
          addBadge("hypesquad_bravery", "8a88d63823d8a71cd5e390baa45efa02", "HypeSquad Bravery", badges.hypesquad_bravery);
          addBadge("hypesquad_brilliance", "011940fd013da3f7fb926e4a1cd2e618", "HypeSquad Brilliance", badges.hypesquad_brilliance);
          addBadge("hypesquad_balance", "3aa41de486fa12454c3761e8e223442e", "HypeSquad Balance", badges.hypesquad_balance);
          addBadge("bug_hunter_1", "2717692c7dca7289b35297368a940dd0", "Discord Bug Hunter", badges.bug_hunter_1);
          addBadge("bug_hunter_2", "848f79194d4be5ff5f81505cbd0ce1e6", "Discord Bug Hunter Gold", badges.bug_hunter_2);
          addBadge("early", "7060786766c9c840eb3019e725d2b358", "Early Supporter", badges.early);
          addBadge("verified_bot_dev", "6df5892e0f35b051f8b61eace34f4967", "Early Verified Bot Developer", badges.verified_bot_dev);
          addBadge("active_dev", "6bdc42827a38498929a4920da12695d9", "Active Developer", badges.active_dev);
          addBadge("nitro", nitroTier.icon, `${nitroTier.text} ${nitroDate}`, badges.nitro);
          addBadge("boost", boostTier.icon, `${boostTier.text} ${boostDate}`, badges.boost);
          addBadge("legacy_username", "6de6d34650760ba5551a79732e98ed60", `Originally known as ${legacyUsername}`, badges.legacy_username);
          addBadge("bot_commands", "6f9e37f9029ff57aef81db857890005e", "Supports Commands", badges.bot_commands);
          addBadge("automod", "f2459b691ac7453ed6039bbcfaccbfcd", "Uses AutoMod", badges.automod);
          addBadge("guild_shop", "d2010c413a8da2208b7e4f35bd8cd4ac", "Server Shop", badges.guild_shop);
          addBadge("quest_completed", "7d9ae358c8c5e118768335dbe68b4fb8", "Quest Completed", badges.quest_completed);
        });
      }
    };
  })(global.ZeresPluginLibrary.buildPlugin(config));
})();