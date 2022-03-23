import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import style from '../style.less';
import { requestList } from '../models/list';
import { setAddNumber } from '../models/add';

/* redux selector */
const selector = createStructuredSelector({
  dataList: ({ list }) => list.dataList,
  number: ({ add }) => add.number
});

/* List Demo */
function Index(props) {
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
    <Fragment>
      <div className={ style.content }>
        <h2>Load data asynchronously</h2>
        <table className={ style.table }>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>{ listRender() }</tbody>
        </table>
      </div>
      <hr />
      <h2>Interaction with redux</h2>
      <p>
        <span className={ style.number }>{ number }</span>
        <button type="button" onClick={ handleAddClick }>add</button>
      </p>
    </Fragment>
  );
}

export default Index;