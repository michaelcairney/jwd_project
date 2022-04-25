import styled from 'styled-components';
import useGetKpiData from '../util/useGetKpiData';

const Box = styled.section`
  display: flex;
  flex-direction: column;
  gap: 5px;
  list-style: none;
  background: linear-gradient(#1486e4, #62b4f7);
  color: white;
  width: 10rem;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 5px;
  margin-left: 1rem;
  border-radius: 3px;
`;

// Change colour of percent change based on increase/decrease/no change
const Percent = styled.li`
  color: ${(props) => props.color};
  font-weight: 600;
`;

export default function KPI({ title, qlikApp, objectId }) {
  let data = useGetKpiData(qlikApp?.doc, objectId).qlikData;

  if (title === 'Total Profit' && data) {
    console.log(data);
    // Calculate total profit by summing each quarter profit
    const totalProfit = data?.reduce((prevValue, row) => {
      const rowRevenue = row[1].qNum;
      const rowExpense = row[2].qNum;
      const rowProfit = rowRevenue - rowExpense;
      return (prevValue += rowProfit);
    }, 0);

    // Format total profit data so that the KPI component can use it
    data = [
      [
        { qNum: totalProfit },
        {
          qText: data[0][3].qText,
          qNum: data[0][3].qNum,
        },
      ],
    ];
  }
  if (data) {
    // Format data point to the desired specifications
    const value = Math.round(data[0][0].qNum / 1000000);
    const percent = data[0][1];

    let arrow;
    let color;
    // Determine the direction of the arrow symbol and text color based on the percentage change
    if (percent.qNum < 0) {
      color = 'red';
      arrow = 'down';
    } else if (percent.qNum > 0) {
      color = 'lime';
      arrow = 'up';
    } else {
      color = 'darkslategrey';
      arrow = '';
    }

    return (
      <Box>
        <li>{title}</li>
        <strong style={{ fontSize: '1.2rem' }}>
          {value.toLocaleString()} m
        </strong>
        <Percent color={color}>
          <i className={`fa-solid fa-caret-${arrow}`} />{' '}
          {percent.qText}
        </Percent>
      </Box>
    );
  }
}
