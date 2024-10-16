import {TFile} from "obsidian";
import ListArchitect from "../index";

export enum ListType {
    UNORDERED="unordered",
    ORDERED="ordered",
    CHECKBOX="checkbox",
    NONE="none"
}

export interface Task {
    raw: string;
    formatted: string;
    lineNumber: number;
    type: ListType;
    heading: Heading|null;
}

export interface Heading {
    raw: string;
    lineNumber: number;
    children: Task[];
}

export class List {

    plugin: ListArchitect;
    file: TFile;
    content: string[] = [];
    tasks: Task[] = [];
    headings: Heading[] = [];

    constructor( plugin: ListArchitect, file: TFile ) {
        this.plugin = plugin;
        this.file = file;
        return this;
    }

    async initialize() {
        this.content = await this.plugin.app.vault.read(this.file).then((content) => content.split("\n"));
        let activeHeading = null;
        for (let i = 0; i < this.content.length; i++) {
            if (/^#{1,6}\s+.*$/.test(this.content[i])) {
                if (activeHeading) this.headings.push(activeHeading);
                activeHeading = {
                    lineNumber: i,
                    raw: this.content[i],
                    children: []
                };
            }
            else if (this.content[i] !== "") {
                const task = {
                    raw: this.content[i],
                    formatted: this.content[i].replace(/^\s*(-\s*(\[ \]|\[x\])?|[0-9]+\.)\s+/, ''),
                    lineNumber: i,
                    type: this.detectListType(this.content[i]),
                    heading: activeHeading
                };
                this.tasks.push(task);
                if (activeHeading) { // @ts-ignore
                    activeHeading.children.push(task);
                }
            }
        }
        if (activeHeading) this.headings.push(activeHeading);
    }

    private detectListType( line: string ) {
        if (/^\s*-\s*(\[ \]|\[x\])/.test(line)) {
            return ListType.CHECKBOX;
        } else if (/^\s*[0-9]+\./.test(line)) {
            return ListType.ORDERED;
        } else if (/^\s*-\s*/.test(line)) {
            return ListType.UNORDERED
        }
        return ListType.NONE;
    }

    public computePrefix( task: Task ) {
        if (task.type === ListType.CHECKBOX) return "- [ ] ";
        if (task.type === ListType.ORDERED) return `${this.computeItemNumber(task)}. `;
        if (task.type === ListType.UNORDERED) return "- ";
        if (task.type === ListType.NONE) return "";
    }

    private computeItemNumber( task: Task ): number {
        if (!task.heading) {
            const taskIndex = this.tasks.indexOf(task);
            if (taskIndex === 0) return 1;
            const previousTask = taskIndex !== -1 ? this.tasks[taskIndex - 1] : this.noHeadingTasks()[this.noHeadingTasks().length - 1];
            if (previousTask.type === ListType.ORDERED) return parseInt(previousTask.raw[0]) + 1;
            return 1;
        }
        return task.heading.children.length + 1;
    }

    public noHeadingTasks() {
        return this.tasks.filter((task) => !task.heading);
    }

    public addItem( task: Task ) {
        this.content.splice(task.lineNumber, 0, `${this.computePrefix(task)}${task.raw}` );
        this.saveContent();
    }

    public deleteItem( task: Task ) {
        this.content.splice(task.lineNumber, 1);
        this.saveContent();
    }

    public checkItem( task: Task ) {
        this.content.splice(task.lineNumber, 1, task.raw.replace('[ ]', '[x]'))
        this.saveContent();
    }

    public modifyItem( task: Task ) {
        this.content.splice(task.lineNumber, 1, `${this.computePrefix(task)}${task.formatted}`);
        this.saveContent();
    }

    private async saveContent() {
        console.log(this.content)
        await this.plugin.app.vault.modify(this.file, this.content.join("\n"), {});
    }

}