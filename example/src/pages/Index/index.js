import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import style from '../style.less';
import { requestList } from '../models';
import { setAddNumber } from '../models/add';

/* redux selector */
const selector = createSelector(
  [
    ({ index }) => index.dataList,
    ({ add }) => add.number
  ],
  (dataList, number) => ({ dataList, number })
);

function Index(props) {
  const x = useSelector(selector);
  const { dataList, number } = useSelector(selector);
  const dispatch = useDispatch();

  function handleAddClick(event) {
    dispatch(setAddNumber());
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