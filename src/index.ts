import {Plugin} from "obsidian";
import {ListArchitectSettingsTab} from "./settings";
import {addCommands} from "./commands";

export interface ListConfiguration {
    path: string;

}

export interface Settings {
    lists: ListConfiguration[];
}

export const DEFAULT_SETTINGS: Settings = {
    lists: [],

}

export default class ListArchitect extends Plugin {

    settings: Settings;

    async onload() {

        console.log(`Loading ${this.manifest.name} (${this.manifest.version})`);

        await this.loadSettings();

        addCommands.call(this);

        // this.registerView(
        //     'reference-view',
        //     (leaf) => new ReferenceGView(leaf, this.app)
        // );

        this.addSettingTab(new ListArchitectSettingsTab(this.app, this));

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }

    onunload() {}

}


