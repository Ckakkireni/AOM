import React, { Component } from "react";
import { WebView } from "react-native-webview";

export default class MyWebView extends Component {
    webview = null;
  
    render() {
      return (
        <WebView
          ref={(ref) => (this.webview = ref)}
          source={{ uri: 'https://aomhrdcdev001.carcgl.com:8444/OauthService/saml/login?redirectTo=https://aomhrdcdev001.carcgl.com:8444/OauthRestDoc&domain=cib&client_id=Q2hhbmRyYUFPTQ==&client_secret=OWQ3YTFhZGMtYWMwNS00ZTUxLTk4NGYtYTAzOWRkMTRiOWM3&appId=NWVmYjI1NDItYWRiYy00NTA1LTlmNTQtNGU0NzgzNGIzZTBl' }}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
        />
      );
    }
  
    handleWebViewNavigationStateChange = (newNavState) => {
      // newNavState looks something like this:
      // {
      //   url?: string;
      //   title?: string;
      //   loading?: boolean;
      //   canGoBack?: boolean;
      //   canGoForward?: boolean;
      // }

      console.log(newNavState);
      
      const { url } = newNavState;
      if (!url) return;
  
      console.log("url :", url);

      // handle certain doctypes
      if (url.includes('.pdf')) {
        this.webview.stopLoading();
        // open a modal with the PDF viewer
      }
  
      // one way to handle a successful form submit is via query strings
      if (url.includes('?message=success')) {
        this.webview.stopLoading();
        // maybe close this view?
      }
  
      // one way to handle errors is via query string
      if (url.includes('?errors=true')) {
        this.webview.stopLoading();
      }
  
      // redirect somewhere else
      if (url.includes('google.com')) {
        const newURL = 'https://reactnative.dev/';
        const redirectTo = 'window.location = "' + newURL + '"';
        this.webview.injectJavaScript(redirectTo);
      }
    };
  }