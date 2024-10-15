import {TFile} from "obsidian";
import ListArchitect from "../index";

enum listType {
    UNORDERED,
    ORDERED,
    NONE
}

export class List {

    plugin: ListArchitect;
    content: string[] = [];

    constructor( plugin: ListArchitect, file: TFile ) {
        this.content = plugin.app.vault.read(file).then((content) => content.split("\n"));
    }



}