import styled from 'styled-components';
import useGetQlikData from './useGetQlikData';
import KPI from './KPI';
import useQlikConnect from './useQlikConnector';

const Wrapper = styled.main`
  display: flex;
  flex-direction: row;
`;

export default function App() {
  // Define app ID
  const appId = '7b227df8-8be3-4835-9f4d-617cf47e9437';

  // Custom hook
  const enigma = useQlikConnect(appId);

  // Table data for total revenue
  const revenueTable = useGetQlikData(enigma.doc, 'tWJJyZ').qlikData;

  // Table data for total expenses
  const expensesTable = useGetQlikData(enigma.doc, 'eMsVVT').qlikData;

  // Table data for total profit
  let profitTable = useGetQlikData(enigma.doc, 'xWWjCN').qlikData;

  if (profitTable) {
    // Calculate total profit by summing each quarter profit
    const totalProfit = profitTable.reduce((prevValue, row) => {
      const rowRevenue = row[1].qNum;
      const rowExpense = row[2].qNum;
      const rowProfit = rowRevenue - rowExpense;
      return (prevValue += rowProfit);
    }, 0);

    // Format total profit data so that the KPI component can use it
    profitTable = [
      [
        { qNum: totalProfit },
        {
          qText: profitTable[0][3].qText,
          qNum: profitTable[0][3].qNum,
        },
      ],
    ];
  }
  return (
    <Wrapper>
      <KPI table={revenueTable} title='Total Revenue' />
      <KPI table={expensesTable} title='Total Expenses' />
      <KPI table={profitTable} title='Total Profit' />
    </Wrapper>
  );
}
