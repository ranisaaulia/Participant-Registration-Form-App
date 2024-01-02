import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PesertaLomba = () => {
  const [pesertaList, setPesertaList] = useState([]);
  const [inputName, setInputName] = useState('');
  const [indexOfForm, setIndexOfForm] = useState(-1);

  const fetchData = () => {
    axios.get(`http://backendexample.sanbercloud.com/api/contestants`)
      .then(res => {
        setPesertaList(res.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []); 

  const handleDelete = (id) => {
    axios.delete(`http://backendexample.sanbercloud.com/api/contestants/${id}`)
      .then(res => {
        console.log('Delete successful:', res.data);
        fetchData();
        setIndexOfForm(-1);
      })
      .catch(error => {
        console.error('Error deleting data:', error);
      });
  };

  const handleEdit = (index) => {
    setInputName(pesertaList[index].nama);
    setIndexOfForm(index);
  };

  const handleChange = (event) => {
    setInputName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = inputName.trim();

    if (name) {
      if (indexOfForm === -1) {
        axios.post(`http://backendexample.sanbercloud.com/api/contestants`, { nama: name })
          .then(res => {
            console.log('Submission successful:', res.data);
            fetchData(); 
            setInputName('');
          })
          .catch(error => {
            console.error('Error submitting data:', error);
          });
      } else {
        const id = pesertaList[indexOfForm].id;
        axios.put(`http://backendexample.sanbercloud.com/api/contestants/${id}`, { nama: name })
          .then(res => {
            console.log('Edit successful:', res.data);
            fetchData(); 
            setInputName('');
            setIndexOfForm(-1);
          })
          .catch(error => {
            console.error('Error editing data:', error);
          });
      }
    }
  };

  return (
    <>
      <h1>Daftar Peserta Lomba</h1>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pesertaList.map((peserta, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{peserta.name}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                &nbsp;
                <button onClick={() => handleDelete(peserta.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
      <h1>Form Peserta</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Masukkan nama peserta:
          <input type="text" value={inputName} onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default PesertaLomba;
