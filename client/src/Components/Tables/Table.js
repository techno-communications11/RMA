import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "animate.css";
import { useUserContext } from "../Context/MyContext";
import TableBodyWrapper from "../../Pages/TableBodyWrapper";
import SearchBar from "../Layout/SearchBar";
import AlertMessage from "../Messages/AlertMessage";
import ModalForm from "../Forms/ModalForm";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../Messages/LoadingSpinner";
import GetStores from "../Apis/GetStores";

const Table = ({ Columns, getdata, loading, error }) => {
  const [state, setState] = useState({
    data: [],
    filteredData: [],
    loading: false,
    error: null,
    stores: [],
    store: null,
    search: "",
    isReady: false,
    alert: { message: "", type: "" },
    modal: {
      data: null,
      fields: {
        RMADate: "",
        RMANumber: "",
        UPSTrackingNumber: "",
      },
    },
    ntid: {},
    old_imei: { old_imei: "" },
  });

  const { userData } = useUserContext();
  const { paramed_store_name } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const showAlert = (message, type = "danger") => {
    updateState({ alert: { message, type } });
    setTimeout(() => updateState({ alert: { message: "", type: "" } }), 5000);
  };

  const fetchStores = useCallback(async () => {
    try {
      updateState({ loading: true });
      const data = await GetStores(
        (loading) => updateState({ loading }),
        (error) => updateState({ error })
      );
      if (Array.isArray(data) && data.length > 0) {
        console.log("Fetched stores:", data);
        updateState({ stores: data, loading: false });
        return data;
      }
      throw new Error("No stores data received");
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      updateState({
        error: error.message || "Failed to fetch stores",
        loading: false,
      });
      return [];
    }
  }, []);

  const fetchData = useCallback(async (store, getdata) => {
    try {
      updateState({ loading: true, error: null }); // Clear previous errors
      if (!Array.isArray(getdata)) {
        console.log("Invalid getdata format:", getdata);
        updateState({
          error: "Invalid data format received",
          loading: false,
          isReady: true,
        });
        return;
      }
      if (!store) {
        console.log("No store selected for filtering");
        updateState({
          error: "No store selected",
          loading: false,
          isReady: true,
          data: [],
          filteredData: [],
        });
        return;
      }
      console.log("getdata content:", getdata); // Log getdata for debugging
      let filtered = getdata;
      filtered = filtered.filter((row) => {
        const rowStoreName =
          row.store ||
          row.store_name ||
          row.storename ||
          row.address ||
          row.store_address;
        const isMatch =
          rowStoreName &&
          store &&
          rowStoreName.toLowerCase().trim() === store.toLowerCase().trim();
        console.log(
          `Comparing rowStoreName: "${rowStoreName}" with store: "${store}" - Match: ${isMatch}`
        ); // Log each comparison
        return isMatch;
      });
      console.log("Filtered data:", filtered); // Log filtered results
      if (filtered.length === 0) {
        updateState({
          error: `No data found for store: ${store}`,
          loading: false,
          isReady: true,
          data: [],
          filteredData: [],
        });
      } else {
        updateState({
          data: filtered,
          filteredData: filtered,
          loading: false,
          isReady: true,
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      updateState({
        error: error.message || "Failed to fetch data",
        loading: false,
        isReady: true,
      });
    }
  }, []);

  const setCurrentStore = useCallback(
    (stores) => {
      if (!Array.isArray(stores) || stores.length === 0) {
        console.log("No stores available");
        return null;
      }
      if (paramed_store_name) {
        const cleanStoreName = paramed_store_name.trim().toLowerCase();
        const foundStore = stores.find((s) => {
          const storeName = s?.store?.toLowerCase();
          const address = s?.address?.toLowerCase();
          return (
            (storeName && storeName === cleanStoreName) ||
            (address && address === cleanStoreName)
          );
        });
          if(foundStore) {
            return foundStore.store || foundStore.address || null;
          }else {
           
          updateState({
            error: `Store or address not found: ${paramed_store_name}`,
            isReady: true,
          });
          return null;
          }


      
      }
      if (userData?.storeid) {
        const foundStore = stores.find((s) => s.id === userData.storeid);
        console.log("Found store by userData.storeid:", foundStore);
        return foundStore?.store || foundStore?.address || null;
      }
      return null;
    },
    [paramed_store_name, userData]
  );

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      const stores = await fetchStores();
      if (!mounted) return;
      const currentStore = setCurrentStore(stores);
      console.log("Selected store:", currentStore, "Stores:", stores);
      updateState({ store: currentStore });
      if (currentStore) {
        await fetchData(currentStore, getdata);
      } else {
        updateState({
          error: "No valid store selected",
          isReady: true,
          loading: false,
        });
      }
    };
    initialize();
    return () => {
      mounted = false;
    };
  }, [fetchStores, setCurrentStore, getdata]);

  useEffect(() => {
    if (state.data.length === 0) {
      updateState({ filteredData: [] });
      return;
    }
    if (state.search === "") {
      updateState({ filteredData: state.data });
    } else {
      const lowercasedSearch = state.search.toLowerCase();
      const filtered = state.data.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      updateState({ filteredData: filtered });
    }
  }, [state.search, state.data]);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    updateState({
      modal: {
        ...state.modal,
        fields: {
          ...state.modal.fields,
          [name]: value,
        },
      },
    });
  };

  const handleModalSubmit = async () => {
    if (!state.modal.data?.old_imei) {
      showAlert("Invalid old_imei number.", "warning");
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/updateData`,
        {
          ...state.modal.data,
          ...state.modal.fields,
          old_imei: state.modal.data.old_imei,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const updated = state.data.map((row) =>
          row.old_imei === state.modal.data.old_imei
            ? { ...row, ...state.modal.fields }
            : row
        );
        updateState({
          data: updated,
          filteredData: state.search
            ? updated.filter((row) =>
                Object.values(row).some((value) =>
                  value?.toString().toLowerCase().includes(state.search.toLowerCase())
                )
              )
            : updated,
          modal: {
            data: null,
            fields: {
              RMADate: "",
              RMANumber: "",
              UPSTrackingNumber: "",
            },
          },
        });
        showAlert("Data updated successfully!", "success");
      }
    } catch (error) {
      showAlert(error.response?.data?.message || "Error updating data.");
    }
  };

  const handleSearch = (e) => {
    updateState({ search: e.target.value });
  };

  const handleNtidChange = (e, rowOldImei) => {
    updateState({
      ntid: {
        ...state.ntid,
        [rowOldImei]: e.target.value,
      },
    });
  };

  const closeModal = () => {
    updateState({
      modal: {
        data: null,
        fields: {
          RMADate: "",
          RMANumber: "",
          UPSTrackingNumber: "",
        },
      },
    });
  };

  if (error || state.error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error || state.error}
      </div>
    );
  }

  return (
    <div className="container-fluid p-1">
      <AlertMessage
        message={state.alert.message}
        type={state.alert.type}
        onClose={() => updateState({ alert: { message: "", type: "" } })}
      />
      <SearchBar search={state.search} handleSearch={handleSearch} />
      {loading || state.loading ? (
        <LoadingSpinner />
      ) : state.isReady ? (
        <div
          className="table-responsive animate__animated animate__fadeIn"
          style={{ maxHeight: "800px", overflowY: "auto" }}
        >
          {state.filteredData.length > 0 ? (
            <TableBodyWrapper
              Columns={Columns}
              loading={state.loading}
              ntid={state.ntid}
              setModalData={(data) =>
                updateState({ modal: { ...state.modal, data } })
              }
              filteredData={state.filteredData}
              handleNtidChange={handleNtidChange}
              setOld_imei={(old_imei) => updateState({ old_imei })}
              setModalFields={(fields) =>
                updateState({ modal: { ...state.modal, fields } })
              }
            />
          ) : (
            <div className="text-center p-4">
              {state.search && state.data.length > 0
                ? "No filtered data"
                : state.store
                ? `No data available for ${state.store}`
                : "No data available"}
            </div>
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )}
      <ModalForm
        show={state.modal.data !== null}
        modalData={state.modal.data}
        modalFields={state.modal.fields}
        handleModalChange={handleModalChange}
        handleModalSubmit={handleModalSubmit}
        onHide={closeModal}
        setModalData={(data) =>
          updateState({ modal: { ...state.modal, data } })
        }
      />
    </div>
  );
};

export default Table;