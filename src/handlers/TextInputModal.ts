import ListArchitect from "../index";
import {ButtonComponent, DropdownComponent, Modal, TextAreaComponent, TextComponent} from "obsidian";
import {Task} from "../architect/List";
import {ListType} from "../architect/List";

export enum EditMode {
    modify,
    add
}




export class TextInputModal extends Modal {
    inputText: string = '';
    plugin: ListArchitect;
    private mode: EditMode;
    public activeTask: Task = {
        raw: "",
        formatted: "",
        type: ListType.CHECKBOX,
        lineNumber: -1,
        heading: null
    };
    private callback: Function;

    constructor(plugin: ListArchitect) {
        super(plugin.app);
        this.plugin = plugin;
    }

    public enableModificationMode( task: Task ) {
        this.mode = EditMode.modify;
        this.activeTask = task;
        this.inputText = task.formatted;
        return this;
    }

    public enableAdditionMode( ) {
        this.mode = EditMode.add;
        this.activeTask = {
            raw: "",
            formatted: "",
            type: ListType.CHECKBOX,
            lineNumber: this.plugin.architect.activeList.noHeadingTasks()[this.plugin.architect.activeList.noHeadingTasks().length - 1].lineNumber + 1,
            heading: null
        }
        return this;
    }

    public setCallback( fn: Function ) {
        this.callback = fn;
        return this;
    }

    onOpen() {
        // Create a text input field
        if (this.plugin.architect.activeList.headings.length > 0) {
            const headerDropdown = new DropdownComponent(this.contentEl);
            headerDropdown.addOption("", "No header");
            for (let header of this.plugin.architect.activeList.headings) {
                headerDropdown.addOption(header.raw, header.raw);
            }
            headerDropdown.onChange(value => {
                if (value === "") {
                    this.activeTask.heading = null;
                    this.activeTask.lineNumber = this.plugin.architect.activeList.noHeadingTasks()[this.plugin.architect.activeList.noHeadingTasks().length - 1].lineNumber + 1;
                }
                else {
                    this.activeTask.heading = this.plugin.architect.activeList.headings.filter(heading => heading.raw = value)[0];
                    this.activeTask.lineNumber = this.activeTask.heading.lineNumber + this.activeTask.heading.children.length + 1;
                }
            });
        }

        const dropdown =
            new DropdownComponent(this.contentEl)
                .addOption(ListType.CHECKBOX, "checkbox")
                .addOption(ListType.UNORDERED, "unordered list")
                .addOption(ListType.ORDERED, "ordered list")
                .addOption(ListType.NONE, "none")

        dropdown.onChange((value: ListType) => this.activeTask.type = value)

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
            this.callback(this.plugin, { ...this.activeTask, raw: this.inputText });
            this.close(); // Close the modal after submission
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
