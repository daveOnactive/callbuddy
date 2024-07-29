'use client'
import { generateRandomId } from '@/helpers';
import { useLowTimeDialog } from '@/hooks';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import { useRouter } from 'next/navigation';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
  backgroundColor: green[500],
  padding: "8px 16px",
  borderRadius: "100px",
  color: "white",
  transition: "all 150ms ease",
  cursor: "pointer",
  border: `1px solid ${green[500]}`,
  boxShadow: `0 2px 1px rgba(45, 45, 60, 0.2), inset 0 1.5px 1px ${green[400]}, inset 0 -2px 1px ${green[600]}`,
  "&:hover": {
    backgroundColor: green[600],
  },
  textTransform: "none",
});


export function StartCall() {

  const { push } = useRouter();
  const { showDialog } = useLowTimeDialog();

  return (
    <StyledFab onClick={() => showDialog?.(() => push(`/incall?callId=${generateRandomId(12)}`))} color="success" aria-label="add">
      <VideoCallRoundedIcon />
    </StyledFab>
  )
}