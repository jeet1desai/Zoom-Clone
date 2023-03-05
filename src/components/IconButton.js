import { Box } from "@mui/system";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";

const IconButton = ({ Icon, isMuted, isShare, isCallEnd, isInfo, onClick }) => {
  if (isShare) {
    return (
      <Box className={`call-icons share-icon`} onClick={() => onClick()}>
        <PresentToAllIcon />
      </Box>
    );
  } else if (isInfo) {
    return (
      <Box className={`isInfo`} onClick={() => onClick()}>
        <Icon />
      </Box>
    );
  } else if (isCallEnd) {
    return (
      <Box className={`call-icons call-end`} onClick={() => onClick()}>
        <CallEndIcon />
      </Box>
    );
  }

  return (
    <Box className={`call-icons ${isMuted && "muted"}`} onClick={() => onClick()}>
      <Icon />
    </Box>
  );
};

export default IconButton;
