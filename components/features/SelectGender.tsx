import { Box, Card, Typography } from "@mui/material";
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';
import { blue, pink } from "@mui/material/colors";

export function SelectGender() {
  return (
    <Box
      sx={{
        height: 250,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Typography color='black' variant="h6" textAlign='center' my={2}>Choose Your Gender</Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          gap: 1,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            px: 2,
            py: 4,
            display: 'flex',
            justifyContent: 'center',
            border: `1px solid ${pink[600]}`,
            flexDirection: 'column'
          }}
        >
          <FemaleRoundedIcon
            sx={{
              fontSize: '3.5rem',
              color: pink[600]
            }}
          />
          <Typography variant="subtitle2" color={pink[600]} textAlign='center'>Female</Typography>
        </Card>
        <Card
          variant="outlined"
          sx={{
            px: 2,
            py: 4,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <MaleRoundedIcon
            sx={{
              fontSize: '3.5rem',
              color: blue[600]
            }}
          />
          <Typography variant="subtitle2" color={blue[600]} textAlign='center'>Male</Typography>
        </Card>
      </Box>
    </Box>

  )
}