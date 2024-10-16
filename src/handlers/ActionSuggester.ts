import {SuggestModal, TFile} from "obsidian";
import ListArchitect from "../index";

export enum ACTION {
    ADD="add",
    DELETE="delete",
    MODIFY="modify",
    CHECK="check"
}

export class ActionSuggester extends SuggestModal<any> {

    plugin: ListArchitect;

    constructor( plugin: ListArchitect ) {
        super(plugin.app);
        this.plugin = plugin;
    }

    onChooseSuggestion(item: any, evt: MouseEvent | KeyboardEvent) {
        if (item === ACTION.ADD) this.plugin.architect.addTask();
        if (item === ACTION.DELETE) this.plugin.architect.deleteTask();
        if (item === ACTION.MODIFY) this.plugin.architect.modifyTask();
        if (item === ACTION.CHECK) this.plugin.architect.checkTask();
    }

    renderSuggestion(action: string, el: HTMLElement) {
        el.createDiv({text: action})
    }

    getSuggestions(query: string): any[] | Promise<any[]> {
        return Object.values(ACTION).filter(action => action.toString().includes(query.toLowerCase()))
    }

}