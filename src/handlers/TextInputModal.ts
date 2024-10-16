import ListArchitect from "../index";
import {ButtonComponent, Modal, TextAreaComponent, TextComponent} from "obsidian";

export enum EditMode {
    modify,
    add
}

export class TextInputModal extends Modal {
    inputText: string = '';
    plugin: ListArchitect;
    private mode: EditMode;
    private callback: Function;

    constructor(plugin: ListArchitect) {
        super(plugin.app);
        this.plugin = plugin;
    }

    public enableModificationMode( task: string ) {
        this.mode = EditMode.modify;
        this.inputText = task;
        return this;
    }

    public enableAdditionMode() {
        this.mode = EditMode.add;
        return this;
    }

    public setCallback( fn: Function ) {
        this.callback = fn;
        return this;
    }

    onOpen() {
        // Add a title to the modal
        this.contentEl.createEl('h2', { text: 'Enter your text' });

        // Create a text input field
        const input = new TextAreaComponent(this.contentEl);
        input.inputEl.style.width = '100%';
        if (this.mode === EditMode.add) input.setPlaceholder('Type something in markdown..');
        if (this.mode === EditMode.modify) input.setValue(this.inputText);

        // Handle text input changes
        input.onChange(value => {
            this.inputText = value;
        });

        // Create a submit button
        const submitButton = new ButtonComponent(this.contentEl);
        submitButton.setButtonText('Submit');
        submitButton.onClick(() => {
            // Call the callback with the input text
            this.callback(this.plugin, this.inputText);
            this.close(); // Close the modal after submission
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
