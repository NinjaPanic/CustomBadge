/**
 * @name CustomBadge
 * @author NinjaPanic
 * @version 2.0.0
 * @description Unlock all Discord badges.
 * @source https://github.com/NinjaPanic/CustomBadge
 * @updateUrl https://raw.githubusercontent.com/NinjaPanic/CustomBadge/main/CustomBadge.plugin.js
 */

module.exports = (() => {
  const config = {
    info: {
      name: "CustomBadge",
      authors: [
        {
          name: "NinjaPanic",
          discord_id: "1139652745276698674",
          github_username: "NinjaPanic"
        }
      ],
      version: "2.0.0",
      description: "Unlock all Discord badges",
      github: "https://github.com/NinjaPanic/CustomBadge",
      github_raw: "https://raw.githubusercontent.com/NinjaPanic/CustomBadge/main/CustomBadge.plugin.js"
    },
    main: "CustomBadge.plugin.js"
  };

  return !global.ZeresPluginLibrary ? class {
    constructor() { this._config = config; }
    load() {
      BdApi.showConfirmationModal("Library Missing", `The library needed for ${config.info.name} is missing. Click Download to install it.`, {
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

    return class CustomBadge extends Plugin {

      onStart() {
        PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), this._config.info.github_raw);
        BdApi.Patcher.unpatchAll("CustomBadge");

        this.patchUserProfile();
      }

      onStop() {
        BdApi.Patcher.unpatchAll("CustomBadge");
      }

      patchUserProfile() {
        const userProfileMod = WebpackModules.getByProps("getUserProfile");
        const currentUserId = BdApi.findModuleByProps("getCurrentUser").getCurrentUser().id;

        BdApi.Patcher.after("CustomBadge", userProfileMod, "getUserProfile", (_, args, ret) => {
          if (ret?.userId !== currentUserId) return;

          const existing = new Set(ret.badges.map(b => b.icon + b.description));
          const addBadge = (id, icon, description) => {
            const key = icon + description;
            if (!existing.has(key)) {
              existing.add(key);
              ret.badges.push({ id, icon, description, link: "https://github.com/NinjaPanic/CustomBadge" });
            }
          };

          addBadge("dev", "6bdc42827a38498929a4920da12695d9", "Active Developer");
          addBadge("bug", "848f79194d4be5ff5f81505cbd0ce1e6", "Discord Bug Hunter");
          addBadge("mod", "fee1624003e2fee35cb398e125dc479b", "Moderator Program Alumni");
          addBadge("boost", "ec92202290b48d0879b7413d2dde3bab", "Server Boosting since 15 Jul 2018");
          addBadge("events", "bf01d1073931f921909045f3a39fd264", "HypeSquad Events");
          addBadge("partner", "3f9748e53446a137a052f3454e2de41e", "Partnered Server Owner");
          addBadge("nitro", "2ba85e8026a8614b640c2837bcdfe21b", "Subscriber since 15 Jul 2018");
          addBadge("early", "7060786766c9c840eb3019e725d2b358", "Early Supporter");
          addBadge("staff", "5e74e9b61934fc1f67c65515d1f7e60d", "Discord Staff");
          addBadge("botdev", "6df5892e0f35b051f8b61eace34f4967", "Early Verified Bot Developer");
          addBadge("ceo", "ec92202290b48d0879b7413d2dde3bab", "Discord CEO");
        });
      }
    };
  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
