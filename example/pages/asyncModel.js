import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { dynamicReducers } from 'umi-plugin-redux-toolkit/dynamicReducers';
import style from './index.less';
import asyncModel, { setAddNumber } from './models/asyncModel.async';

const state = createStructuredSelector({
  number: createSelector(
    ({ asyncModel }) => asyncModel?.number ?? 13,
    (data) => data
  )
});

function AsyncModel(props) {
  const { number } = useSelector(state);
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