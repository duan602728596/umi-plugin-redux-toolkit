import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { dynamicReducers } from 'umi-plugin-redux-toolkit/dynamicReducers';
import style from '../style.less';
import asyncModel, { setAddNumber } from '../models/asyncModel.async';

/* redux selector */
const selector = createStructuredSelector({
  number: ({ asyncModel: am }) => am?.number ?? 13
});

function AsyncModel(props) {
  const { number } = useSelector(selector);
  const dispatch = useDispatch();

  function handleAddClick(event) {
    dispatch(setAddNumber());
  }

  return (
    <div>
      <h2>Load reducers asynchronously</h2>
      <p>
        <span className={ style.number }>{ number }</span>
        <button type="button" onClick={ handleAddClick }>add</button>
      </p>
    </div>
  );
}

export default dynamicReducers([asyncModel])(AsyncModel);