import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import './App.css'; // Custom styles

const App = () => {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  // Function to handle pincode lookup
  const handleLookup = async () => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setError('Pincode must be exactly 6 digits and contain only numbers.');
      setData([]); // Clear previous data
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data[0].Status === 'Error') {
        setError('Invalid Pincode or No data found.');
        setData([]);
      } else {
        setData(response.data[0].PostOffice);
      }
    } catch (error) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle input changes for pincode
  const handleChange = (e) => {
    setPincode(e.target.value);
  };

  // Function to handle input changes for the filter
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Filter the post office data based on the filter input
  const filteredData = data.filter(item =>
    item.Name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>Pincode Lookup</h1>
      <input 
        id="name"
        type="text"
        value={pincode}
        onChange={handleChange}
        placeholder="Enter 6-digit Pincode"
      />
      <button onClick={handleLookup}>Lookup</button><br/>

      {/* Show loader while fetching data */}
      {loading && <Loader />}
      {/* Show error message if there is an error */}
      {error && <p className="error-message">{error}</p>}
      
      {/* Filter input */}
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Filter by Post Office"
      />
      
      {/* Display the number of post offices found */}
      {data.length > 0 && !loading && !error && (
        <p>{filteredData.length} Post Office{filteredData.length !== 1 ? 's' : ''} found.</p>
      )}
      
      {/* Display a message when no data is found */}
      {filteredData.length === 0 && !loading && !error && (
        <p>Couldn’t find the postal data you’re looking for...</p>
      )}
      
      {/* List of filtered post offices */}
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>
            <strong>Post Office:</strong> {item.Name}<br />
            <strong>Pincode:</strong> {item.Pincode}<br />
            <strong>District:</strong> {item.District}<br />
            <strong>State:</strong> {item.State}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;