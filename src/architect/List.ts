import {TFile} from "obsidian";
import ListArchitect from "../index";

enum listType {
    UNORDERED,
    ORDERED,
    NONE
}



export class List {

    plugin: ListArchitect;
    file: TFile;
    content: string[] = [];
    headings: string[] = [];

    constructor( plugin: ListArchitect, file: TFile ) {
        this.plugin = plugin;
        this.file = file;
        return this;
    }

    async initialize() {
        this.content = await this.plugin.app.vault.read(this.file).then((content) => content.split("\n"));
        for (let line of this.content) {
            if (line.startsWith("#")) this.headings.push(line);
        }
    }

    public addItem( task: string ) {
        this.content.push(task);
        this.saveContent();
    }

    public deleteItem( task: string ) {
        this.content = this.content.filter((line: string) => line !== task);
        this.saveContent();
    }

    public modifyItem( task: string, index: number ) {
        console.log(task, index)
        this.content.splice(index, 1, task);
        this.saveContent();
    }

    private async saveContent() {
        await this.plugin.app.vault.modify(this.file, this.content.join("\n"));
    }

}