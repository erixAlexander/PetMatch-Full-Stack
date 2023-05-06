import React from 'react';

const MatchMessage = ({index, descendingOrderMessages, Image, message}) => {
    return (
        <div className="single-chat" key={index}>
                      <div className="user-chat-message-header">
                        <div className="user-chat-display-img-container">
                          <p className="user-chat-pet-message">
                            {message.message}
                          </p>
                          <div className="chat-text">
                            {descendingOrderMessages && (
                              <Image
                                cloudName="dhttotcxc"
                                publicId={message?.img.id}
                                width="500"
                                crop="scale"
                              />
                            )}
                            <p className="chat-pet-name">{message.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
    );
}

export default MatchMessage;
