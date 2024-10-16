import ListArchitect from "../index";
import {Modal, TFile} from "obsidian";
import {TextInputModal} from "../handlers/TextInputModal";
import {List, Task} from "./List";


export class Architect {

    plugin: ListArchitect;
    activeList: List;
    textInputModal: TextInputModal;
    automaticDetection: boolean = false;

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
            .enableDeleteTaskMode( this.activeList.tasks )
            .setCallback(this.processDeletion)
            .start();
    }

    public checkTask() {
        this.plugin.fuzzySuggester
            .enableCheckTaskMode( this.activeList.tasks )
            .setCallback(this.processCheck)
            .start();
    }

    public modifyTask() {
        this.plugin.fuzzySuggester
            .enableModifyTaskMode( this.activeList.tasks )
            .setCallback(( plugin: ListArchitect, task: Task) => {
                this.textInputModal
                    .enableModificationMode( task )
                    .setCallback(this.processModification)
                    .open()
            })
            .start();
    }

    public processAddition( plugin: ListArchitect, task: Task ) {
        plugin.architect.activeList.addItem( task )
    }

    public processDeletion( plugin: ListArchitect, task: Task ) {
        plugin.architect.activeList.deleteItem( task )
    }

    public processModification( plugin: ListArchitect, task: Task ) {
        console.log(task)
        plugin.architect.activeList.modifyItem(task)
    }

    public processCheck( plugin: ListArchitect, task: Task ) {
        plugin.architect.activeList.checkItem(task);
    }

}