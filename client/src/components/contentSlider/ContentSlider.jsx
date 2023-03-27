import React, { useState } from 'react';
import reviews from './data';
import { faChevronLeft, faChevronRight, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ContentSlider.css"

const ContentSlider = () => {
  const [index, setIndex] = useState(0);
  const { name, job, image, text } = reviews[index];
  const checkNumber = (number) => {
    if (number > reviews.length - 1) {
      return 0;
    }
    if (number < 0) {
      return reviews.length - 1;
    }
    return number;
  };
  const nextPerson = () => {
    setIndex((index) => {
      let newIndex = index + 1;
      return checkNumber(newIndex);
    });
  };
  const prevPerson = () => {
    setIndex((index) => {
      let newIndex = index - 1;
      return checkNumber(newIndex);
    });
  };
  const randomPerson = () => {
    let randomNumber = Math.floor(Math.random() * reviews.length);
    if (randomNumber === index) {
      randomNumber = index + 1;
    }
    setIndex(checkNumber(randomNumber));
  };

  return (
    <div className='review'>
      <h4 className='author'>{name}</h4>
      <p className='job'>{job}</p>
      <div className='button-container'>
        <button className='prev-btn' onClick={prevPerson}>
        <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className='next-btn' onClick={nextPerson}>
        <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <button className='random-btn' onClick={randomPerson}>
        See All Plans
      </button>
    </div>
  );
};

export default ContentSlider;