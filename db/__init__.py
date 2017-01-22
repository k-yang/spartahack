from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, DECIMAL, Boolean, TEXT, TIMESTAMP
from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class Requests(Base):
    __tablename__ = "Requests"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    intent = Column(String(45))
    location = Column(TEXT)
    video_url = Column(String(400))
    created_on = Column(TIMESTAMP)

    def to_dict(self):
        return dict(
        )


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    intent = Column(String(45))
    name = Column(String(10))

    def to_dict(self):
        return dict(
        )

engine = sa.create_engine(
    'mysql+mysqldb://gestureadmin:SpartansWill@gesture2.cn8pndyiytrv.us-east-1.rds.amazonaws.com:3306/Gesture')
Session = sessionmaker(bind=engine)
