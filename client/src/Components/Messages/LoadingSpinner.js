import '../../Styles/LoadingSpinner.css';
function LoadingSpinner() {
  return (
    <div className="loader-wrapper">
      <div className="lds-default">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;