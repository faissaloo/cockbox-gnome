This is a GNOME shell plugin that displays basic information about a given Cockbox server under a toolbar dropdown, you can change and add servers via the GNOME shell extension settings.

In writing this plugin I've made use of modern Javascript, as well as pulled some things away from GNOME specific tooling (i.e: gnome schemas & resources) as these things require compilation and aren't very well suited for a language like Javascript. These architectural decisions have been made in the hopes that the current state of GNOME shell extensions (which is abysmal) can be improved.

![toolbar screenshot](https://i.imgur.com/BNWBgBS.png)
![settings screenshot](https://i.imgur.com/7mPxzSK.png)
