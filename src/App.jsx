import styled from 'styled-components';
import useGetQlikData from './util/useGetQlikData';
import KPI from './components/KPI';
import Table from './components/Table';
import Waterfall from './components/Waterfall';
import Waterfall2 from './components/Waterfall2';
import Switch from './components/Switch';
import Search from './components/Search';
import useQlikConnect from './util/useQlikConnector';
import { useState } from 'react';

const ColContainer = styled.section`
  display: flex;
  flex-direction: column;
`;

const RowContainer = styled.section`
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
  justify-content: center;
  font-family: 'Heebo';
  font-weight: 300;
`;

const SwitchContainer = styled.span`
  align-self: center;
  display: flex;
  gap: 0.5rem;
  margin-top: 0rem;
  position: relative;
  top: 50%;
  left: 25%;
`;

export default function App() {
  const [waterfall, setWaterfall] = useState(1);

  // Define app ID
  const appId = '7b227df8-8be3-4835-9f4d-617cf47e9437';

  // Custom hook
  const qlikApp = useQlikConnect(appId);

  // Data for table component
  const tableData = useGetQlikData(qlikApp.doc, 'QJCCUM').qlikData;

  // Data for waterfall chart
  const waterfallData = useGetQlikData(
    qlikApp.doc,
    'GwVmqW',
  ).qlikData;

  // Data for second waterfall chart
  const waterfall2Data = useGetQlikData(
    qlikApp.doc,
    'hXvWVKP',
  ).qlikData;

  // Data for total revenue
  const revenueData = useGetQlikData(qlikApp.doc, 'tWJJyZ').qlikData;

  // Data for total expenses
  const expensesData = useGetQlikData(qlikApp.doc, 'eMsVVT').qlikData;

  // Data for total profit
  let profitData = useGetQlikData(qlikApp.doc, 'xWWjCN').qlikData;

  // Logic for switching between the two waterfall charts
  const handleChartUpdate = () => {
    if (waterfall === 1) {
      setTimeout(() => setWaterfall(2), 1);
    } else {
      setTimeout(() => setWaterfall(1), 1);
    }
  };
  return (
    <>
      <ColContainer>
        <RowContainer>
          <KPI
            qlikApp={qlikApp}
            title='Total Revenue'
            objectId='tWJJyZ'
          />
          <KPI
            title='Total Expenses'
            qlikApp={qlikApp}
            objectId='eMsVVT'
          />
          <KPI
            title='Total Profit'
            qlikApp={qlikApp}
            objectId='xWWjCN'
          />{' '}
          <Search data={tableData} qlikApp={qlikApp} />
        </RowContainer>
        <RowContainer>
          <Table data={tableData} />
          <ColContainer>
            <RowContainer>
              <SwitchContainer onClick={handleChartUpdate}>
                Quarters
                <Switch />
                Profit Analysis
              </SwitchContainer>
            </RowContainer>
            {waterfall === 1 && <Waterfall data={waterfallData} />}
            {waterfall === 2 && <Waterfall2 data={waterfall2Data} />}
          </ColContainer>
        </RowContainer>
      </ColContainer>
    </>
  );
}
