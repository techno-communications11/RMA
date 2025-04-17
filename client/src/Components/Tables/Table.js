import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import 'animate.css';
import { useUserContext } from '../Context/MyContext';
import TableBodyWrapper from '../../Pages/TableBodyWrapper';
import SearchBar from '../Layout/SearchBar';
import AlertMessage from '../Messages/AlertMessage';
import ModalForm from '../Forms/ModalForm';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../Messages/LoadingSpinner';

const Table = () => {
  
  // State management
  const [state, setState] = useState({
    data: [],
    filteredData: [],
    loading: true,
    error: null,
    stores: [],
    store: null,
    search: '',
    isReady: false,
    alert: { message: '', type: '' },
    modal: {
      data: null,
      fields: {
        RMADate: '',
        RMANumber: '',
        UPSTrackingNumber: '',
      }
    },
    ntid: {},
    serial: { serial: '' }
  });

  const { userData } = useUserContext();
   console.log(userData,'used');
  const { storename } = useParams();
 
  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

  // Helper function to update state
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Show alert message
  const showAlert = (message, type = 'danger') => {
    updateState({ alert: { message, type } });
    setTimeout(() => updateState({ alert: { message: '', type: '' } }), 5000);
  };

  // Fetch stores from API
  const fetchStores = useCallback(async () => {
    try {
      updateState({ loading: true });
      const response = await axios.get(`${BASE_URL}/getstores`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        updateState({ 
          stores: response.data,
          loading: false 
        });
        return response.data;
      }
      throw new Error(`Unexpected status code: ${response.status}`);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      showAlert('Failed to fetch stores.');
      updateState({ loading: false });
      return [];
    }
  }, [BASE_URL]);
  

  // Fetch data based on current store
  const fetchData = useCallback(async (store) => {
    try {
      updateState({ loading: true });
      const response = await axios.get(`${BASE_URL}/getdata`, {
        withCredentials: true,
      });

      let filtered = response.data || [];
      
      if (store) {
        filtered = filtered.filter(row => 
          row.storename && row.storename.toLowerCase() === store.toLowerCase()
        );
      }

      updateState({ 
        data: filtered,
        filteredData: filtered,
        loading: false,
        isReady: true 
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showAlert('Failed to fetch data.');
      updateState({ loading: false });
    }
  }, [BASE_URL]);

  // Set current store based on URL params or user data
  const setCurrentStore = useCallback((stores) => {
    if (!stores.length) return null;

    let currentStore = null;
    
    if (storename) {
      currentStore = stores.find(s => 
        s.Store && s.Store.toLowerCase() === storename.toLowerCase()
      );
    } else if (userData?.storeid) {
      currentStore = stores.find(s => s.id === userData.storeid);
    }

    return currentStore ? currentStore.Store : null;
  }, [storename, userData]);

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      const stores = await fetchStores();
      const currentStore = setCurrentStore(stores);
      updateState({ store: currentStore });
      if (currentStore !== undefined) {
        await fetchData(currentStore);
      }
    };

    initialize();
  }, [fetchStores, fetchData, setCurrentStore]);

  // Handle search functionality
  useEffect(() => {
    if (state.search === '') {
      updateState({ filteredData: state.data });
    } else {
      const lowercasedSearch = state.search.toLowerCase();
      const filtered = state.data.filter(row =>
        Object.values(row).some(
          value => value && value.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      updateState({ filteredData: filtered });
    }
  }, [state.search, state.data]);

 

  // Handle modal operations
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    updateState({ 
      modal: {
        ...state.modal,
        fields: {
          ...state.modal.fields,
          [name]: value
        }
      }
    });
  };

  const handleModalSubmit = async () => {
    if (!state.modal.data?.serial) {
      showAlert('Invalid serial number.', 'warning');
      return;
    }

    try {
      const updatedData = { 
        ...state.modal.data, 
        ...state.modal.fields, 
        serial: state.modal.data.serial 
      };
      
      const response = await axios.post(`${BASE_URL}/updateData`, updatedData, {
        withCredentials: true
      });

      if (response.status === 200) {
        const updated = state.data.map(row =>
          row.serial === state.modal.data.serial 
            ? { ...row, ...state.modal.fields } 
            : row
        );
        
        updateState({ 
          data: updated,
          filteredData: updated,
          modal: {
            data: null,
            fields: {
              RMADate: '',
              RMANumber: '',
              UPSTrackingNumber: '',
            }
          }
        });
        showAlert('Data updated successfully!', 'success');
      }
    } catch (error) {
      showAlert(error.response?.data?.message || 'Error updating data.');
    }
  };

  // Other handlers
  const handleSearch = (e) => {
    updateState({ search: e.target.value });
  };

  const handleNtidChange = (e, rowSerial) => {
    updateState({ 
      ntid: { 
        ...state.ntid, 
        [rowSerial]: e.target.value 
      } 
    });
  };

  const closeModal = () => {
    updateState({ 
      modal: {
        data: null,
        fields: {
          RMADate: '',
          RMANumber: '',
          UPSTrackingNumber: '',
        }
      }
    });
  };

  if (state.error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {state.error}
      </div>
    );
  }

  return (
    <div className="container-fluid p-1">
      <AlertMessage
        message={state.alert.message}
        type={state.alert.type}
        onClose={() => updateState({ alert: { message: '', type: '' } })}
      />
      
      <SearchBar 
        search={state.search} 
        handleSearch={handleSearch} 
      />
      
      {state.loading ? (
        <LoadingSpinner/>
      ) : state.isReady ? (
        <div
          className="table-responsive animate__animated animate__fadeIn"
          style={{ maxHeight: '800px', overflowY: 'auto' }}
        >
          {state.filteredData.length > 0 ? (
            <TableBodyWrapper
              loading={state.loading}
              ntid={state.ntid}
              setModalData={(data) => updateState({ 
                modal: { ...state.modal, data } 
              })}
              filteredData={state.filteredData}
                handleNtidChange={handleNtidChange}
              setSerial={(serial) => updateState({ serial })}
              setModalFields={(fields) => updateState({ 
                modal: { ...state.modal, fields } 
              })}
            />
          ) : (
            <div className="text-center p-4">
              {state.store 
                ? `No data available for ${state.store}`
                : 'No data available'}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-4">Initializing...</div>
      )}
      
      <ModalForm
        show={state.modal.data !== null}
        modalData={state.modal.data}
        modalFields={state.modal.fields}
        handleModalChange={handleModalChange}
        handleModalSubmit={handleModalSubmit}
        onHide={closeModal}
      />
    </div>
  );
};

export default Table;