var app = app || {};

(function() {
    'use strict';

    var KEYS = app.const.KEYS;

    /**
     * Associates with an individual todo.
     */
    app.TodoView = Backbone.View.extend({
        tagName: 'li',
        // cache the template function for a single todo
        // template: _.template( $('#item-template').html() ),
        template: Handlebars.compile( $('#item-template').html() ),
        events: {
            'dblclick label': 'edit',
            'touchend label': 'edit',
            'blur .edit': 'close',
            'click .destroy': 'clear',
            'keypress .edit': 'updateOnEnter',
            // 'keydown .edit': 'revertOnEscape',
            'click .toggle': 'toggleComplete'
        },
        // listen for changes on the model
        // re-renders immediately
        initialize: function() {
            // prefer `listenTo()` over `on()` in order to track events and remove events if needed
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.toggleVisible); // custom event
        },
        // render the todo title
        render: function() {
            // ???
            // Backbone LocalStorage is adding `id` attribute instantly after
			// creating a model.  This causes our TodoView to render twice. Once
			// after creating a model and once on `id` change.  We want to
			// filter out the second redundant render, which is caused by this
			// `id` change.  It's known Backbone LocalStorage bug, therefore
			// we've to create a workaround.
			// https://github.com/tastejs/todomvc/issues/469
            // ???
            if (this.model.changed.id !== undefined) {
                return;
            }

            this.$el.html(this.template(this.model.attributes)); // or this.model.toJSON(); -- which is more costly?

            // if the todo is marked complete, add the complete style
            this.$el.toggleClass('complete', this.model.get('complete'));
            this.toggleVisible();
            this.$input = this.$('.edit');
            return this;
        },
        // update the styling and focus on the elem
        edit: function() {
            this.$el.addClass('editing');
            this.$input.focus();
        },
        // Save updates to the todo
        // remove editing styles
        close: function() {
            var value = this.$input.val().trim();
            // ??? read
            // We don't want to handle blur events from an item that is no
            // longer being edited. Relying on the CSS class here has the
            // benefit of us not having to maintain state in the DOM and the
            // JavaScript logic.
            if (!this.$el.hasClass('editing')) {
                return;
            }

            if (value) {
                this.model.save({
                    title: value
                });
            } else {
                this.clear();
            }

            this.$el.removeClass('editing');
        },
        // close the todo
        updateOnEnter: function(event) {
            if (event.which === KEYS.ENTER_KEY) this.close();
        },
        // Toggle the complete state of the model
        toggleComplete: function () {
            this.model.toggle();
        },
        // If marked hidden, add toggle the hidden style
        toggleVisible: function() {
            this.$el.toggleClass('hidden', this.isHidden());
        },
        // Determine if the todo should be hidden.
        isHidden: function() {
            var isComplete = this.model.get('complete');

            return isComplete ? app.TodoFilter === 'active' : app.TodoFilter === 'complete';
        },
        // Removes the todo, destroys the model in the db, and removes it from the view.
        clear: function() {
            this.model.destroy();
        },
        //??? new
        // If you're pressing `escape` we revert your change by simply leaving
		// the `editing` state.
        // revertOnEscape: function (e) {
        // if (e.which === ESC_KEY) {
        // this.$el.removeClass('editing');
        // // Also reset the hidden input back to the original value.
        // this.$input.val(this.model.get('title'));
        // }
        // },
        //??? new
        // meta data about the object
        meta: {}
    });

    Object.defineProperty(app.TodoView.prototype.meta, 'className', {
        value: 'TodoView'
    });

})();
