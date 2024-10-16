import ListArchitect from "../index";
import {Modal, TFile} from "obsidian";
import {TextInputModal} from "../handlers/TextInputModal";
import {List} from "./List";


export class Architect {

    plugin: ListArchitect;
    activeList: List;
    textInputModal: TextInputModal;

    constructor( plugin: ListArchitect ) {
        this.plugin = plugin;
        this.textInputModal = new TextInputModal(this.plugin);
    }

    public activateList( file: TFile ){
        this.activeList = new List(this.plugin, file);
        this.activeList.initialize();
    }

    public addTask( ) {
        this.textInputModal
            .enableAdditionMode()
            .setCallback(this.processAddition)
            .open();
    }

    public deleteTask() {
        this.plugin.fuzzySuggester
            .enableDeleteTaskMode( this.activeList.content )
            .setCallback(this.processDeletion)
            .start();
    }

    public modifyTask() {
        this.plugin.fuzzySuggester
            .enableModifyTaskMode( this.activeList.content )
            .setCallback(( plugin: ListArchitect, task: string, index: number ) => {
                this.textInputModal
                    .enableModificationMode( task )
                    .setCallback((plugin: ListArchitect, modifiedTask: string) => this.processModification(plugin, modifiedTask, index))
                    .open()
            })
            .start();
    }

    public processAddition( plugin: ListArchitect, task: string ) {
        plugin.architect.activeList.addItem( task )
    }

    public processDeletion( plugin: ListArchitect, task: string) {
        plugin.architect.activeList.deleteItem( task )
    }

    public processModification( plugin: ListArchitect, task: string, index: number ) {
        plugin.architect.activeList.modifyItem(task, index)
    }


}