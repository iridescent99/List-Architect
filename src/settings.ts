import {PluginSettingTab, App, Setting} from "obsidian";
import {ListConfiguration} from "./index";
import ListArchitect from "./index";
import {FileSuggest} from "./suggesters/FileSuggester";
import {FolderSuggest} from "./suggesters/FolderSuggester";

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
        new Setting(this.containerEl)
            .setName("List locations")
            .setHeading()
            .setDesc("Here individual file locations can be added that one wants to include.");

        const s = this.containerEl.createDiv()
        this.plugin.settings.lists.forEach((list, index) => {
            new Setting(s)
                .addSearch((cb) => {
                    new FileSuggest(cb.inputEl, this.plugin);
                    cb.setPlaceholder("Example: folderA/list.md")
                        .setValue(list.path)
                        .onChange((path: string) => {
                            this.plugin.settings.lists[index].path = path;
                            this.plugin.saveSettings();
                        })})
                .addExtraButton((cb) => {
                    cb.setIcon("cross")
                        .setTooltip("Delete")
                        .onClick(() => {
                            this.plugin.settings.lists.splice(
                                index,
                                1
                            );
                            this.plugin.saveSettings();
                            this.display();
                        });
                });
        });
        new Setting(this.containerEl).addButton((cb) => {
            cb.setButtonText("Add list location")
                .onClick(() => {
                    this.plugin.settings.lists.push({path: "Example/new_list.md"});
                    this.plugin.saveSettings();
                    this.display();
            })
        });

        new Setting(this.containerEl)
            .setName("List folder")
            .setDesc("Any file within the selected folder will be regarded as a list.");

        this.plugin.settings.folders.forEach((folder, index) => {
            const s = new Setting(this.containerEl)
                .addSearch((cb) => {
                    new FolderSuggest(cb.inputEl);
                    cb.setPlaceholder("Example: folderA/folderB")
                        .setValue(folder)
                        .onChange((path: string) => {
                            this.plugin.settings.folders[index] = path;
                            this.plugin.saveSettings();
                        })})
                .addExtraButton((cb) => {
                    cb.setIcon("cross")
                        .setTooltip("Delete")
                        .onClick(() => {
                            this.plugin.settings.folders.splice(
                                index,
                                1
                            );
                            this.plugin.saveSettings();
                            this.display();
                        });
                });
        })

        new Setting(this.containerEl)
            .addButton((cb) => {
            cb.setButtonText("Add folder")
                .onClick(() => {
                    this.plugin.settings.folders.push("Examplefolder");
                    this.plugin.saveSettings();
                    this.display();
                })
        });

        new Setting(this.containerEl)
            .setName("Automatic detection")
            .setHeading()
            .setDesc("When turned on, the plugin will automatically detect files that contain tasks and the settings above will be ignored.")
            .addToggle((cb) => {
                cb.onChange((value) => this.plugin.architect.automaticDetection = value)
            });
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