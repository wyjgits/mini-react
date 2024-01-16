import React from './React'
function createRoot(container) {
  return {
    render(App) {
      React.render(App, container)
    }
  }
}
export default {
  createRoot
}