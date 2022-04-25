import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Dropdown = styled.input`
  width: 12rem;
  padding: 5px;
  align-self: center;
  margin-bottom: 2rem;
`;

export default function Search({ data, qlikApp }) {
  const [input, setInput] = useState('');
  const [field, setField] = useState(null);

  useEffect(() => {
    // Clear slections when input is empty
    if (input === '') {
      const clear = async () => {
        await field.clear();
      };
      clear();
    }

    // Get field name and set to state
    const getSetObjectDetails = async () => {
      const newField = await qlikApp.doc.getField('SalesPerson');
      setField(newField);
    };

    // Apply when field is falsy and the qlikapp doc exists
    if (!field && qlikApp.doc) {
      getSetObjectDetails();
    }
  }, [qlikApp, field, input]);

  // Create array for sales reps names
  const salesReps = [];

  // Add all sales names to the array
  if (data) {
    data.forEach((row) => {
      // Condition so that unique sales reps don't get  added to the table multiple times
      if (!salesReps.some((item) => item === row[0].qText)) {
        // Extract all items with the same name
        salesReps.push(row[0].qText);
      }
    });
  }

  useEffect(() => {
    // Function for selcting sales reps
    const selectHandler = async () => {
      await field.selectValues({
        qFieldValues: [{ qText: input }],
        qToggleMode: true,
        qSoftLock: true,
      });
    };

    // If the sales reps array contains a name that has been typed in the input then select the sales rep
    if (salesReps.some((rep) => rep === input) && field) {
      selectHandler();
    }
  }, [input]);

  return (
    <>
      <Dropdown
        type='text'
        list='mylist'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <datalist id='mylist'>
        {salesReps.map((rep) => (
          <option value={rep}></option>
        ))}
      </datalist>
    </>
  );
}
