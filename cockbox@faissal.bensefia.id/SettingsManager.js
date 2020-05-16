const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const ShellVersion = imports.misc.config.PACKAGE_VERSION.split('.');

class SettingsManager {
  constructor() {
    this.file = Gio.file_new_for_path(Me.path + '/settings.json');
      this.settings = {
        servers: []
    }

    this.file_watcher = this.file.monitor_file(Gio.FileMonitorFlags.NONE, null);
    this.load();
  }

  save() {
    this.file.replace_contents(JSON.stringify(this.settings), null, false, 0, null);
  }

  load() {
    if (this.file.query_exists(null)) {
      let [flag, data] = this.file.load_contents(null);

      if (flag) {
        this.settings = JSON.parse(data);
      }
    }
  }

  getSettings() {
    return this.settings;
  }
}

var settings_manager = new SettingsManager();
