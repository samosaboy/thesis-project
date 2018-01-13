import * as React from "react";
import * as style from "./style.css";
import { RouteComponentProps } from "react-router";

export namespace App {
  export interface Props extends RouteComponentProps<void> {
  }

  export interface State {
    /* empty */
  }
}

export class App extends React.Component<App.Props, App.State> {
  render() {
    const { children } = this.props;
    return (
      <div>
        Test!
      </div>
    );
  }
}
