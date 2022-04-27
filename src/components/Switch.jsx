import styled from 'styled-components';


// Component for the switch between two waterfall charts

const CheckBoxWrapper = styled.div`
  position: relative;
`;
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 26px;
  border-radius: 15px;
  background: #b1b1b1;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 19px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #4f8abe;
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 19px;
      margin-left: 28px;
      transition: 0.2s;
    }
  }
`;

export default function Switch() {
  return (
    <CheckBoxWrapper>
      <CheckBox id='checkbox' type='checkbox' />
      <CheckBoxLabel htmlFor='checkbox' />
    </CheckBoxWrapper>
  );
}
