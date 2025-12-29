import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #0f172a;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`;

export const Card = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
`;

export const InputGroup = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  flex: 1;
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 12px;
  color: white;
  &:focus { outline: 2px solid #3b82f6; }
`;

export const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
  &:hover { background: #2563eb; }
`;

export const TaskRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e293b;
  margin-bottom: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 4px solid ${props => props.completed ? '#10b981' : '#3b82f6'};
`;