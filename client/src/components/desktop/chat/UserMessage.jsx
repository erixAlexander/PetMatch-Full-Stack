

const UserMessage = ({index, message, descendingOrderMessages, Image}) => {
    return (
        <div className="single-chat" key={index}>
                      <div className="chat-message-header">
                        <div className="chat-display-img-container">
                          {descendingOrderMessages && (
                            <>
                              <Image
                                cloudName="dhttotcxc"
                                publicId={message?.img?.id}
                                width="500"
                                crop="scale"
                              />
                              <p className="chat-pet-name">{message?.name}</p>
                            </>
                          )}
                        </div>
                        <p className="chat-pet-message">{message?.message}</p>
                      </div>
                    </div>
    );
}

export default UserMessage;
