import ListArchitect from "../index";
import {Modal, TFile} from "obsidian";
import {ACTION} from "../handlers/ActionSuggester";
import {TextInputModal} from "../handlers/TextInputModal";
import {List} from "./List";


export class Architect {

    plugin: ListArchitect;
    activeList: List;
    mode: ACTION;
    textInputModal: TextInputModal;
    content: string[];

    constructor( plugin: ListArchitect ) {
        this.plugin = plugin;
        this.textInputModal = new TextInputModal(this.plugin);
    }

    public activateList( file: TFile ){
        this.activeList = new List(file);
        // TODO: Read tasks
    }

    public addTask() {
        this.textInputModal.callback = this.processAddition;
        this.textInputModal.open();
    }

    public processAddition() {

    }




}