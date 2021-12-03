import { useGetMockDataQuery } from './models/rtkQuery';
import style from './index.less';

function Query(props) {
  const getMockDataQuery = useGetMockDataQuery({
    queryName: 'useGetMockDataQuery'
  });

  function listRender() {
    return getMockDataQuery.data.map((item, index) => {
      return (
        <tr key={ item.id }>
          <td>{ item.id }</td>
          <td>{ item.name }</td>
        </tr>
      );
    });
  }

  return (
    <div className={ style.content }>
      {
        getMockDataQuery.isLoading ? '加载中...' : (
          <table className={ style.table }>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>{ listRender() }</tbody>
          </table>
        )
      }
    </div>
  );
}

export default Query;