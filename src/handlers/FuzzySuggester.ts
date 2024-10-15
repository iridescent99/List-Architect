import { FuzzySuggestModal, TFile, TFolder, normalizePath } from "obsidian";
import ListArchitect, {ListConfiguration} from "../index";
import {errorWrapperSync} from "../utils/Error";
import {log_error} from "../utils/Log";

export enum OpenMode {
    SelectNote,
    SelectHeading,
}

export class FuzzySuggester extends FuzzySuggestModal<TFile> {
    private plugin: ListArchitect;
    private open_mode: OpenMode;
    private creation_folder: TFolder | undefined;

    constructor(plugin: ListArchitect) {
        super(plugin.app);
        this.plugin = plugin;
        this.setPlaceholder("Type name of a list...");
    }

    getItems(): TFile[] {
        const files = errorWrapperSync(
            () => this.plugin.tools.getFiles([...this.plugin.settings.lists.map((list: ListConfiguration) => list.path), ...this.plugin.settings.folders]),
            `No list locations configured`
        );
        if (!files) {
            return [];
        }
        return files;
    }

    getItemText(item: TFile): string {
        return item.basename
    }

    onChooseItem(item: TFile): void {
        this.plugin.architect.activateList(item);
        this.plugin.actionSuggester.open()
    }

    start(): void {
        try {
            this.open();
        } catch (e) {
            log_error(e);
        }
    }

    create_new_note_from_template(folder?: TFolder): void {
        this.creation_folder = folder;
        this.start();
    }
}