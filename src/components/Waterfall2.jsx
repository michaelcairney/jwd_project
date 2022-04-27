import * as d3 from 'd3';
import { axisBottom, axisLeft } from 'd3';
import { useEffect, useRef } from 'react';

export default function Waterfall2({ data }) {
  const chartRef = useRef(null);

  // Define dimensions
  const height = 400;
  const width = 450;
  const margin = { top: 0, bottom: 40, left: 82, right: 90 };

  useEffect(() => {
    if (data) {
      let miscCosts = data[0][0].qNum;
      data[0].forEach((item, index) => {
        if (index > 0) {
          miscCosts = miscCosts - item.qNum;
        }
      });

      const newData = [
        ...data[0].slice(0, 4),
        { qNum: miscCosts },
        ...data[0].slice(4, 5),
      ];

      // Create array that will contain the cumulative sums for each quarter
      const cumulative = [0];

      // Logic to obtain cumulative sums
      newData.reverse().forEach((item, index) => {
        if (index < 4) {
          cumulative.push(
            item.qNum + cumulative[cumulative.length - 1],
          );
        }
      });
      newData.reverse();
      cumulative.push(0);

      // Extract the quantative values
      const measureData = data[0].map((item) => item.qNum);

      // Extract the qualitative values
      const dimensionData = [
        'Revenue',
        'Product Costs',
        'Marketing Costs',
        'Sales Costs',
        'Misc Costs',
        'Net Profit',
      ];

      // Define x and y scales
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(measureData)])
        .range([0, width]);
      const yScale = d3
        .scaleBand()
        .domain(dimensionData)
        .range([0, height]);

      // Create space between bars
      yScale.padding(0.4);

      // Define x and y axes
      const yAxis = axisLeft(yScale).tickSizeOuter(0);
      const xAxis = axisBottom(xScale).tickValues([]).tickSize(0);

      // Apply x and y axes to the chart
      d3.select(chartRef.current)
        .select('#yAxis')
        .attr('transform', `translate(${margin.left}, 0 )`)
        .call(yAxis);
      d3.select(chartRef.current)
        .select('#xAxis')
        .attr('transform', `translate(${margin.left},${height} )`)
        .call(xAxis);

      // Define bars
      const bars = d3
        .select(chartRef.current)
        .selectAll('rect')
        .data(newData);

      // Add bars
      bars
        .enter()
        .append('rect')
        .attr(
          'transform',
          `translate(${margin.left}, ${margin.top} )`,
        )
        .attr('fill', (d, i) => {
          if (i < 1) {
            return '#3090df';
          } else if (i > 4) {
            return 'mediumseagreen';
          } else {
            return '#bf3333'
          }
        })
        .attr('height', yScale.bandwidth())
        .attr('y', (d, i) => yScale(dimensionData[i]))

        // Make the bars start at the previous bars value, except for the total
        .attr('x', (d, i) => {
          if (i > 0) {
            return xScale(cumulative[5 - i]);
          }
        })

        .attr('width', 0)
        .style('border-radius', '5px')
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr('width', (d) => xScale(d.qNum));

      // Add text displaying the values inside each bar
      bars
        .enter()
        .append('text')
        .attr(
          'transform',
          `translate(${margin.left}, ${yScale.bandwidth() / 2 + 6} )`,
        )
        // Apply appropriate formatting
        .text(
          (d, i) =>
            Math.round(d.qNum / 1000000).toLocaleString() + 'm',
        )
        .attr('x', (d, i) => {
          if (i < 1 || i > 3) {
            return xScale(cumulative[5 - i] + d.qNum / 2);
          } else {
            return xScale(cumulative[5 - i]) - 25;
          }
        })
        .attr('y', (d, i) => yScale(dimensionData[i]))
        .style('fill', (d, i) => {
          if (i < 1 || i > 3) {
            return 'white';
          } else {
            return 'black';
          }
        })
        .style('font-family', 'Heebo')
        .attr('font-weight', '200')
        .attr('text-anchor', 'middle');

      cumulative.splice(5, 1, newData[0].qNum);

      // Add lines connecting the bars for the waterfall chart
      bars
        .enter()
        .append('line')
        .attr('transform', `translate(${margin.left}, 0 )`)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .attr('opacity', '0.6')
        .attr('stroke-dasharray', '4 2')
        .attr('x1', (d, i) => xScale(cumulative[5 - i]))
        .attr(
          'y1',
          (d, i) => yScale(dimensionData[i]) + yScale.bandwidth(),
        )
        .attr('x2', (d, i) => xScale(cumulative[5 - i]))
        .attr(
          'y2',
          (d, i) => yScale(dimensionData[i]) + yScale.bandwidth(),
        )
        .transition()
        .duration(500)
        .delay(800)
        .attr(
          'y2',
          (d, i) => yScale(dimensionData[i]) + yScale.step(),
        );

      // Add title for the chart
      d3.select(chartRef.current)
        .append('text')
        .text('Expenses and Revenue')
        .attr('x', width / 2.3)
        .attr('y', height + margin.bottom - 10)
        .attr('font-size', '1.5rem')
        .style('font-family', 'Heebo')
        .attr('font-weight', 300);
    }
  }, [data]);

  return (
    <svg
      height={height + margin.bottom}
      width={width + margin.right}
      ref={chartRef}
    >
      <g id='xAxis' />
      <g id='yAxis' />
    </svg>
  );
}
