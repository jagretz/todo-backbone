var app = app || {};

(function() {
    'use strict';

    var Todos = Backbone.Collection.extend({
        // Reference to this collections model
        model: app.Todo,
        localStorage: new Backbone.LocalStorage('todos'),
        // filter down to a list of todos marked complete
        complete: function() {
            // return this.filter(function(todo) {
            //     return todo.get('complete');
            // });
            return this.where({completed: true});
        },
        // filter down to a list of todos that ARE NOT marked complete
        remaining: function() {
            // return this.without.apply(this, this.complete);
            return this.where({completed: false});
        },
        // todos are displayed in sequential order despite their UUID ordering within the db.
        // This generates the next order number for a new todo.
        nextOrder: function() {
            // if (!this.length) {
            //     return 1;
            // }
            // return this.last().get('order') + 1;
            return this.length ? this.last().get('order') + 1 : 1;
        },
        // sort todos by their original insertion order.
        // @see http://backbonejs.org/#Collection-comparator
        comparator: 'order',
        // meta data about the object
        meta: {}
    });

    Object.defineProperty(Todos.prototype.meta, 'className', {
        value: 'Todos'
    });

    app.todos = new Todos();

})();
