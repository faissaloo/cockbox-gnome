const Lang = imports.lang;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Params = imports.misc.params;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const SettingsManager = Me.imports.SettingsManager;

const ServerItem = GObject.registerClass(class ServerItem extends Gtk.ListBoxRow {
  _init(params) {
    super._init();
    if (params && params.server) {
      this.server = params.server;
    } else {
      this.server = {id: '-1', apikey: ''}
    }
    this.label = new Gtk.Label({label: this.server.id})
    this.add(this.label);
  }

  setServer({id, apikey}) {
    if (id) {
      this.server.id = id;
    }
    if (apikey) {
      this.server.apikey = apikey;
    }
    this.label.set_text(id);
  }
});

const ServerList = GObject.registerClass(class ServerList extends Gtk.ListBox {
  _init(params) {
    super._init(params);
    this.servers = [];

    let a = new Gtk.ListBoxRow();

    for (let i in SettingsManager.settings_manager.getSettings().servers) {
      let new_row = new ServerItem({server: SettingsManager.settings_manager.settings.servers[i]});
      this.addServer(new_row);
    }

    if (this.servers.length > 0) {
      this.select_row(this.servers[0]);
    }

    this.connect('row-selected', (box, row) => {
      this.selected_row = row;
    });
  }

  addServer(server) {
    if (!server) {
      var server = new ServerItem();
    }
    this.servers.push(server);
    this.add(server)
    this.select_row(server);
    this.show_all();
  }

  removeSelected() {
    let current_row_index = this.servers.indexOf(this.selected_row);
    this.remove(this.selected_row);
    this.servers.splice(current_row_index, 1);
    this.select_row(this.servers[Math.max(current_row_index-1, 0)]);
  }

  save() {
    SettingsManager.settings_manager.settings.servers = this.servers.map((i) => i.server);
    SettingsManager.settings_manager.save();
  }
});

const PrefsWidget = GObject.registerClass(class PrefsWidget extends Gtk.VBox {
  _init(params) {
    super._init(params);

    this.server_list = new ServerList();
    this.add(this.server_list);
    this.add_server_button = new Gtk.Button({label: '+'});
    this.remove_server_button = new Gtk.Button({label: '-'});
    this.add_remove = new Gtk.HBox({});
    this.add_remove.add(this.remove_server_button);
    this.add_remove.add(this.add_server_button);
    this.add(this.add_remove);
    this.apikey_label = new Gtk.Label({label: 'Apikey:'});
    this.apikey_entry = new Gtk.Entry({});
    this.server_id_label = new Gtk.Label({label: 'Server id:'});
    this.server_id_entry = new Gtk.Entry({});
    this.server_info = new Gtk.FlowBox({});
    this.server_info.add(this.apikey_label);
    this.server_info.add(this.apikey_entry);
    this.server_info.add(this.server_id_label);
    this.server_info.add(this.server_id_entry);
    this.add(this.server_info);

    this.save_button = new Gtk.Button({label: 'Save'});
    this.add(this.save_button);

    this.save_button.connect('clicked', () => {
      this.server_list.save();
    });

    this.remove_server_button.connect('clicked', () => {
      if (this.apikey_entry)
      this.server_list.removeSelected();
    });

    this.add_server_button.connect('clicked', () => {
      this.server_list.addServer();
    });

    this.server_list.connect('row-selected', (box, row) => {
      this.apikey_entry.set_text(row.server.apikey);
      this.server_id_entry.set_text(row.server.id);
    });

    this.apikey_entry.connect('changed', (string) => {
      this.server_list.selected_row.setServer({apikey: this.apikey_entry.get_text()});
    });

    this.server_id_entry.connect('changed', () => {
      this.server_list.selected_row.setServer({id: this.server_id_entry.get_text()});
    });
  }
});

function init() {

}

function buildPrefsWidget() {
  let a = new PrefsWidget();
  a.show_all();
  return a;
}
