import * as React from "react";
import {Counter} from "./Counter";
import {appStore, AppState} from "./appStore";
import Component = React.Component;

export class App extends Component<{}, AppState> {

    constructor() {
        super();

        this.state = appStore.getState();

        appStore.subscribe(()=> {
            this.setState(appStore.getState());
        });
    }

    inc() {
        appStore.dispatch({
            type: "INC"
        });
    }

    render() {
        return <div>
            <h1>React App!</h1>
            <Counter counter={appStore.getState().counter} />
            <button onClick={()=>this.inc()}>Inc</button>
        </div>;
    }
}