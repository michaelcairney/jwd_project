import styled from 'styled-components';
import useEnigma from './useEnigma';
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
  const revenueTable = useEnigma(enigma.doc, 'tWJJyZ').qlikData;

  // Table data for total expenses
  const expensesTable = useEnigma(enigma.doc, 'eMsVVT').qlikData;

  // Table data for total profit
  let profitTable = useEnigma(enigma.doc, 'xWWjCN').qlikData;

 
  if (profitTable) {
    let profits = [];

    // Calculate profit for each quarter
    profitTable.forEach((row) =>
      profits.push(row[1].qNum - row[2].qNum),
    );

    // Sum quarterly profts to get total profit
    const totalProfit = profits.reduce((prev, curr) => prev + curr);

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
      <KPI
        table={revenueTable}
        title='Total Revenue'
      />
      <KPI
        table={expensesTable}
        title='Total Expenses'
      />
      <KPI
        table={profitTable}
        title='Total Profit'
      />
    </Wrapper>
  );
}
