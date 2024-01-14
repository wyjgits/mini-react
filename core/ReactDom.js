import React from './React.js';
function createRoot(container) {
  return {
    render(App) {
      React.render(App, container);
    }
  }
}

export default {
  createRoot
}