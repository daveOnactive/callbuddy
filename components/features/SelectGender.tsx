'use client'
import { Box, Card, Typography } from "@mui/material";
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';
import { blue, pink } from "@mui/material/colors";
import { useState } from "react";
import { useUpdateDoc } from "@/hooks";

type IProp = {
  closeModal?: () => void;
  userId?: string;
}

export function SelectGender({ closeModal, userId }: IProp) {

  const [gender, setGender] = useState('');

  const { mutate } = useUpdateDoc('users');

  function handleSelectGender(gender: string) {
    setGender(gender);
    if (userId) {
      mutate(userId, {
        gender,
      });
    }
    closeModal?.();
  }

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
            border: gender === 'female' ? `1px solid ${pink[600]}` : 'unset',
            flexDirection: 'column'
          }}
          onClick={() => handleSelectGender('female')}
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
            flexDirection: 'column',
            border: gender === 'male' ? `1px solid ${blue[600]}` : 'unset',
          }}
          onClick={() => handleSelectGender('male')}
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