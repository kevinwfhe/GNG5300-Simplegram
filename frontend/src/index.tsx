import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import { ThemeProvider } from "./components";
import "@shopify/polaris/build/esm/styles.css";
import "./index.scss";

const client = new ApolloClient({
  uri: "http://127.0.0.1:8000/graphql",
  credentials: 'include',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AppProvider i18n={enTranslations}>
        <ThemeProvider
          theme={{
            colorScheme: "light",
          }}
        >
          <App />
        </ThemeProvider>
      </AppProvider>
    </ApolloProvider>
    ,
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
