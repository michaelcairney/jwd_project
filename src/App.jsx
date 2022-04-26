import styled from 'styled-components';
import useGetQlikData from './util/useGetQlikData';
import KPI from './components/KPI';
import Table from './components/Table';
import Waterfall from './components/Waterfall';
import useQlikConnect from './util/useQlikConnector';

const ColContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RowContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-self: center;
`;

export default function App() {
  // Define app ID
  const appId = '7b227df8-8be3-4835-9f4d-617cf47e9437';

  // Custom hook
  const enigma = useQlikConnect(appId);

  // Data for table component
  const tableData = useGetQlikData(enigma.doc, 'QJCCUM').qlikData;

  // Data for waterfall chart
  const waterfallData = useGetQlikData(enigma.doc, 'GwVmqW').qlikData;

  // Data for total revenue
  const revenueData = useGetQlikData(enigma.doc, 'tWJJyZ').qlikData;

  // Data for total expenses
  const expensesData = useGetQlikData(enigma.doc, 'eMsVVT').qlikData;

  // Data for total profit
  let profitData = useGetQlikData(enigma.doc, 'xWWjCN').qlikData;

  if (profitData) {
    // Calculate total profit by summing each quarter profit
    const totalProfit = profitData.reduce((prevValue, row) => {
      const rowRevenue = row[1].qNum;
      const rowExpense = row[2].qNum;
      const rowProfit = rowRevenue - rowExpense;
      return (prevValue += rowProfit);
    }, 0);

    // Format total profit data so that the KPI component can use it
    profitData = [
      [
        { qNum: totalProfit },
        {
          qText: profitData[0][3].qText,
          qNum: profitData[0][3].qNum,
        },
      ],
    ];
  }
  return (
    <ColContainer>
      <RowContainer>
        {/* <KPI data={revenueData} title='Total Revenue' />
        <KPI data={expensesData} title='Total Expenses' />
        <KPI data={profitData} title='Total Profit' /> */}
      </RowContainer>
      {/* <Table data={tableData} /> */}
      <Waterfall data={waterfallData} />
    </ColContainer>
  );
}
