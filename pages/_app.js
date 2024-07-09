// pages/_app.js

import '../public/styles.css';
import '../public/global.css';

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
