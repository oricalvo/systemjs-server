import * as React from "react";
import Component = React.Component;

interface CounterProps {
    counter: number;
}

export class Counter extends Component<CounterProps, {}> {
    render() {
        return <span>{this.props.counter}</span>;
    }
}