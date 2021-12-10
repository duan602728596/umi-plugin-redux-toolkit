import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { dynamicReducers } from 'umi-plugin-redux-toolkit/dynamicReducers';
import style from '../style.less';
import asyncModel, { setAddNumber } from '../models/asyncModel.async';

/* redux selector */
const selector = createSelector(
  [
    ({ asyncModel: am }) => am?.number ?? 13
  ],
  (number) => ({ number })
);

function AsyncModel(props) {
  const { number } = useSelector(selector);
  const dispatch = useDispatch();

  function handleAddClick(event) {
    dispatch(setAddNumber());
  }

  return (
    <div>
      <h4>异步加载reducers</h4>
      <p>
        <span className={ style.number }>{ number }</span>
        <button type="button" onClick={ handleAddClick }>add</button>
      </p>
    </div>
  );
}

export default dynamicReducers([asyncModel])(AsyncModel);