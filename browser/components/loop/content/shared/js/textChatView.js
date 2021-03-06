/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

var loop = loop || {};
loop.shared = loop.shared || {};
loop.shared.views = loop.shared.views || {};
loop.shared.views.TextChatView = (function(mozl10n) {
  var sharedActions = loop.shared.actions;
  var CHAT_MESSAGE_TYPES = loop.store.CHAT_MESSAGE_TYPES;
  var CHAT_CONTENT_TYPES = loop.store.CHAT_CONTENT_TYPES;

  /**
   * Renders an individual entry for the text chat entries view.
   */
  var TextChatEntry = React.createClass({displayName: "TextChatEntry",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
      message: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired
    },

    render: function() {
      var classes = React.addons.classSet({
        "text-chat-entry": true,
        "received": this.props.type === CHAT_MESSAGE_TYPES.RECEIVED
      });

      return (
        React.createElement("div", {className: classes}, 
          this.props.message
        )
      );
    }
  });

  /**
   * Manages the text entries in the chat entries view. This is split out from
   * TextChatView so that scrolling can be managed more efficiently - this
   * component only updates when the message list is changed.
   */
  var TextChatEntriesView = React.createClass({displayName: "TextChatEntriesView",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
      messageList: React.PropTypes.array.isRequired
    },

    componentWillUpdate: function() {
      var node = this.getDOMNode();
      // Scroll only if we're right at the bottom of the display.
      this.shouldScroll = node.scrollHeight === node.scrollTop + node.clientHeight;
    },

    componentDidUpdate: function() {
      if (this.shouldScroll) {
        // This ensures the paint is complete.
        window.requestAnimationFrame(function() {
          var node = this.getDOMNode();
          node.scrollTop = node.scrollHeight - node.clientHeight;
        }.bind(this));
      }
    },

    render: function() {
      return (
        React.createElement("div", {className: "text-chat-entries"}, 
          
            this.props.messageList.map(function(entry, i) {
              return (
                React.createElement(TextChatEntry, {key: i, 
                               message: entry.message, 
                               type: entry.type})
              );
            }, this)
          
        )
      );
    }
  });

  /**
   * Displays the text chat view. This includes the text chat messages as well
   * as a field for entering new messages.
   */
  var TextChatView = React.createClass({displayName: "TextChatView",
    mixins: [
      React.addons.LinkedStateMixin,
      loop.store.StoreMixin("textChatStore")
    ],

    propTypes: {
      dispatcher: React.PropTypes.instanceOf(loop.Dispatcher).isRequired
    },

    getInitialState: function() {
      return _.extend({
        messageDetail: ""
      }, this.getStoreState());
    },

    /**
     * Handles a key being pressed - looking for the return key for submitting
     * the form.
     *
     * @param {Object} event The DOM event.
     */
    handleKeyDown: function(event) {
      if (event.which === 13) {
        this.handleFormSubmit(event);
      }
    },

    /**
     * Handles submitting of the form - dispatches a send text chat message.
     *
     * @param {Object} event The DOM event.
     */
    handleFormSubmit: function(event) {
      event.preventDefault();

      this.props.dispatcher.dispatch(new sharedActions.SendTextChatMessage({
        contentType: CHAT_CONTENT_TYPES.TEXT,
        message: this.state.messageDetail
      }));

      // Reset the form to empty, ready for the next message.
      this.setState({ messageDetail: "" });
    },

    render: function() {
      if (!this.state.textChatEnabled) {
        return null;
      }

      return (
        React.createElement("div", {className: "text-chat-view"}, 
          React.createElement(TextChatEntriesView, {messageList: this.state.messageList}), 
          React.createElement("div", {className: "text-chat-box"}, 
            React.createElement("form", {onSubmit: this.handleFormSubmit}, 
              React.createElement("input", {type: "text", 
                     onKeyDown: this.handleKeyDown, 
                     valueLink: this.linkState("messageDetail")})
            )
          )
        )
      );
    }
  });

  return TextChatView;
})(navigator.mozL10n || document.mozL10n);
