import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import style from './index.css';

/* Demo Index */
function Index(props) {
  return (
    <Fragment>
      <h1>umi-plugin-redux-toolkit Demo</h1>
      <nav>
        <ul>
          <li>
            <Link className={ style.link } to="/List">List</Link>
          </li>
          <li>
            <Link className={ style.link } to="/AsyncModel">Async Model</Link>
          </li>
          <li>
            <Link className={ style.link } to="/RTKQuery">RTK Query</Link>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
}

export default Index;