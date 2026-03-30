from sqlalchemy import Column, Integer, Text, Date, DateTime
from sqlalchemy.sql import func
from db import Base

class Goal(Base):
    """
    Model for goals table
    """
    __tablename__ = "Goals"

    id = Column(Integer, primary_key=True, autoincrement=True)
    goalname = Column(Text, nullable=False)
    goaldesc = Column(Text)

    creationdate = Column(DateTime(timezone=True), server_default=func.now())
    lastupdated = Column(DateTime(timezone=True), onupdate=func.now())

    enddate = Column(Date)

    userid = Column(Integer, nullable=False)