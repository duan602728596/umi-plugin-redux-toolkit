import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import style from './index.less';
import { requestList, add } from './models/index';

/* state */
const state = createStructuredSelector({
  dataList: createSelector(
    ({ index }) => index.dataList,
    (data) => data
  ),

  number: createSelector(
    ({ index }) => index.number,
    (data) => data
  )
});

function Index(props) {
  const { dataList, number } = useSelector(state);
  const dispatch = useDispatch();

  function handleAddClick(event) {
    dispatch(add());
  }

  function listRender() {
    return dataList.map((item, index) => {
      return (
        <tr key={ item.id }>
          <td>{ item.id }</td>
          <td>{ item.name }</td>
        </tr>
      );
    });
  }

  useEffect(function() {
    dispatch(requestList());
  }, []);

  return (
    <div className={ style.content }>
      <table className={ style.table }>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{ listRender() }</tbody>
      </table>
      <p>
        <span className={ style.number }>{ number }</span>
        <button type="button" onClick={ handleAddClick }>add</button>
      </p>
    </div>
  );
}

export default Index;