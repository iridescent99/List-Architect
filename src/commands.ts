
export function addCommands( ) {
    this.addRibbonIcon('dice', 'spaced repetition', async () => {
        await this.activateView();
    });

    this.addCommand({
        id: 'sync-cards-active-file',
        name: 'Sync cards in active file',
        callback: async () => {
            await initiateSync(this, 'file');
        }
    });

    this.addCommand({
        id: 'delete-card',
        name: 'Delete card',
        callback: async () => {
            new EnterIDModal(this.app).open();
        }
    });



    this.addCommand({
        id: 'open-reference-view',
        name: 'Open reference view',
        callback: async () => {
            await this.activateView();
        }
    });

    this.addCommand({
        id: 'rm-all-comments',
        name: 'Remove all comments',
        callback: async () => {
            try {

                new CommentModal(this.app).open();

            } catch (e) {
                console.log(e)
            }
        }
    });


    this.addCommand({
        id: 'reshape-reference',
        name: 'Reshape references',
        callback: async () => {
            try {

                const af = this.app.workspace.getActiveFile();
                await this.reshapeReference(af as TFile, this.app).then(async(newText) =>  await this.app.vault.modify(af as TFile, newText));

            } catch (e) {
                console.log(e)
            }
        }
    });
}