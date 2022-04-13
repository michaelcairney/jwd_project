import * as d3 from 'd3';
import { axisBottom, axisLeft } from 'd3';
import { useEffect, useRef } from 'react';

export default function Waterfall({ data }) {
  const chartRef = useRef(null);

  // Define dimensions
  const height = 500;
  const width = 600;
  const margin = { top: 0, bottom: 40, left: 60, right: 70 };

  useEffect(() => {
    if (data) {
      // Create array that will contain the cumulative sums for each quarter
      const cumulative = [0];

      // Logic to obtain cumulative sums
      data.forEach((item) =>
        cumulative.push(
          item[1].qNum + cumulative[cumulative.length - 1],
        ),
      );

      // grab the total sum
      const total = cumulative[cumulative.length - 1];

      // Add an extra data point for the total sales
      data.push([{ qText: 'Total' }, { qNum: total }]);

      // Extract the quantative values
      const measureData = data.map((item) => item[1].qNum);

      // Extract the qualitative values
      const dimensionData = data.map((item) => item[0].qText);

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
      yScale.padding(0.3);

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
        .data(data);

      // Add bars
      bars
        .enter()
        .append('rect')
        .attr(
          'transform',
          `translate(${margin.left}, ${margin.top} )`,
        )
        .attr('fill', '#3090df')
        .attr('height', yScale.bandwidth())
        .attr('y', (d, i) => yScale(d[0].qText))

        // Make the bars start at the previous bars value, except for the total
        .attr('x', (d, i) => {
          if (d[0].qText !== 'Total') {
            return xScale(cumulative[i]);
          }
        })
        .attr('width', 0)
        .style('border-radius', '5px')
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr('width', (d) => xScale(d[1].qNum));

      // Add text displaying the values inside each bar
      bars
        .enter()
        .append('text')
        .attr(
          'transform',
          `translate(${margin.left - 27}, ${margin.bottom - 1} )`,
        )
        // Apply appropriate formatting
        .text(
          (d, i) =>
            Math.round(d[1].qNum / 1000000).toLocaleString() + 'm',
        )
        .attr('x', (d, i) => {
          if (d[0].qText !== 'Total') {
            return xScale(cumulative[i] + d[1].qNum / 2);
          } else {
            return xScale(cumulative[4] / 2);
          }
        })
        .attr('y', (d, i) => yScale(d[0].qText))
        .style('fill', 'white')
        .style('font-family', 'Heebo')
        .attr('font-weight', '200');

      // Add lines connecting the bars for the waterfall chart
      bars
        .enter()
        .append('line')
        .attr('transform', `translate(${margin.left}, 0 )`)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .attr('opacity', '0.6')
        .attr('stroke-dasharray', '4 2')
        .attr('x1', (d, i) => xScale(cumulative[i + 1]))
        .attr('y1', (d, i) => yScale(d[0].qText) + yScale.bandwidth())
        .attr('x2', (d, i) => xScale(cumulative[i + 1]))
        .attr('y2', (d) => yScale(d[0].qText) + yScale.bandwidth())
        .transition()
        .duration(500)
        .delay(800)
        .attr('y2', (d, i) => yScale(d[0].qText) + yScale.step());

      // Add title for the chart
      d3.select(chartRef.current)
        .append('text')
        .text('Breakdown Total Sales By Quarter')
        .attr('x', width / 3)
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
