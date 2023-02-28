import React from "react";
import {v4 as uuid} from 'uuid';
import Multiselect from "./Multiselect";

import './GuidGenerator.css';

const SeparatorTypes = {
    Newline: 0,
    Space: 1,
    Comma: 2,
    CommaSpace: 3,
    CommaNewline: 4,
};
const QuoteTypes = {
    None: 0,
    Single: 1, 
    Double: 2,
    Backtick: 3,
};
const PredefinedOutputTypes = {
    None: 0,
    Json: 1,
    JsonPretty2Space: 2,
    JsonPretty4Space: 3,
    JsonPrettyTabs: 4,
    MarkdownUnorderedList: 5,
    MarkdownOrderedList: 6,
    HtmlUnorderedList: 7,
    HtmlOrderedList: 8,
};
const JsonPredefinedOutputs = [
    PredefinedOutputTypes.Json,
    PredefinedOutputTypes.JsonPretty2Space,
    PredefinedOutputTypes.JsonPretty4Space,
    PredefinedOutputTypes.JsonPrettyTabs
];
const MarkdownPredefinedOutputs = [
    PredefinedOutputTypes.MarkdownUnorderedList,
    PredefinedOutputTypes.MarkdownOrderedList
];
const quoteOptions = [
    { value: QuoteTypes.None, text: 'None'},
    { value: QuoteTypes.Single, text: 'Single \''},
    { value: QuoteTypes.Double, text: 'Double "'},
    { value: QuoteTypes.Backtick, text: 'Backtick `'},
];
const separatorOptions = [
    { value: SeparatorTypes.Newline, text: "Newline '\\n'"},
    { value: SeparatorTypes.Space, text: "Space ' '"},
    { value: SeparatorTypes.Comma, text: "Comma ','"},
    { value: SeparatorTypes.CommaSpace, text: "Comma and Space ', '"},
    { value: SeparatorTypes.CommaNewline, text: "Comma and Newline',\\n'"},
];
const predefinedOptions = [
    { value: PredefinedOutputTypes.None, text: ''},
    { value: PredefinedOutputTypes.Json, text: 'JSON'},
    { value: PredefinedOutputTypes.JsonPretty2Space, text: 'JSON 2 space indent'},
    { value: PredefinedOutputTypes.JsonPretty4Space, text: 'JSON 4 space indent'},
    { value: PredefinedOutputTypes.JsonPrettyTabs, text: 'JSON tab indent'},
    { value: PredefinedOutputTypes.HtmlOrderedList, text: 'HTML Ordered List'},
    { value: PredefinedOutputTypes.HtmlUnorderedList, text: 'HTML Unordered List'},
    { value: PredefinedOutputTypes.MarkdownOrderedList, text: 'Markdown Ordered List'},
    { value: PredefinedOutputTypes.MarkdownUnorderedList, text: 'Markdown Unordered List'},
];

class GuidGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            genCount: 1,
            separator: SeparatorTypes.Newline,
            quotes: QuoteTypes.None,
            predefinedFormat: PredefinedOutputTypes.None,
        }
        window.uuid = uuid;
    }
    
    getQuotes() {
        if (JsonPredefinedOutputs.includes(this.state.predefinedFormat)) {
            return '';
        }

        switch (this.state.quotes) {
            default:
            case QuoteTypes.None: return '';
            case QuoteTypes.Single: return "'";
            case QuoteTypes.Double: return '"';
            case QuoteTypes.Backtick: return '`';
        }
    }

    getSeparator() {
        switch (this.state.separator) {
            default:
            case SeparatorTypes.Newline: return '\n';
            case SeparatorTypes.Space: return ' ';
            case SeparatorTypes.Comma: return ',';
            case SeparatorTypes.CommaNewline: return ',\n';
            case SeparatorTypes.CommaSpace: return ', ';
        }
    }
    
    getJsonSeparator() {
        switch (this.state.predefinedFormat) {
            default:
            case PredefinedOutputTypes.Json: return null;
            case PredefinedOutputTypes.JsonPretty2Space: return 2;
            case PredefinedOutputTypes.JsonPretty4Space: return 4;
            case PredefinedOutputTypes.JsonPrettyTabs: return '\t';
        }
    }

    generateValues() {
        const {genCount, predefinedFormat} = this.state;
        const quotes = this.getQuotes();
        const separator =this.getSeparator();
        const guids = new Array(genCount)
            .fill('').map(() => `${quotes}${uuid()}${quotes}`);
        if (predefinedFormat === PredefinedOutputTypes.None) {
            return guids
                .join(separator);
        } else if (JsonPredefinedOutputs.includes(predefinedFormat)) {
            const jsonSeparator = this.getJsonSeparator();
            return JSON.stringify(guids, null, jsonSeparator);
        } else if (MarkdownPredefinedOutputs.includes(predefinedFormat)) {
            const isOrdered = predefinedFormat === PredefinedOutputTypes.MarkdownOrderedList;
            return guids.map((guid, i) => `${isOrdered ? `${i+1}.` : '-'} ${guid}`).join('\n')
        }
        const isOrdered = predefinedFormat === PredefinedOutputTypes.HtmlOrderedList;
        const tag = isOrdered ? 'ol' : 'ul';
        const guidsValue = guids.map((guid) => `  <li>${guid}</li>`).join('\n');
        return `<${tag}>\n${guidsValue}\n</${tag}>`;
    }

    render() {
        const {genCount, separator, quotes, predefinedFormat} = this.state;
        const updateCount = (e) => this.setState({genCount: +e.target.value})
        const values = this.generateValues();
        const isPredefinedFormat = predefinedFormat !== PredefinedOutputTypes.None;
        const showSeparators = !isPredefinedFormat;
        const showQuotes = !JsonPredefinedOutputs.includes(predefinedFormat);
        return (
            <div className="generator">
                <textarea value={values}  readOnly cols='75' rows='15' size='36' aria-label='guid value' ></textarea>
                <div className="controls">
                    <label>Count</label>
                    <div className="count">
                        <input className='slider' type='range' min='1' max='100' value={genCount} onChange={updateCount} />
                        <input className='display' type='number' min='1' max='100' value={genCount} onChange={updateCount} />
                    </div>
                    { showQuotes && (<label htmlFor='quote-type'>Quotes</label>)}
                    { showQuotes && (<div><Multiselect 
                        name="quote-type"
                        defaultValue={quotes}
                        options={quoteOptions}
                        onChange={(v) => this.setState({quotes: +v})}
                    /></div>)}
                    { showSeparators && (<label htmlFor="separator">Separator</label>)}
                    { showSeparators && (<div><Multiselect
                        name='separator'
                        defaultValue={separator}
                        options={separatorOptions}
                        onChange={(v) => this.setState({separator: +v})}
                    /></div>)}
                    <label htmlFor="predefined">Predefined Output Format</label>
                    <div><Multiselect
                        name='predefined'
                        defaultValue={predefinedFormat}
                        options={predefinedOptions}
                        onChange={(v) => this.setState({predefinedFormat: +v})}
                    /></div>
                </div>
            </div>
        );
    }
}

export default GuidGenerator;
