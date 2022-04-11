import styled from 'styled-components';
import useEnigma from './util/useEnigma';
import KPI from './components/KPI';
import Table from './components/Table';
import useQlikConnect from './util/useQlikConnector';
import { useEffect } from 'react';

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

  const table = useEnigma(enigma.doc, 'QJCCUM').qlikData;

  // Table data for total revenue
  const revenueData = useEnigma(enigma.doc, 'tWJJyZ').qlikData;

  // Table data for total expenses
  const expensesData = useEnigma(enigma.doc, 'eMsVVT').qlikData;

  // Table data for total profit
  let profitData = useEnigma(enigma.doc, 'xWWjCN').qlikData;

  if (profitData) {
    let profits = [];

    // Calculate profit for each quarter
    profitData.forEach((row) =>
      profits.push(row[1].qNum - row[2].qNum),
    );

    // Sum quarterly profts to get total profit
    const totalProfit = profits.reduce((prev, curr) => prev + curr);

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
      <Table data={table} />
    </ColContainer>
  );
}
