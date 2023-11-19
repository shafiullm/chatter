from sqlalchemy import create_engine, Column, Integer, String, DateTime, MetaData, Text
from datetime import datetime
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
metadata_obj = MetaData()

Base = declarative_base(metadata=metadata_obj)

class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    username = Column(String(16), nullable=False)
    avatar_src = Column(String(128))

    def to_dict(self):
        return {'user_id': self.user_id, 'username': self.username, 'avatar_src': self.avatar_src}
    
class Chat(Base):
    __tablename__ = 'chats'
    chat_id = Column(Integer, primary_key=True)
    from_msg = Column(String(256), nullable=False)
    to_msg = Column(String(256), nullable=False)
    msg = Column(Text, nullable=False)
    timestamp = Column(DateTime, nullable=False)

    def to_dict(self):
        return {'from_msg': self.from_msg, 'to_msg': self.to_msg, 'msg': self.msg, 'timestamp': self.timestamp.isoformat() if self.timestamp else None}


database_url = "postgresql://postgres:root@localhost:5432/chatter"
engine = create_engine(database_url)

def createDB():
    metadata_obj.create_all(engine)
    try:
        with engine.connect() as connection:
            print("Connection successful!")
    except OperationalError as e:
        print(f"Error: {e}")

def userLogin(name, avatar):
    Session = sessionmaker(bind=engine)
    session = Session()

    userSelected = session.query(User).filter_by(username=name).first()

    if userSelected is None:
            print("creating new user since username is not found")
            new_user = User(username=name, avatar_src=avatar)
            session.add(new_user)
            session.commit()

    session.close()
    return name

def chatAdd(chat):
    Session = sessionmaker(bind=engine)
    session = Session()
    toMsg = chat['to']
    fromMsg = chat['from']
    msg = chat['msg']
    
    # Get the current time without considering the timezone
    current_time = datetime.now()
    # Format the current time as a timestamp string
    timestamp_str = current_time.strftime("%Y-%m-%d %H:%M:%S")

    new_chat = Chat(to_msg=toMsg, from_msg=fromMsg, msg=msg, timestamp = timestamp_str)
    session.add(new_chat)
    session.commit()
    session.close()
    return chat
    Session = sessionmaker(bind=engine)
    session = Session()
    toMsg = chat['to']
    fromMsg = chat['from']
    msg = chat['msg']
    
    # Get the current time without considering the timezone
    current_time = datetime.now()
    # Format the current time as a timestamp string
    timestamp_str = current_time.strftime("%Y-%m-%d %H:%M:%S")
    
    new_chat = Chat(to_msg=toMsg, from_msg=fromMsg, msg=msg, timestamp = timestamp_str)
    session.add(new_chat)
    session.commit()
    session.close()
    return chat

def getUsers():
    Session = sessionmaker(bind=engine)
    session = Session()

    all_users = session.query(User).all()

    session.close()
    return all_users

def getChats():
    Session = sessionmaker(bind=engine)
    session = Session()

    all_chats = session.query(Chat).all()

    session.close()
    return all_chats

