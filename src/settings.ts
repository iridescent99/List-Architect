import {PluginSettingTab, App, Setting} from "obsidian";
import {ListConfiguration} from "./index";
import ListArchitect from "./index";

export class ListArchitectSettingsTab extends PluginSettingTab {

    plugin: ListArchitect;
    configContainer: HTMLElement;

    constructor(app: App, plugin: ListArchitect) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        this.containerEl.empty();
        this.containerEl.createEl('h1', {text:'List Architect'});
        this.configContainer = this.containerEl.createDiv({cls: "list-config-container"});
        new Setting(this.containerEl).setName("List locations").setHeading();

        this.plugin.settings.lists.forEach((list, index) => {
            const s = new Setting(this.containerEl)
                .addSearch((cb) => {
                    new FileSuggest(cb.inputEl, this.plugin, )
            })
        })

    }

    addListConfigItem( list?: ListConfiguration ) {
        const container = this.configContainer.createDiv({ cls: "list-config-item" });
        new Setting(this.configContainer)
            .addSearch((cb) => {
                new FileSugges
            })
        container.createEl("button", { text: "+" });
    }

    addArraySetting(settingTitle: string, settingReference: string, description = "") {
        const { containerEl } = this;
        const settingContainer = containerEl.createDiv()
        settingContainer.createEl('h6', {text:settingTitle})
        settingContainer.createDiv({text: description})
        // @ts-ignore
        this.plugin.settings[settingReference].forEach(value => {
            this.addTextField(settingContainer, settingReference, value);
        })
        const addFieldButton = containerEl.createEl('button', { text: 'Add'})
        addFieldButton.addEventListener('click', () => {
            this.addTextField(settingContainer, settingReference);
        })

    }

    addTextField(containerEl: HTMLElement, reference: string, value='') {
        const wrapper = containerEl.createDiv()
        containerEl.insertBefore(wrapper, containerEl.children[containerEl.children.length-1])
        const textInput = wrapper.createEl('input');
        textInput.type = 'text';
        textInput.value = value;
        textInput.className = reference;

        const removeButton = wrapper.createEl('button', {
            text: 'Remove'
        })
        removeButton.addEventListener('click', () => {
            wrapper.remove();
            const textValues = Array.from(containerEl.querySelectorAll(`.${reference}`)).map((el: HTMLInputElement) => el.value);
            // @ts-ignore
            this.plugin.settings[reference] = textValues;
            this.plugin.saveSettings()
        });

        textInput.addEventListener('input', () => {
            this.saveMultipleTextValues(containerEl, reference)
        })
    }

    saveMultipleTextValues(containerEl: HTMLElement, reference: string) {
        // @ts-ignore
        const textValues = Array.from(containerEl.querySelectorAll(`.${reference}`)).map((el: HTMLInputElement) => el.value);
        // @ts-ignore
        this.plugin.settings[reference] = textValues;
        this.plugin.saveSettings();
    }
}