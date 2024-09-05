import React from 'react';

import Card from './Card';
import AddPlacePopup from './AddPlacePopup';

import api from '../utils/api';

export default function Main({ }) {

  const [currentUser, setCurrentUser] = React.useState({});

  const imageStyle = { backgroundImage: `url(${currentUser.avatar})` };

  const [cards, setCards] = React.useState([]);

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);

  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        setCurrentUser(userData);
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, [currentUser, cards]);

  function onEditAvatar() {
    dispatchEvent(new CustomEvent("editAvatar", { detail: currentUser }));

  };

  function onEditProfile() {
    dispatchEvent(new CustomEvent("editProfile", { detail: currentUser }));
  };

  function onAddPlace() {
    setIsAddPlacePopupOpen(true);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  };

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <main className="content">
        <section className="profile page__section">
          <div className="profile__image" onClick={onEditAvatar} style={imageStyle}></div>
          <div className="profile__info">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button className="profile__edit-button" type="button" onClick={onEditProfile}></button>
            <p className="profile__description">{currentUser.about}</p>
          </div>
          <button className="profile__add-button" type="button" onClick={onAddPlace}></button>
        </section>
        <section className="places page__section">
          <ul className="places__list">
            {cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                currentUser={currentUser}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            ))}
          </ul>
        </section>
      </main>
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />
    </div>
  );
}