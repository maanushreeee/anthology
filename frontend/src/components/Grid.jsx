import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  height: 40, 
  width: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
}));

export default function GridLayout() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 1.5,
      }}
    >
      {[...Array(20)].map((_, i) => (
        <Item key={i}>Item {i + 1}</Item>
      ))}
    </Box>
  );
}
