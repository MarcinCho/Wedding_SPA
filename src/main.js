import { createApp } from "vue";
import App from "./App.vue"; // Import the main root component
import "./style.css"; // Import global styles
import CountdownComp from "./components/CountdownComp.vue";

const app = createApp(App);

app.component("CountdownComp", CountdownComp);

app.mount("#app");
