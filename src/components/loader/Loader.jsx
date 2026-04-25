import loader from '../../assets/images/gcLoader.gif';
import './loader.scss';

function Loader() {
  return (
    <>
      <div className="custom-loadingWrapper">
        <img src={loader} className="gif" alt="loader" />
      </div>
    </>
  )
}

export default Loader;