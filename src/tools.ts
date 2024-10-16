import ListArchitect from "./index";
import {List} from "./list";
import {TFile} from "obsidian";


export class Tools {

    private plugin: ListArchitect;

    constructor( plugin: ListArchitect ) {
        this.plugin = plugin;
    }

    public getFiles( suffixes: string[] = [] ) {
        return this.plugin.app.vault.getFiles()
            .filter((file: TFile) => {
                for (let suffix of suffixes) {
                    if ((file.path.toLowerCase() === suffix.toLowerCase()) || file.path.toLowerCase().includes(suffix.toLowerCase())) return true
                }
                return false;
            });
    }

    public getTaskFiles() {

    }

}