import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useEvidences } from '../context/EvidencesContext';
import Changer from '../components/Changer';

function EvidenceGallery() {
  const [images, setImages] = useState([]);
  const { getEvidences, evidences } = useEvidences();
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(null);

  useEffect(() => {
    getEvidences();
  }, []);

  // Obtener las imágenes
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/images');
      setImages(response.data);
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleEvidenceChange = (evidenceId) => {
    setSelectedEvidenceId(evidenceId);
  };

  // Eliminar imágenes
  const handleDeleteImage = async (imageId, imageUrl) => {
    try {
      await axios.delete(`http://localhost:3000/api/images/${imageId}`, { data: { imageUrl } });
      // Actualizar el estado para eliminar la URL de la imagen localmente
      setImages(images.map(image => 
        image._id === imageId 
          ? { ...image, imageUrls: image.imageUrls.filter(url => url !== imageUrl) }
          : image
      ));
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }
  };

  // Filtrar las imágenes por evidencia
  const filteredImages = selectedEvidenceId !== null
    ? images.filter(image => image.evidenceId === selectedEvidenceId)
    : images;

  return (
    <div className=''>
      <Changer />
      <h2 className='text-2xl font-bold text-center text-black p-2'>Galeria de evidencias</h2>
      <div className=''>
        <p className='text-black '>Selecciona una evidencia:</p>
        <select className='text-black' onChange={(e) => handleEvidenceChange(e.target.value)}>
          <option value={null}>Todas las evidencias</option>
          {evidences.map(evidence => (
            <option className='text-black' key={evidence._id} value={evidence._id}>{evidence.title}</option>
          ))}
        </select>
      </div>
      {filteredImages.length === 0 ? (
        <p className='text-red-500'>No se encontraron imágenes asociadas.</p>
      ) : (
        <div className="columns-3">
          {filteredImages.map((image, index) => (
            <div key={index} className="relative">
              {image.imageUrls.map((url, idx) => (
                <div key={idx} className="relative mb-4">
                  <img
                    className="w-80 h-80 bg-slate-700 rounded-lg"
                    src={`http://localhost:3000/${url}`}
                    alt={`Evidence ${index + 1} - Image ${idx + 1}`}
                  />
                  <button
                    className="absolute bottom-0 right-10 rounded-lg bg-red-500 text-white p-2"
                    onClick={() => handleDeleteImage(image._id, url)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EvidenceGallery;