import React from 'react';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatDate';

const PetCard = ({ pet }) => {
  if (!pet) return null;

  return (
    <div className="data-card pet-card">
      <div className="pet-card-header">
        <div className="pet-avatar-large">
          {pet.name.charAt(0)}
        </div>
        <div className="pet-basic-info">
          <h3>{pet.name}</h3>
          <p>{pet.type} &bull; {pet.breed}</p>
        </div>
      </div>
      
      <div className="pet-card-body">
        <div className="info-row">
          <span className="info-label">Kelamin:</span>
          <span className="info-value">{pet.gender}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Lahir:</span>
          <span className="info-value">{formatDate(pet.birthDate)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Berat:</span>
          <span className="info-value">{pet.weight}</span>
        </div>
        {pet.notes && (
          <div className="info-row notes">
            <span className="info-label">Catatan:</span>
            <span className="info-value">{pet.notes}</span>
          </div>
        )}
      </div>
      
      <div className="pet-card-footer">
        <Button variant="outline" className="full-width">Lihat Profil Lengkap</Button>
      </div>
    </div>
  );
};

export default PetCard;