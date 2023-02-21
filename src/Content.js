import GuidGenerator from './GuidGenerator';
import './Content.css';

function Content() {
    return (
        <div className='content'>
            <div className='message'>Get yourself the best GUID available!</div>
            <GuidGenerator />
        </div>
    );
}

export default Content;
