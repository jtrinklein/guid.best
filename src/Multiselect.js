function Multiselect(props) {
    const options = (
        !!props.includeNone ? [{value: '', text: ''}] : []
    ).concat(props.options.map((opt) => {
        if (typeof opt === 'string') {
            return {value: opt, text: opt};
        }
        const value = opt.value;
        if (!opt.hasOwnProperty('value')) {
            throw new Error('Multiselect option must have property "value"')
        }
        let text = opt.text;
        if (!opt.hasOwnProperty('text')) {
            console.warn('Expected Multiselect option to have property "text", defaulting to use "value"');
            text = value;
        }

        return {value, text};
    }));
    return (
        <select name={props.name} defaultValue={props.defaultValue} onChange={(e) => props.onChange(e.target.value)}>
            {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.text}</option>))}
        </select>
    )
}

export default Multiselect;