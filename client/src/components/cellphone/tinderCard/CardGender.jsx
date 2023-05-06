const CardGender = ({character}) => {
    return (
        <p className="gender extra-margin">{`${character.gender_identity}`}</p>
    );
}

export default CardGender;
