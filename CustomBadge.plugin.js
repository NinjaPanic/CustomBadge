/**
 * @name CustomBadge
 * @author NinjaPanic
 * @version 1.0.3
 * @source https://github.com/NinjaPanic/CustomBadge
 * @updateUrl https://raw.githubusercontent.com/NinjaPanic/CustomBadge/main/CustomBadge.plugin.js
 */
/*@cc_on
@if(@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if(fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if(!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if(shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
	const config = {
		"info": {
			"name": "Custom Badge",
			"authors": [{
				"name": "NinjaPanic",
				"discord_id": "1139652745276698674",
				"github_username": "NinjaPanic"
			}],
			"version": "1.0.3",
			"description": "Unlock all discord badges and add a custom one",
			"github": "https://github.com/NinjaPanic/CustomBadge",
			"github_raw": "https://raw.githubusercontent.com/NinjaPanic/CustomBadge/main/CustomBadge.plugin.js"
		},
		"main": "CustomBadge.plugin.js"
	};

	return !global.ZeresPluginLibrary ? class {
		constructor() {
			this._config = config;
		}
		getName() {
			return config.info.name;
		}
		getAuthor() {
			return config.info.authors.map(a => a.name).join(", ");
		}
		getDescription() {
			return config.info.description;
		}
		getVersion() {
			return config.info.version;
		}
		load() {
			BdApi.UI.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
				confirmText: "Download Now",
				cancelText: "Cancel",
				onConfirm: () => {
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
						if(error) return require("electron").shell.openExternal("https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			const {
				WebpackModules,
				DiscordClassModules,
				PluginUpdater
			} = Api;
			return class CustomBadge extends Plugin {
	
				saveAndUpdate(){	
					this.badgeUserIDs = [];
					try{
						this.honorBadge();
					}catch(err){
						console.log("Error with Custom Badge");
					}
				} //End of saveAndUpdate()
				
				honorBadge(){
					BdApi.Patcher.after("CustomBadge", this.userProfileMod, "getUserProfile", (_,args,ret) => {
						if(!this.badgeUserIDs.includes(ret.id)) this.badgeUserIDs.push(ret.id);
						if(ret == undefined) return;
						if(ret.userId == undefined) return;
						const badgesList = [];
						for(let i = 0; i < ret.badges.length; i++){
							badgesList.push(ret.badges[i].id);
						}
						if (this.badgeUserIDs.includes(ret.userId) && !badgesList.includes("a")){
							ret.badges.push({
								id: "a",
								icon: "6bdc42827a38498929a4920da12695d9", 
								description: "Développeur actif",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "848f79194d4be5ff5f81505cbd0ce1e6", 
								description: "Discord Bug Hunter",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "fee1624003e2fee35cb398e125dc479b",
								description: "Anciens des programmes de modération",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "ec92202290b48d0879b7413d2dde3bab", 
								description: "Booster de serveurs depuis le 15 février 2018",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "bf01d1073931f921909045f3a39fd264",
								description: "Événements HypeSquad",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "3f9748e53446a137a052f3454e2de41e", 
								description: "Propriétaire d'un serveur partenaire",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "2ba85e8026a8614b640c2837bcdfe21b",
								description: "Abonné depuis 15 février 2018",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "7060786766c9c840eb3019e725d2b358",
								description: "Soutien de la première heure",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "5e74e9b61934fc1f67c65515d1f7e60d",
								description: "Équipe Discord",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "6df5892e0f35b051f8b61eace34f4967",
								description: "Développeur de bot certifié de la première heure",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
							ret.badges.push({
								id: "a",
								icon: "6bdc42827a38498929a4920da12695d9",
								description: "Discord CEO",
								link: "https://github.com/NinjaPanic/CustomBadge"
							});
						}
					});
					
					function applyCustomBadgeIcon(self){
						if(self.profileBadgesClass == undefined) self.profileBadgesClass = WebpackModules.getByProps("profileBadges").profileBadges;
						for(const element of document.getElementsByClassName(self.profileBadgesClass) + document.getElementsByClassName(DiscordClassModules.UserModal.profileBadge)){
							const qry = document.querySelectorAll('[aria-label="Discord CEO"]');
							if(qry.length > 0){
								qry.forEach((obj) => {
									const icon = "https://cdn3.emoji.gg/emojis/6654-blurple-crown.png";
									const badge = obj;
									if(badge.firstChild.src != icon) badge.firstChild.src = icon;
								});		
							}
							/*const qry2 = document.querySelectorAll('[aria-label=""]');
							if(qry2.length > 0){
								qry2.forEach((obj) => {
									const icon = "https://i.imgur.com/bYGGXnq.gif";
									const badge = obj;
									if(badge.firstChild.src != icon) badge.firstChild.src = icon;
								});		
							}TODO: setting for custom badge*/

						}
					}
					
					if(this.profileRenderer == undefined) this.profileRenderer = WebpackModules.getAllByProps("default").filter((obj) => obj.default.toString().includes("CLYDE_SETTINGS"))[0];
					
					BdApi.Patcher.after("CustomBadge", this.profileRenderer, "default", (_,args,ret) => {
						try{
							applyCustomBadgeIcon(this);
						}catch(err){
							console.error(err);
						}
					});
					
					if(this.profileCustomizationModule == undefined) this.profileCustomizationModule = WebpackModules.getByProps("getTryItOutThemeColors");
					BdApi.Patcher.after("CustomBadge", this.profileCustomizationModule, "getAllTryItOut", () => {
						try{
							applyCustomBadgeIcon(this);
						}catch(err){
							console.error(err);
						}
					});
					
					BdApi.Patcher.after("CustomBadge", this.profileCustomizationModule, "getAllPending", () => {
						try{
							applyCustomBadgeIcon(this);
						}catch(err){
							console.error(err);
						}
					});
				} //End of honorBadge()
				
				
				onStart() {
					PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), this._config.info.github_raw);
					this.userProfileMod = WebpackModules.getByProps("getUserProfile");
					this.saveAndUpdate();
					if(!this.badgeUserIDs.includes(ret.id)) this.badgeUserIDs.push(ret.id);
				}
				
			};
		};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
