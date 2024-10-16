import { FuzzySuggestModal, TFile, TFolder, normalizePath } from "obsidian";
import ListArchitect, {ListConfiguration} from "../index";
import {errorWrapperSync} from "../utils/Error";
import {log_error} from "../utils/Log";
import {Task} from "../architect/List";

export enum OpenMode {
    selectNote,
    deleteTask,
    modifyTask,
    checkTask
}

export class FuzzySuggester extends FuzzySuggestModal<TFile|Task> {
    public plugin: ListArchitect;
    private openMode: OpenMode = OpenMode.selectNote;
    private creation_folder: TFolder | undefined;
    private tasks: Task[] = [];
    public callback: ( plugin: ListArchitect, task?: Task ) => void;

    constructor(plugin: ListArchitect) {
        super(plugin.app);
        this.plugin = plugin;
        this.setPlaceholder("Type name of a list...");
    }

    getItems(): TFile[]|Task[] {
        let items: TFile[]|Task[] = [];
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

    getItemText(item: TFile|Task): string {
        return item instanceof TFile ? item.basename : item.formatted;
    }

    onChooseItem( item: TFile|Task ): void {
        if (this.openMode === OpenMode.selectNote && item instanceof TFile) {
            this.plugin.architect.activateList(item as TFile);
            this.plugin.actionSuggester.open()
        } else if (this.openMode === OpenMode.deleteTask) {
            this.callback( this.plugin, item as Task );
        } else if (this.openMode === OpenMode.modifyTask) {
            this.callback( this.plugin, item as Task )
        } else if (this.openMode === OpenMode.checkTask) {
            this.callback( this.plugin, item as Task )
        }
    }

    start(): void {
        try {
            this.open();
        } catch (e) {
            log_error(e);
        }
    }

    public enableDeleteTaskMode( tasks: Task[] ) {
        this.openMode = OpenMode.deleteTask;
        this.setPlaceholder("Type a task..")
        this.tasks = tasks;
        return this;
    }

    public enableModifyTaskMode( tasks: Task[] ) {
        this.openMode = OpenMode.modifyTask;
        this.setPlaceholder("Type a task..")
        this.tasks = tasks;
        return this;
    }

    public enableCheckTaskMode( tasks: Task[] ) {
        this.openMode = OpenMode.checkTask;
        this.setPlaceholder("Type a task..")
        this.tasks = tasks;
        return this;
    }

    public setCallback( fn: ( plugin: ListArchitect, task: Task ) => void ) {
        this.callback = fn;
        return this;
    }

    public enableNoteMode() {
        this.openMode = OpenMode.selectNote;
    }

    create_new_note_from_template(folder?: TFolder): void {
        this.creation_folder = folder;
        this.openMode = OpenMode.selectNote;
        this.start();
    }
}