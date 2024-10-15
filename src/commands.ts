
export function addCommands( ) {

    this.addCommand({
        id: 'add-list-item',
        name: 'Add list item',
        callback: async () => {
           this.fuzzySuggester.create_new_note_from_template()
        }
    });


}