import ReactDom from "./core/ReactDom";
import App from "./App";

console.log(App)
ReactDom.createRoot(document.querySelector('#app')).render(App);

