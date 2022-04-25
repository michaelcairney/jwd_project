import { useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.main`
  height: 24rem;
  width: fit-content;
  overflow-y: scroll;
  margin-top: 2rem;
`;

const Grid = styled.section`
  display: flex;
  flex-direction: row;
`;

const Column = styled.section`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  background: aliceblue;
  padding: 5px 3px;
  margin-bottom: 0px;
  width: fit-content;
  min-width: 10rem;
  font-family: 'Heebo', sans-serif;
  font-weight: 300;
  text-align: center;
  cursor: default;
  :nth-child(1) {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    background: #3090df;
    color: white;
    font-weight: 500;
    padding: 6px 3px;
  }
  :nth-child(even) {
    background: #ffffff;
  }
`;

export default function Table({ data }) {
  // Create array that supplies data for the table where each object is a row.
  // Initialised with the header names as first row.
  const tableData = [
    {
      name: 'Sales Rep Name',
      sales: 'Total Number of Sales',
      revenue: 'Total revenue (£)',
      profit: 'Margin (£)',
    },
  ];

  if (data) {
    data.forEach((row) => {
      // Condition so that unique sales reps don't get  added to the table multiple times
      if (!tableData.some((item) => item.name === row[0].qText)) {
        // Extract all items with the same name
        const personData = data.filter(
          (line) => line[0].qText === row[0].qText,
        );

        // Extract name
        const name = personData[0][0].qText;

        // Sum their sales, revenue and profit for each instance of their name (i.e. each quarter)
        let newRow = personData.reduce(
          (prev, curr) => {
            prev.sales += curr[2].qNum;
            prev.revenue += curr[3].qNum;
            prev.profit += curr[4].qNum;
            return prev;
          },
          { name, sales: 0, revenue: 0, profit: 0 },
        );

        // Comma delimanated
        newRow.revenue = newRow.revenue.toLocaleString();
        newRow.profit = newRow.profit.toLocaleString();

        // Add the new row to the table
        tableData.push(newRow);
      }
    });
  }
  const keys = ['name', 'sales', 'revenue', 'profit'];

  return (
    <Container>
      <Grid>
        {keys.map((key) => (
          <Column>
            {tableData.map((row) => (
              <Item>{row[key]}</Item>
            ))}
          </Column>
        ))}
      </Grid>
    </Container>
  );
}
