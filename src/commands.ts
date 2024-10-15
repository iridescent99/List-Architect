
export function addCommands( ) {

    this.addCommand({
        id: 'modify-list',
        name: 'Modify a list',
        callback: async () => {
           this.fuzzySuggester.create_new_note_from_template()
        }
    });


}