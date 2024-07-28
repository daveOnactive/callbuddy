import { Avatar, Box, Button, Card, Rating, Typography } from "@mui/material";
import { blue, green, grey, pink, red, yellow } from "@mui/material/colors";
import Face6RoundedIcon from '@mui/icons-material/Face6Rounded';
import AddIcCallRoundedIcon from '@mui/icons-material/AddIcCallRounded';
import { User, UserCallStatus } from "@/types";
import { getActiveUntil, getUserRank } from "@/helpers";
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';

type IProp = {
  user?: User;
  onClick?: () => void;
}

function getStatus(user?: User) {
  if (!user) return;

  const activeUntil = getActiveUntil(user.lastLogin);

  if (user.incall) return 'incall';

  if (activeUntil) return 'active';

  return 'offline';
}

export function BuddyCard({ user, onClick }: IProp) {

  const statusColorMapper = {
    'active': green,
    'incall': yellow,
    'offline': red,
  };

  const callStatusText = {
    [UserCallStatus.IN_CALL]: 'In a call',
    [UserCallStatus.CREATE_CALL]: 'Join call',
    [UserCallStatus.NOT_IN_CALL]: 'Call'
  }

  const genderMapper = {
    'female': <FemaleRoundedIcon
      sx={{
        color: pink[600]
      }}
    />,
    'male': <MaleRoundedIcon
      sx={{
        color: blue[600]
      }}
    />
  }

  const status = getStatus(user) as keyof typeof statusColorMapper;
  return (
    <Card
      sx={(theme) => ({
        width: "100%",
        background: theme.palette.background.paper,
        borderRadius: '8px',
        position: 'relative'
      })}
      variant="outlined"
    >
      <Box sx={(theme) => ({
        width: 28,
        height: 28,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        '&::after': {
          content: "''",
          width: 8,
          height: 8,
          background: statusColorMapper[status][600],
          display: 'block',
          position: 'relative',
          borderRadius: 100,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: `1px solid ${statusColorMapper[status][500]}`,
          boxShadow: `0 2px 1px ${theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(45, 45, 60, 0.2)"
            }, inset 0 1.5px 1px ${statusColorMapper[status][400]}, inset 0 -2px 1px ${statusColorMapper[status][600]}`,
        }
      })}>
      </Box>
      <Box
        sx={{
          p: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Avatar sx={({ palette: { primary: { dark } } }) => ({
          border: `${dark} solid 2px`
        })} src={user?.avatarUrl} alt={user?.name} />
      </Box>
      <Box p={1}>
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: .1
          }}
        >
          {genderMapper[user?.gender as keyof typeof genderMapper]}
          <span>{user?.name}</span>
        </Typography>

        <Rating sx={{
          my: .5
        }} name="Rating" value={getUserRank(user?.rank as number || 0)} readOnly />

        <Box sx={{
          display: 'flex',
          justifyContent: 'end',
          width: '100%',
          mt: 1
        }}>
          <Button
            size='small'
            variant="contained"
            onClick={onClick}
            endIcon={<AddIcCallRoundedIcon fontSize="small" />}
            disabled={user?.call === UserCallStatus.IN_CALL}
          >

            {callStatusText[user?.call as keyof typeof callStatusText] || 'Call'}
          </Button>
        </Box>
      </Box>
    </Card>
  )
}