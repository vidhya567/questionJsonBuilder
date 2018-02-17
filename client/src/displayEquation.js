import React from 'react';
import MathJax from 'react-mathjax2';

export default class  DisplayEquation extends React.Component {

    constructor (props) {
        super(props);
    }

    render () {
        const asciiString = this.props.equationString;
        return (
            <div>
                <MathJax.Context input='ascii'>
                    <div>
                        <MathJax.Node>{asciiString}</MathJax.Node>
                    </div>
                </MathJax.Context>
            </div>
        );
    }
}