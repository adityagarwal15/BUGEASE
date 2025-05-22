
const popSound = new Audio('/sounds/pop.mp3');

export const playNotificationSound = () => {
  try {
    popSound.play();
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};
