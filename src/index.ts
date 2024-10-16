import {Plugin} from "obsidian";
import {ListArchitectSettingsTab} from "./settings";
import {addCommands} from "./commands";
import {Tools} from "./tools";
import {FuzzySuggester} from "./handlers/FuzzySuggester";
import {ActionSuggester} from "./handlers/ActionSuggester";
import {Architect} from "./architect/Architect";
import {TextInputModal} from "./handlers/TextInputModal";

export interface ListConfiguration {
    path: string;

}

export interface Settings {
    lists: ListConfiguration[];
    folders: string[];
}

export const DEFAULT_SETTINGS: Settings = {
    lists: [{
        path: "GENERAL.Lists/list.md"
    }],
    folders: ["GENERAL.Lists"]
}

export default class ListArchitect extends Plugin {

    tools: Tools = new Tools(this);
    settings: Settings;
    fuzzySuggester: FuzzySuggester;
    actionSuggester: ActionSuggester;
    architect: Architect;

    async onload() {

        console.log(`Loading ${this.manifest.name} (${this.manifest.version})`);


        this.fuzzySuggester = new FuzzySuggester(this);
        this.actionSuggester = new ActionSuggester(this);
        this.architect = new Architect(this);

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


