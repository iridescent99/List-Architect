import { FuzzySuggestModal, TFile, TFolder, normalizePath } from "obsidian";
import ListArchitect, {ListConfiguration} from "../index";
import {errorWrapperSync} from "../utils/Error";
import {log_error} from "../utils/Log";

export enum OpenMode {
    selectNote,
    deleteTask,
    modifyTask,
}

export class FuzzySuggester extends FuzzySuggestModal<TFile|string> {
    public plugin: ListArchitect;
    private openMode: OpenMode = OpenMode.selectNote;
    private creation_folder: TFolder | undefined;
    private tasks: string[] = [];
    public callback: ( plugin: ListArchitect, task: string, index?: number ) => void;

    constructor(plugin: ListArchitect) {
        super(plugin.app);
        this.plugin = plugin;
        this.setPlaceholder("Type name of a list...");
    }

    getItems(): TFile[]|string[] {
        let items: TFile[]|string[] = [];
        if (this.openMode === OpenMode.selectNote) {
            items = errorWrapperSync(
                () => this.plugin.tools.getFiles([...this.plugin.settings.lists.map((list: ListConfiguration) => list.path), ...this.plugin.settings.folders]),
                `No list locations configured`
            );
        } else {
            return this.tasks;
        }
        return items || [];
    }

    getItemText(item: TFile|string): string {
        return item instanceof TFile ? item.basename : item;
    }

    onChooseItem( item: TFile|string ): void {
        if (this.openMode === OpenMode.selectNote && item instanceof TFile) {
            this.plugin.architect.activateList(item as TFile);
            this.plugin.actionSuggester.open()
        } else if (this.openMode === OpenMode.deleteTask) {
            this.callback( this.plugin, item as string );
        } else if (this.openMode === OpenMode.modifyTask) {
            this.callback( this.plugin, item as string, this.plugin.architect.activeList.content.indexOf(item as string) )
        }
    }

    start(): void {
        try {
            this.open();
        } catch (e) {
            log_error(e);
        }
    }

    public enableDeleteTaskMode( tasks: string[] ) {
        this.openMode = OpenMode.deleteTask;
        this.setPlaceholder("Type a task..")
        this.tasks = tasks.filter((task) => task !== "");
        return this;
    }

    public enableModifyTaskMode( tasks: string[] ) {
        this.openMode = OpenMode.modifyTask;
        this.setPlaceholder("Type a task..")
        this.tasks = tasks.filter((task) => task !== "");
        return this;
    }

    public setCallback( fn: ( plugin: ListArchitect, task: string, index?: number ) => void ) {
        this.callback = fn;
        return this;
    }

    public enableNoteMode() {
        this.openMode = OpenMode.selectNote;
    }

    create_new_note_from_template(folder?: TFolder): void {
        this.creation_folder = folder;
        this.start();
    }
}