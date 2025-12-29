import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #05070a;
  color: #f8fafc;
  padding: 40px;
  font-family: 'Inter', sans-serif;
`;

export const Card = styled.div`
  background: #111827;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #1f2937;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
`;

export const Input = styled.input`
  width: 100%;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 12px;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;

  &::-webkit-calendar-picker-indicator {
    filter: invert(1); /* Makes the calendar icon white */
    cursor: pointer;
  }

  &:focus {
    outline: 2px solid #3b82f6;
  }
`;

export const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
  &:hover { background: #2563eb; }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  width: 100%;
  margin-top: 30px;
`;