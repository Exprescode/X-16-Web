import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import Vue from "vue";
import VueApollo from "vue-apollo";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

const httpLink = new HttpLink({
  uri: "https://chat.lukeng.io:80/query "
});

const wsLink = new WebSocketLink({
  uri: "wss://chat.lukeng.io:80/query",
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.use(VueApollo);

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
