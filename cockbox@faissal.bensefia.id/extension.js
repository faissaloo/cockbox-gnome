const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const SettingsManager = Me.imports.SettingsManager;
const CockboxApi = Me.imports.CockboxApi.CockboxApi;
const Utils = Me.imports.utils;

Array.prototype.asyncMap = async function(callback) {
  let promises = this.map((item, index) => {
    callback(item, index);
  });
  return await Promise.all(promises);
}

class Cockbox extends PanelMenu.Button {
    constructor() {
      super(0.0, 'Cockbox', false);
      this.fetching = false;

      this.actor.add_actor(new St.Icon({
        gicon: Gio.icon_new_for_string(Me.path + '/res/logo.svg'),
        icon_size: 24
      }));

      SettingsManager.settings_manager.file_watcher.connect('changed', async (old_file, new_file, event) => {
        if (!this.fetching) {
          this.fetching = true;
          await this.reload();
          this.fetching = false;
        }
      });

      this.fetch();
    }

    async reload() {
      this.menu.removeAll();
      SettingsManager.settings_manager.load();
      await this.fetch();
    }

    async fetch() {
      this.menu_items = await SettingsManager
        .settings_manager
        .getSettings()
        .servers
        .asyncMap(
          async ({id, apikey}) =>
            await this.addServer(id, apikey)
        );
    }

    async addServer(id, apikey) {
      let json_server_data = await (new CockboxApi()).getInfo(id, apikey)
      let menu_items = {
        name: new PopupMenu.PopupMenuItem(json_server_data.message.identifier, {
          reactive: true, hover: false, activate: false
        }),
        timeleft: new PopupMenu.PopupMenuItem(
          Utils.prettyRemainingTime(new Date(json_server_data.message.expires_at) - new Date())+' remaining',
          { reactive: true, hover: false, activate: false }
        ),
        ip: new PopupMenu.PopupMenuItem(json_server_data.message.ip_address.address, {
          reactive: true
        }),
        wallet: new PopupMenu.PopupMenuItem(json_server_data.message.crypto.name, {
          reactive: true
        })
      };

      menu_items.ip.connect('activate', () => {
        Utils.set_clipboard(json_server_data.message.ip_address.address);
      });

      menu_items.wallet.connect('activate', () => {
        Utils.set_clipboard(json_server_data.message.crypto.address);
      });

      for (var key in menu_items) {
        this.menu.addMenuItem(menu_items[key]);
      }
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      return menu_items;
    }
}

let cockbox;

function init() {
}

function enable() {
  cockbox = new Cockbox();
  Main.panel.addToStatusArea('Cockbox', cockbox);
}

function disable() {
  cockbox.destroy();
}
