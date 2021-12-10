import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import style from '../style.less';
import { requestList } from '../models';
import { setAddNumber } from '../models/add';

/* redux selector */
const selector = createStructuredSelector({
  dataList: ({ index }) => index.dataList,
  number: ({ add }) => add.number
});

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