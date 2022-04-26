import styled from 'styled-components';
import useGetQlikData from './useGetQlikData';
import KPI from './KPI';
import Table from './components/Table';
import useQlikConnect from './useQlikConnector';

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

  // Data for the table component
  const tableData = useGetQlikData(enigma.doc, 'QJCCUM').qlikData;

  // Data for total revenue KPI
  const revenueData = useGetQlikData(enigma.doc, 'tWJJyZ').qlikData;

  // Data for total expenses KPI
  const expensesData = useGetQlikData(enigma.doc, 'eMsVVT').qlikData;

  // Data for total profit KPI
  let profitData = useGetQlikData(enigma.doc, 'xWWjCN').qlikData;

  if (profitTable) {
    // Calculate total profit by summing each quarter profit
    const totalProfit = profitTable.reduce((prevValue, row) => {
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
      <Table data={tableData} />
    </ColContainer>
  );
}
