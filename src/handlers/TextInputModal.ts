import ListArchitect from "../index";
import {ButtonComponent, Modal, TextComponent} from "obsidian";

export class TextInputModal extends Modal {
    inputText: string = '';
    callback: (input: string) => void;

    constructor(plugin: ListArchitect) {
        super(plugin.app);
    }

    onOpen() {
        // Add a title to the modal
        this.contentEl.createEl('h2', { text: 'Enter your text' });

        // Create a text input field
        const input = new TextComponent(this.contentEl);
        input.inputEl.style.width = '100%';
        input.setPlaceholder('Type something...');

        // Handle text input changes
        input.onChange(value => {
            this.inputText = value;
        });

        // Create a submit button
        const submitButton = new ButtonComponent(this.contentEl);
        submitButton.setButtonText('Submit');
        submitButton.onClick(() => {
            // Call the callback with the input text
            this.callback(this.inputText);
            this.close(); // Close the modal after submission
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
