import ListArchitect from "../index";
import {Modal, TFile} from "obsidian";
import {ACTION} from "../handlers/ActionSuggester";
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
        this.textInputModal.callback = this.processAddition;
        this.textInputModal.open();
    }


    public processAddition( plugin: ListArchitect, task: string ) {
        // if (this.activeList.headings.length > 0) {
        //
        // } else {
        plugin.architect.activeList.addItem( task )
        // }
    }




}