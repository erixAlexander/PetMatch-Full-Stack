const TinderCardCustom = ({filteredGenderUsers}) => {
  return (
    <div className="card-container">
      {filteredGenderUsers?.map((character, index) => (
        <TinderCard
          ref={childRefs[index]}
          className="swipe"
          key={character.user_id}
          onSwipe={(dir) => swiped(dir, character.user_id, index)}
          onCardLeftScreen={() => outOfFrame(character.first_name, index)}
        >
          <div
            style={{
              backgroundImage: "url(" + character?.images[0]?.url + ")",
            }}
            className="card"
          >
            <div
              title="Double-click To Open This Profile"
              className="overlay"
            >
              <div className="dashboard-pedigree-div">
                <TagsFromBoolean character={character} />
              </div>

              <TagsFromObject character={character} />
              <h2 className="ch-name2">
                <FontAwesomeIcon icon={faUser} title="person" />
                {`${character.first_name}`}
              </h2>
              <h3
                title="Pet Profile"
                onClick={handleSidebar}
                className="pet-name"
              >
                <FontAwesomeIcon icon={faDog} title="doggy" />
                <span className="capitalize">{`${character.pet_name}`}</span>
              </h3>
              <p className="ch-name4">{`${character.gender_identity}`}</p>
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default TinderCardCustom;
