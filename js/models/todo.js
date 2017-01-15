define([
    'underscore',
    'backbone',
    'backbone-nested'
], function (_, Backbone, BackboneNested) {
    'use strict';

    var Todo = Backbone.NestedModel.extend({
        // default attributes: 
        defaults: {
            title: '',
            complete: false
        },
        // Toogle the complete state of the todo
        toggle: function () {
            this.save({
                complete: !this.get('complete')
            });
        },
        // meta data about the object
        meta: {}
    });

    Object.defineProperty(Todo.prototype.meta, 'className', {
        value: 'Todo'
    });

    return Todo;

});


