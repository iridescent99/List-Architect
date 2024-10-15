import ListArchitect from "../index";
import {ButtonComponent, Modal, TextAreaComponent, TextComponent} from "obsidian";

export class TextInputModal extends Modal {
    inputText: string = '';
    plugin: ListArchitect;
    callback: (plugin: ListArchitect, input: string) => void;

    constructor(plugin: ListArchitect) {
        super(plugin.app);
        this.plugin = plugin;
    }

    onOpen() {
        // Add a title to the modal
        this.contentEl.createEl('h2', { text: 'Enter your text' });

        // Create a text input field
        const input = new TextAreaComponent(this.contentEl);
        input.inputEl.style.width = '100%';
        input.setPlaceholder('Type something in markdown..');

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
