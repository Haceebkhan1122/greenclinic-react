import { SketchPicker } from 'react-color';
import { ToastContainer, toast } from 'react-toastify';
import "react-color-palette/css";
import './colorPicker.scss';

const ColorPickerComponent = ({ color, setColor }) => {

  const handleChangeComplete = (color) => {
    if (color.hex.includes("#ffff")) { // Fixed `.includes()` typo
      toast.error("White is not allowed as a theme color.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      setColor(color.hex);
    }
  };

  return (
    <>
      <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
      <ToastContainer />
    </>
  );
};

export default ColorPickerComponent;
