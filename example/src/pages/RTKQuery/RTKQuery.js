import { useGetMockDataQuery } from '../models/RTKQuery.api';
import style from '../style.less';

function RTKQuery(props) {
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
      <h2>RTK Query</h2>
      {
        getMockDataQuery.isLoading ? 'Loading......' : (
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

export default RTKQuery;