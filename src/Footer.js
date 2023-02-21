import Multiselect from './Multiselect';
import './Footer.css';

function Footer() {
    const redirectToVersion = (v) => {
        const route = '/' + (v === 'latest' ? '' : `${v}/index.html`);
        window.location.assign(route);
    };
    const versionOptions = ['latest', 'v1', 'v2'];
    return (
    <div className='footer'>
        <div>
            Site version v3
        </div>
        <div>
            View another version:
            <Multiselect
                name='site-version'
                defaultValue='latest'
                options={versionOptions}
                onChange={(v) => redirectToVersion(v)}
                />
        </div>
    </div>
    );
}

export default Footer;
