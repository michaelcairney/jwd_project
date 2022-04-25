import styled from 'styled-components';

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
  border-radius: 3px;
`;

// Change colour of percent change based on increase/decrease/no change
const Percent = styled.li`
  color: ${(props) =>
    props.isUp === 'up'
      ? 'lime'
      : props.isUp === 'down'
      ? 'red'
      : 'darkslategrey'};
  font-weight: 600;
`;

export default function KPI({ data, title }) {
  if (data) {
    // Format data point to the desired specifications
    const value = Math.round(data[0][0].qNum / 1000000);
    const percent = data[0][1];
    let arrow;

    // Change variable that determines the direction of the arrow symbol based on the percentage change
    if (percent.qNum < 0) {
      arrow = 'down';
    } else if (percent.qNum > 0) {
      arrow = 'up';
    } else {
      arrow = '';
    }

    return (
      <Box>
        <li>{title}</li>
        <strong style={{ fontSize: '1.2rem' }}>
          {value.toLocaleString()} m
        </strong>
        <Percent isUp={arrow}>
          <i className={`fa-solid fa-caret-${arrow}`} />{' '}
          {percent.qText}
        </Percent>
      </Box>
    );
  }
}
