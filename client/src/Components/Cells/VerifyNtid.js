import React, { useState } from "react";
import AlertMessage from "../Messages/AlertMessage";
import { useNavigate } from "react-router-dom";
import Button from "../Events/Button";

function VerifyNtid({ ntid, rowntid, rowold_imei }) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { key, value } = React.useMemo(() => {
    if (ntid && typeof ntid === "object") {
      const entry = Object.entries(ntid)[0] || [];
      return { key: entry[0], value: entry[1] };
    }
    return { key: "", value: "" };
  }, [ntid]);

  const handleVerifyNtid = () => {
    if (rowold_imei && rowold_imei !== "" && rowntid && rowntid !== "") {
      navigate(`/userimageupload/${rowold_imei}/${rowntid}`);
    }

    if (!value || value.length !== 8) {
      setError({ message: "Invalid NTID", type: "danger" });
      return;
    }

    setError(null);

    navigate(`/userimageupload/${key}/${value}`);
  };

  return (
    <div>
      {error && (
        <AlertMessage
          message={error.message}
          type={error.type}
          onClose={() => setError(null)}
        />
      )}

      {rowntid ? (
        <Button
          onClick={handleVerifyNtid}
          variant="btn-md btn-success small"
          label="Verified"
        />
      ) : (
        <Button
          onClick={handleVerifyNtid}
          variant="btn-md btn-success small"
          label="Verify"
        />
      )}
    </div>
  );
}

export default VerifyNtid;
