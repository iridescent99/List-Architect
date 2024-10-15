import {Modal, SuggestModal, TFile} from "obsidian";
import ListArchitect from "../index";
import {ACTION} from "./ActionSuggester";

export class TaskModifier extends Modal {

    mode: ACTION;
    activeList: TFile;
    activeTask: string;

    constructor( plugin: ListArchitect ) {
        super(plugin.app);
    }

    onOpen() {
        this.contentEl.empty();
        switch (this.mode) {
            case ACTION.MODIFY:
                this.modifyMode();
                break;
            case ACTION.DELETE:
                this.deleteMode();
                break;
            case ACTION.ADD:
                this.addMode();
                break;
        }
    }

    private addMode() {
        const input = this.containerEl.createEl("input", { placeholder: "Type list item.." })
        input.addEventListener("change", (e) => {
            // @ts-ignore

        });
        input.focus();
    }

    private modifyMode() {

    }

    private deleteMode() {

    }

    onClose() {
        super.onClose();
    }


}